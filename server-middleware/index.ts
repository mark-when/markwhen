import * as admin from "firebase-admin"
import * as express from "express"
const app = express.default()
app.use(express.json())

admin.initializeApp({
  credential: admin.credential.applicationDefault(),
  databaseURL: "https:/timelinecascade.firebaseio.com",
  storageBucket: "timelinecascade.appspot.com",
  projectId: "timelinecascade"
});

interface Request extends express.Request {
  auth?: any
  timelineFile?: string
  timelinePath?: string
}

function failUnauthorized(res: express.Response, message: string) {
  let response =
    {
      error: 'Unauthorized.'
    } as { error: string, message?: string }
  if (message) {
    response.message = message
  }
  res.status(401).json(response).end()
}

const chooseUserName = '/api/chooseUserName'
const share = '/api/share'
const explore = '/api/explore'
const cascade = '/api/cascade/:username/:cascade?'
const requiresAuth = [chooseUserName, share]

app.use(requiresAuth, async (req: Request, res, next) => {
  let token
  if (req.headers && req.headers.authorization) {
    const parts = req.headers.authorization.split(' ');
    if (parts.length === 2 && parts[0] === 'Bearer') {
      token = parts[1];
    } else {
      return failUnauthorized(res, "Unable to parse authorization token.")
    }
  } else {
    return failUnauthorized(res, "Missing authorization token in headers.")
  }
  let verifiedToken
  try {
    verifiedToken = await admin.auth().verifyIdToken(token)
  } catch (error) {
    console.error(error)
    return failUnauthorized(res, "Unable to verify token.")
  }
  req.auth = verifiedToken
  next()
})

const RESERVED_USERNAMES = ['api', 'assets', 'from']
app.post(chooseUserName, async (req: Request, res) => {
  const username = req.body.username
  if (!username) {
    return res.status(400).json({
      error: "Missing username"
    }).end()
  }

  if (!username.match(/^[\w\d_-]+$/)) {
    return res.status(400).json({
      error: "Usernames can only have letters, digits, underscores, and dashes."
    }).end()
  }

  if (RESERVED_USERNAMES.includes(username) || username.startsWith("_")) {
    return res.status(400).json({
      error: "Username unavailable."
    }).end()
  }

  try {
    await admin.firestore().runTransaction(async transaction => {
      const usernameInUse = await transaction.get(
        admin.firestore().collection('users').where('username', '==', username)
      )
      if (!usernameInUse.empty) {
        console.error("username already in use", username)
        throw new Error('Username already in use')
      }
      const uid = req.auth.uid
      transaction.set(admin.firestore().doc(`users/${uid}`), { username }, { merge: true })
    })
    return res.status(200).json({ username })
  } catch (err) {
    console.error(err)
    return res.status(409).json({ error: "Username already in use" })
  }
})

app.post(share, async (req: Request, res) => {
  const timeline = req.body.timeline
  if (!timeline) {
    return res.status(400).json({
      error: "Missing timeline"
    }).end()
  }

  const name = req.body.name
  if (!name) {
    return res.status(400).json({
      error: "Missing timeline name"
    }).end()
  }

  if (!name.match(/^[\w\d_-]+$/)) {
    return res.status(400).json({
      error: "Timeline names can only contain letters, digits, underscores, and dashes."
    }).end()
  }

  const timestamp = Date.now()

  const path = `${req.auth.uid}/${req.body.name}`
  const file = admin.storage().bucket().file(path)
  await file.save(req.body.timeline, {
    contentType: "text/plain", metadata: {
      lastEdited: timestamp
    }
  })
  return res.status(200).send()
})

async function getAllUserIds(): Promise<string[]> {
  const users = await admin.auth().listUsers()
  return users.users.map(user => user.uid)
}

interface UserAndId {
  userId: string
  username: string
}

async function getAllUserNamesAndIds(): Promise<UserAndId[]> {
  const users = (await getAllUserIds()).map(userId => admin.firestore().doc(`users/${userId}`))
  const usernames = await admin.firestore().getAll(...users, { fieldMask: ['username'] })
  return usernames.filter(userDoc => userDoc.exists && !!userDoc.data()!.username).map(userDoc => {
    return {
      username: userDoc.data()!.username,
      userId: userDoc.id
    }
  })
}

app.get(explore, async (req, res) => {
  const users = await getAllUserNamesAndIds()
  const allFiles = await users.map(async user => {
    const [files] =
      await admin.storage().bucket().getFiles({ prefix: user.userId })
    return files.map(f => {
      let cascadePath
      if (user.username === f.name.substring(user.userId.length + 1)) {
        cascadePath = user.username
      } else {
        cascadePath = user.username + f.name.substring(user.userId.length)
      }
      return {
        cascadePath, filePath: f.name
      }
    })
  })

  const files = await (await Promise.all(allFiles)).flatMap(f => f)
  res.status(200).json({ cascades: files })
})

app.get(cascade, async (req, res) => {
  const path = `${req.params.username}/${req.params.cascade ? req.params.cascade : req.params.username}`
  const file = await admin.storage().bucket().file(path)
  const [exists] = await file.exists()
  if (!exists) {
    return res.status(404).send()
  }
  res.contentType('text/html')
  res.status(200)
  file.createReadStream().pipe(res)
})

app.get('/:user/:timeline?', async (req: Request, res, next) => {
  const user = await admin.firestore().collection(`users`).where('username', '==', req.params.user).get()
  if (!user || user.empty) {
    return res.redirect('/')
  }
  if (user.size > 1) {
    console.warn('More than one user with this username!', req.params.user)
  }
  const userId = user.docs[0].id
  const path = `${userId}/${req.params.timeline ? req.params.timeline : req.params.user}`
  const file = admin.storage().bucket().file(path)
  const exists = await file.exists()
  if (!exists[0]) {
    return res.redirect('/')
  }
  const timelineFile = await file.download()
  req.timelineFile = timelineFile.toString()
  req.timelinePath = `${req.params.user}${req.params.timeline ? ('/' + req.params.timeline) : ''}`
  next()
})


module.exports = app

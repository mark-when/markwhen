import * as admin from "firebase-admin"
import * as express from "express"
const app = express.default()
app.use(express.json())

if (!admin.app()) {
  admin.initializeApp({
    credential: admin.credential.applicationDefault(),
    databaseURL: "https:/timelinecascade.firebaseio.com",
    storageBucket: "timelinecascade.appspot.com",
    projectId: "timelinecascade"
  });
}

function failUnauthorized(res, message) {
  let response =
  {
    error: 'Unauthorized.'
  }
  if (message) {
    response.message = message
  }
  res.status(401).json(response).end()
}

app.use(async (req, res, next) => {
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

app.post('/chooseUserName', async (req, res) => {
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

module.exports = app

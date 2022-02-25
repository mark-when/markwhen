import { Plugin } from '@nuxt/types'
import * as axios from "axios"

export interface Rpc {
  get: (path: string) => Promise<axios.AxiosResponse<any>>
  post: (path: string, data?: any) => Promise<axios.AxiosResponse<any>>
  del: (path: string) => Promise<axios.AxiosResponse<any>>
  put: (path: string, data?: any, headers?: any) => Promise<axios.AxiosResponse<any>>
}

declare module 'vue/types/vue' {
  interface Vue {
    $rpc: Rpc
  }
}

declare module '@nuxt/types' {
  interface NuxtAppOptions {
    $rpc: Rpc
  }
  interface Context {
    $rpc: Rpc
  }
}

declare module 'connect' {
  interface IncomingMessage {
    timelinePath?: string
    timelineFile?: string
  }
}

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth"
// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCWzyvdh_bxpqGgmNTjTZ833Dta4_XzKeU",
  authDomain: "timelinecascade.firebaseapp.com",
  projectId: "timelinecascade",
  storageBucket: "timelinecascade.appspot.com",
  messagingSenderId: "814631906805",
  appId: "1:814631906805:web:bc719ed95ad32438bdc4bc",
  measurementId: "G-GKJKQL44VC"
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);
const auth = getAuth(firebaseApp)

const rpc: Plugin = (context, inject) => {
  const { $axios, $config } = context
  const defaultHeaders = async () => {
    const token = await auth.currentUser?.getIdToken()
    if (!token) {
      return {}
    }
    const config = {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
    return config
  }

  const post = async (path: string, data?: any) => {
    return $axios.post(path, data, await defaultHeaders())
  }
  const get = async (path: string) => {
    return $axios.get(path, await defaultHeaders())
  }
  const del = async (path: string) => {
    return $axios.delete(path, await defaultHeaders())
  }
  const put = async (path: string, data?: any, headers?: any) => {
    if (headers) {
      headers["Authorization"] = `Bearer ${await auth.currentUser!.getIdToken()}`
    }
    return $axios.put(path, data, headers ? { headers } : await defaultHeaders())
  }
  const callRpc = { post, get, del, put }
  inject('rpc', callRpc)
}

export default rpc
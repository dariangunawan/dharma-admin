// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app"
import { getAuth } from "firebase/auth"
import { getDatabase } from "firebase/database"
import { getStorage } from "firebase/storage"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCvTj5SBkSbXG9ar-5pOR1PLSsDzr2jV28",
  authDomain: "dharma-e4a5a.firebaseapp.com",
  databaseURL:
    "https://dharma-e4a5a-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "dharma-e4a5a",
  storageBucket: "dharma-e4a5a.appspot.com",
  messagingSenderId: "604961392968",
  appId: "1:604961392968:web:049ed35e340d5b818f0b7d",
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)
const auth = getAuth(app)
const db = getDatabase(app)
const storage = getStorage(app)

export { app, auth, db, storage }

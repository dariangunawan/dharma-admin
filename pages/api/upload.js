import multiparty from 'multiparty'
import { initializeApp } from "firebase/app";
import { getStorage, ref, uploadBytes,getDownloadURL } from 'firebase/storage'
import fs from 'fs'

export default async function handle(req, res) {
  const form = new multiparty.Form();

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
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const storage = getStorage(app);

  const { fields, files } = await new Promise((resolve, reject) => {
    form.parse(req, (err, fields, files) => {
      if (err) reject(err)
      resolve({ fields, files })

    })

  })

  const downloadUrls = [];

  for (const file of files.file) {
    //upload instructions for firebase storage
    const filePath = (file.path);
    const fileRef = ref(storage, filePath);
    const fileBuffer = fs.readFileSync(file.path); 

    await uploadBytes(fileRef, fileBuffer);
    const downloadUrl = await getDownloadURL(fileRef);
    downloadUrls.push(downloadUrl);
  }

  console.log(downloadUrls);
  return res.json(downloadUrls);
}

export const config = {
  api: { bodyParser: false }
}
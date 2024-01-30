import multiparty from 'multiparty'
import { initializeApp } from "firebase/app";
import { getStorage, ref, uploadBytes,getDownloadURL } from 'firebase/storage'
import fs from 'fs'

export default async function handle(req, res) {
  const form = new multiparty.Form();

  // Your web app's Firebase configuration
  const firebaseConfig = {
    apiKey: "AIzaSyC13rQELepobcBsW9-WoIvw7FgqGGq7t1s",
    authDomain: "next-dharma-8802e.firebaseapp.com",
    projectId: "next-dharma-8802e",
    storageBucket: "next-dharma-8802e.appspot.com",
    messagingSenderId: "967175521026",
    appId: "1:967175521026:web:6f04b1728caaf1ea35b81b"

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
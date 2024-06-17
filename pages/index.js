import Layout from "@/components/Layout"
import { auth } from "@/lib/firebase"
import axios from "axios"
import { onAuthStateChanged } from "firebase/auth"
import { useEffect, useState } from "react"

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(null)
  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        axios.get("/api/auth?userId=" + user.uid).then((res) => {
          setIsLoggedIn({ ...res.data, image: user?.photoURL })
        })
        // User is signed in
        // Redirect to protected routes or display logged-in content
      } else {
        setIsLoggedIn(null)
        // User is not signed in
        console.log("User is not signed in")
        // Redirect to login or registration page
      }
    })
  }, [])
  return (
    <Layout>
      <div className="text-blue-900 flex justify-between">
        <h2>
          <b>Hello, {isLoggedIn?.name}</b>
        </h2>
        <div className="flex bg-gray-300 text-black gap-1 rounded-md overflow-hidden items-center flex-row">
          <img src={isLoggedIn?.image} alt="" className="w-12 h-12" />
          <div className="ml-2">
            <p className="pr-2">{isLoggedIn?.role || "user"}</p>
          </div>
        </div>
      </div>
    </Layout>
  )
}

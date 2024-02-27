import { auth } from "@/lib/firebase"
import { FacebookAuthProvider, signInWithPopup } from "firebase/auth"
import { useRouter } from "next/router"
import { useState } from "react"
import { toast } from "react-toastify"

const FacebookLoginButton = () => {
  const router = useRouter()
  const facebookProvider = new FacebookAuthProvider()

  const signInWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, facebookProvider)
      toast.success("Selamat, Login telah berhasil")
      return router.replace("/")
      // Handle successful login
    } catch (error) {
      console.log(error, "error")
      toast.error("Login Gagal. Silahkan ulangi kembali")
      // Handle errors
    }
  }

  return (
    <div className="w-1/2 pl-2" onClick={signInWithGoogle}>
      <button
        type="button"
        class="w-full flex items-center justify-center bg-blue-800 dark:bg-gray-900 border border-gray-300 rounded-lg shadow-md px-6 py-2 text-sm font-medium text-white dark:text-blue-800 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
      >
        <svg
          width="20"
          height="20"
          fill="currentColor"
          class="mr-2"
          viewBox="0 0 1792 1792"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M1343 12v264h-157q-86 0-116 36t-30 108v189h293l-39 296h-254v759h-306v-759h-255v-296h255v-218q0-186 104-288.5t277-102.5q147 0 228 12z"></path>
        </svg>
        Facebook
      </button>
    </div>
  )
}

export default FacebookLoginButton

import { signOut } from "next-auth/react"
import Link from "next/link"
import { useRouter } from "next/router"
import Logo from "@/components/Logo"
import { auth } from "@/lib/firebase"
import { toast } from "react-toastify"

export default function Nav({ show, role = "admin" }) {
  const inactiveLink = "flex gap-1 p-1"
  const activeLink = inactiveLink + " bg-white text-blue-900 rounded-lg"
  const router = useRouter()
  const { pathname } = router
  const handleLogOut = () => {
    auth
      .signOut()
      .then(() => {
        toast.success("User signed out successfully")
        // Redirect to login page or display logout message
      })
      .catch((error) => {
        console.error("Error signing out:", error)
      })
  }

  const isOwner = role == "owner" ? "bg-red-900" : "bg-green-900"
  const isAdmin = role == "admin" ? "bg-blue-900" : isOwner
  return (
    <aside
      className={`${
        show ? "left-0" : "-left-full"
      } top-0 text-white p-4 pr-0 mr-4 fixed w-full ${isAdmin} h-full transition-all md:static md:w-auto`}
    >
      <div className="mb-4 mr-4">
        <Logo role={role} />
      </div>
      <nav className="flex flex-col gap-2">
        {inArray(role, ["admin"]) && (
          <Link
            href={"/"}
            className={pathname === "/" ? activeLink : inactiveLink}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
              />
            </svg>
            Dashboard
          </Link>
        )}

        {inArray(role, ["admin"]) && (
          <Link
            href={"/services"}
            className={
              pathname.includes("/services") ? activeLink : inactiveLink
            }
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9.53 16.122a3 3 0 00-5.78 1.128 2.25 2.25 0 01-2.4 2.245 4.5 4.5 0 008.4-2.245c0-.399-.078-.78-.22-1.128zm0 0a15.998 15.998 0 003.388-1.62m-5.043-.025a15.994 15.994 0 011.622-3.395m3.42 3.42a15.995 15.995 0 004.764-4.648l3.876-5.814a1.151 1.151 0 00-1.597-1.597L14.146 6.32a15.996 15.996 0 00-4.649 4.763m3.42 3.42a6.776 6.776 0 00-3.42-3.42"
              />
            </svg>
            Services
          </Link>
        )}

        {inArray(role, ["admin", "owner", "designer"]) && (
          <Link
            href={"/orders"}
            className={pathname.includes("/orders") ? activeLink : inactiveLink}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3.75 12h16.5m-16.5 3.75h16.5M3.75 19.5h16.5M5.625 4.5h12.75a1.875 1.875 0 010 3.75H5.625a1.875 1.875 0 010-3.75z"
              />
            </svg>
            Orders
          </Link>
        )}

        {inArray(role, ["admin"]) && (
          <Link
            href={"/chat"}
            className={pathname.includes("/chat") ? activeLink : inactiveLink}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3.75 12h16.5m-16.5 3.75h16.5M3.75 19.5h16.5M5.625 4.5h12.75a1.875 1.875 0 010 3.75H5.625a1.875 1.875 0 010-3.75z"
              />
            </svg>
            Chat
          </Link>
        )}
        <button onClick={handleLogOut} className={inactiveLink}>
          Log out
        </button>
      </nav>
    </aside>
  )
}

const inArray = (needle, haystack) => {
  var length = haystack.length
  for (var i = 0; i < length; i++) {
    if (haystack[i] == needle) return true
  }
  return false
}

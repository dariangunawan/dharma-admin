import Layout from "@/components/Layout";
import { useSession } from "next-auth/react";

export default function Home() {
  const { data: session } = useSession()
  return <Layout>
    <div className="text-blue-900 flex justify-between">
      <h2>
        <b>Hello, {session?.user?.name}</b>
      </h2>
      <div className="flex bg-gray-300 text-black gap-1 rounded-md overflow-hidden">
        <img src={session?.user?.image} alt="" className="w-12 h-12" />
      </div>
    </div>
  </Layout>
}
import Layout from "@/components/Layout"
import { auth } from "@/lib/firebase"
import axios from "axios"
import { onAuthStateChanged } from "firebase/auth"
import { useEffect, useState } from "react"

export default function OrdersPage() {
  const [orders, setOrders] = useState([])
  const [isLoggedIn, setIsLoggedIn] = useState(null)

  const loadOrder = () => {
    axios.get("/api/orders").then((response) => {
      setOrders(response.data)
    })
  }

  useEffect(() => {
    loadOrder()
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

  const handleChange = (status, orderId) => {
    axios.put("/api/orders", { status, orderId }).then((response) => {
      loadOrder()
    })
  }

  const deleteOrder = (orderId) => {
    axios.delete("/api/orders", { orderId }).then((response) => {
      loadOrder()
    })
  }

  return (
    <Layout>
      <h1>Orders</h1>
      <table className="basic">
        <thead>
          <tr>
            <th>Date</th>
            <th>Recipient</th>
            <th>Services</th>
            <th>Nilai</th>
            <th>Type Order</th>
            {isLoggedIn?.role != "owner" && <th>Type Pembayaran</th>}
            <th>Status</th>
            {isLoggedIn?.role == "owner" && <th>Penghasilan</th>}
            {/* <th>Aksi</th> */}
          </tr>
        </thead>
        <tbody>
          {orders.length > 0 &&
            orders.map((order) => {
              return (
                <tr>
                  <td>{new Date(order.createdAt).toLocaleString()}</td>
                  <td>
                    {order.name} {order.email}
                    <br />
                  </td>
                  <td>
                    {order.line_items.map((l) => (
                      <>
                        {l.price_data?.product_data?.name ||
                          l.price_data?.product_data.title}{" "}
                        x{l.quantity}
                        <br />
                      </>
                    ))}
                  </td>
                  <td>
                    {order.line_items.reduce(
                      (cur, item) => cur + item?.total || 0,
                      0
                    )}
                  </td>
                  <td>{order?.type_order || "-"}</td>
                  {isLoggedIn?.role != "owner" && (
                    <td>{order?.type_payment || "-"}</td>
                  )}

                  <td>
                    <select
                      name=""
                      id=""
                      value={order?.status}
                      onChange={(e) => handleChange(e.target.value, order._id)}
                    >
                      <option value="pending">Pending</option>
                      <option value="diterima">Diterima</option>
                      <option value="dikerjakan">Dikerjakan</option>
                      <option value="selesai">Selesai</option>
                    </select>
                  </td>

                  {isLoggedIn?.role == "owner" && (
                    <td>
                      {order.line_items.reduce(
                        (cur, item) => cur + item?.total || 0,
                        0
                      )}
                    </td>
                  )}
                  {/*
                  <td>
                    <button onClick={() => deleteOrder(order._id)}>
                      Hapus
                    </button>
                  </td>
                  */}
                </tr>
              )
            })}
        </tbody>
      </table>
    </Layout>
  )
}

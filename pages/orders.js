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
            {isLoggedIn?.role == "designer" ||
              (isLoggedIn?.role == "admin" && <th>Status</th>)}
            {isLoggedIn?.role == "owner" && <th>Penghasilan</th>}
            <th>Aksi</th>
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
                  {isLoggedIn?.role == "designer" ||
                    (isLoggedIn?.role == "admin" && (
                      <td>
                        <select
                          name=""
                          id=""
                          value={order?.status}
                          onChange={(e) =>
                            handleChange(e.target.value, order._id)
                          }
                        >
                          <option value="diterima">Diterima</option>
                          <option value="dikerjakan">Dikerjakan</option>
                          <option value="selesai">Selesai</option>
                        </select>
                      </td>
                    ))}
                  {isLoggedIn?.role == "owner" && (
                    <td>
                      {order.line_items.reduce(
                        (cur, item) => cur + item?.total || 0,
                        0
                      )}
                    </td>
                  )}
                  <td>
                    <button onClick={() => deleteOrder(order._id)}>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 448 512"
                      >
                        <path d="M135.2 17.7L128 32H32C14.3 32 0 46.3 0 64S14.3 96 32 96H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H320l-7.2-14.3C307.4 6.8 296.3 0 284.2 0H163.8c-12.1 0-23.2 6.8-28.6 17.7zM416 128H32L53.2 467c1.6 25.3 22.6 45 47.9 45H346.9c25.3 0 46.3-19.7 47.9-45L416 128z" />
                      </svg>
                    </button>
                  </td>
                </tr>
              )
            })}
        </tbody>
      </table>
    </Layout>
  )
}

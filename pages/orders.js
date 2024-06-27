import Layout from "@/components/Layout"
import axios from "axios"
import { useEffect, useState } from "react"

export default function OrdersPage() {
  const [orders, setOrders] = useState([])

  const loadOrder = () => {
    axios.get("/api/orders").then((response) => {
      setOrders(response.data)
    })
  }

  useEffect(() => {
    loadOrder()
  }, [])

  const handleChange = (status, orderId) => {
    axios.put("/api/orders", { status, orderId }).then((response) => {
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
            <th>Type Pembayaran</th>
            <th>Status</th>
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
                  <td>{order?.type_payment || "-"}</td>
                  <td>
                    <select
                      name=""
                      id=""
                      value={order?.status}
                      onChange={(e) => handleChange(e.target.value, order._id)}
                    >
                      <option value="diterima">Diterima</option>
                      <option value="dikerjakan">Dikerjakan</option>
                      <option value="selesai">Selesai</option>
                    </select>
                  </td>
                </tr>
              )
            })}
        </tbody>
      </table>
    </Layout>
  )
}

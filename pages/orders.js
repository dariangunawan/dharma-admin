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

  const updateStatus = (value, orderId) => {
    axios.put("/api/orders", { status: value, orderId }).then((response) => {
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
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {orders.length > 0 &&
            orders.map((order) => {
              const status =
                order?.paid == 1
                  ? "Dibayar"
                  : order?.paid == 2
                  ? "Selesai"
                  : "Dibuat"
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
                        {l.price_data?.product_data.name} x{l.quantity}
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
                  <td>
                    <select
                      name="status"
                      value={status}
                      onChange={(event) =>
                        updateStatus(order._id, event.target.value)
                      }
                    >
                      <option value="0">Dibuat</option>
                      <option value="1">Dibayar</option>
                      <option value="2">Selesai</option>
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

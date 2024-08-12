import { mongooseConnect } from "@/lib/mongoose"
import { Order } from "@/models/Order"

export default async function handler(req, res) {
  await mongooseConnect()

  if (req.method === "POST") {
    const { paid, orderId } = req.body
    const order = await Order.findByIdAndUpdate(orderId, {
      paid,
    })
    console.log(order, "order")
    res.json(order)
  }

  if (req.method === "PUT") {
    const { status, status_designer, files, orderId } = req.body
    const order = await Order.findByIdAndUpdate(orderId, {
      files,
      status,
      status_designer,
    })
    res.json(order)
  }

  if (req.method === "GET") {
    res.json(await Order.find().sort({ createdAt: -1 }))
  }

  if (req.method === "DELETE") {
    const { orderId } = req.body
    res.json(await Order.findByIdAndDelete(orderId))
  }
}

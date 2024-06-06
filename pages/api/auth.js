import { mongooseConnect } from "@/lib/mongoose"
import { User } from "@/models/User"

export default async function handle(req, res) {
  await mongooseConnect()

  if (req.method === "POST") {
    const { userId, name, email, phone, password } = req.body
    res.json(
      await User.create({
        userId,
        name,
        email,
        phone,
        password,
      })
    )
  }

  if (req.method === "GET") {
    const userId = req.query.userId
    try {
      const result = await User.findOne({ userId })
      res.json(result)
    } catch (error) {
      res.json({})
    }
  }
}

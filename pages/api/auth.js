import { mongooseConnect } from "@/lib/mongoose"
import { User } from "@/models/User"

async function findOrCreate(query, update) {
  const options = { upsert: true, new: true, setDefaultsOnInsert: true }
  const result = await User.findOneAndUpdate(query, update, options)
  return result
}
export default async function handle(req, res) {
  await mongooseConnect()

  if (req.method === "POST") {
    const { userId, name, email, phone, password } = req.body

    const query = { userId } // Assuming userId is the unique identifier
    const update = { userId, name, email, phone, password }

    try {
      const user = await findOrCreate(query, update)
      res.json(user)
    } catch (error) {
      res.status(500).json({ error: "Error finding or creating user" })
    }
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

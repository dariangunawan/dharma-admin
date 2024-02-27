import { model, models, Schema } from "mongoose"

const UserSchema = new Schema(
  {
    userId: String,
    name: String,
    email: String,
    phone: String,
    password: String,
  },
  {
    timestamps: true,
  }
)

export const User = models?.User || model("User", UserSchema)

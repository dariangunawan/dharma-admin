import { model, models, Schema } from "mongoose"

const OrderSchema = new Schema(
  {
    line_items: Object,
    name: String,
    email: String,
    company: String,
    status: String,
    paid: Number,
  },
  {
    timestamps: true,
  }
)

export const Order = models?.Order || model("Order", OrderSchema)

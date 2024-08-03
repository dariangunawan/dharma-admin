import { model, models, Schema } from "mongoose"

const OrderSchema = new Schema(
  {
    line_items: Object,
    name: String,
    email: String,
    company: String,
    status: String,
    status_designer: String,
    type_order: String,
    type_payment: String,
    paid: Number,
    files: Object,
  },
  {
    timestamps: true,
  }
)

export const Order = models?.Order || model("Order", OrderSchema)

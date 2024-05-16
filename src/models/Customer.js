import mongoose from "mongoose";

const { Schema } = mongoose;

const customerSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      unique: true,
    },
    phone: {
      type: Number,
      length: 10,
    },
    details: {
      type: String,
    },
  },
  { timestamps: true }
);

export default mongoose.models.Customer ||
  mongoose.model("Customer", customerSchema);

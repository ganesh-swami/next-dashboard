import mongoose from "mongoose";

const { Schema } = mongoose;

const customerEntrySchema = new Schema(
  {
    item: {
      type: String,
      required: true,
    },
    totalItem: {
      type: Number,
    },
    rate: {
      type: Number,
    },
    totalAmount: {
      type: Number,
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    customerId: {
      type: Schema.Types.ObjectId,
      ref: "Customer",
      required: true,
    },
    isDeposit: {
      type: Boolean,
      default: false,
    },
    details: {
      type: String,
    },
  },
  { timestamps: true }
);

export default mongoose.models.CustomerEntry ||
  mongoose.model("CustomerEntry", customerEntrySchema);

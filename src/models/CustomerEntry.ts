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
    weight:{
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
      index: true,
    },
    isDeposit: {
      type: Boolean,
      default: false,
    },
    details: {
      type: String,
    },
    isDeleted: {
      type: Boolean,
      default: false,
      index: true,
    },
  },
  { timestamps: true }
);
customerEntrySchema.index({"createdAt": 1});
customerEntrySchema.index({"updatedAt": 1});

export default mongoose.models.CustomerEntry ||
  mongoose.model("CustomerEntry", customerEntrySchema);

const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    orderItems: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        selectedColors: [
          {
            colorName: {
              type: String,
              required: true
            },
            quantity: {
              type: Number,
              required: true
            }
          }
        ],
      },
    ],
    shippingAddress: {
      companyName: { type: String },
      additionalInfo: { type: String },
    },
    shippingMethod: {
      name: {
        type: String,
        enum: ["cod", "bank", "Direct Bank Transfer", "Cash on Delivery"],
        required: true
      },
      cost: {
        type: Number,
        required: true
      },
    },
    totalAmount: {
      type: Number,
      default: 0
      //  required: true
    },
    status: {
      type: String,
      enum: ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"],
      default: "Pending",
    },
    previousStatus: {
      type: String,
      enum: ["", "Pending", "Processing", "Shipped", "Delivered"]
    },
    orderNumber: { type: String, unique: true },
    isDeleted: {
      type: Boolean,
      default: false
    },
    transactionId: { type: String },
  },
  { timestamps: true }
);

OrderSchema.pre("save", async function (next) {
  if (!this.orderNumber) {
    try {
      const lastOrder = await mongoose
        .model("Order")
        .findOne()
        .sort({ createdAt: -1 });
      let newOrderNumber = 1000;
      let prefix = "A";

      if (lastOrder && lastOrder.orderNumber) {
        const match = lastOrder.orderNumber.match(/^([A-Z])(\d+)$/);
        if (match) {
          let lastPrefix = match[1];
          let lastNumber = parseInt(match[2], 10);

          if (!isNaN(lastNumber) && lastNumber >= 1000 && lastNumber < 9999) {
            newOrderNumber = lastNumber + 1;
            prefix = lastPrefix;
          } else if (lastNumber >= 9999) {
            prefix = String.fromCharCode(lastPrefix.charCodeAt(0) + 1);
            newOrderNumber = 1000;
          }
        }
      }
      this.orderNumber = `${prefix}${newOrderNumber}`;
    } catch (error) {
      return next(error);
    }
  }
  next();
});

module.exports = mongoose.model("Order", OrderSchema);

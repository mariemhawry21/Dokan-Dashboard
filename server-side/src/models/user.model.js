
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      // required: [true, "First name is required"],
      trim: true,
    },
    lastName: {
      type: String,
      // required: [true, "Last name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      lowercase: true,
      validate: {
        validator: function (v) {
          return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(v);
        },
        message: (props) => `${props.value} is not a valid email!`, 
      },
    },
    password: {
      type: String,
      required: [true, "Please add a password"],
      minLength: 8,
    },
    mobile: {
      type: String,
      validate: {
        validator: function (v) {
          return /^[0-9]{10,15}$/.test(v);
        },
        message: (props) => `${props.value} is not a valid phone number!`, 
      },
    },
    addresses: [
      {
        province: { id: String, name: String },
        city: { id: String, provinceId: String, name: String },
        street: String,
        postalCode: String,
        isDefault: { type: Boolean, default: false },
        location: {
          type: { type: String, default: "Point" },
          coordinates: { type: [Number], default: [0, 0] },
        },
      },
    ],
    joinDate: { type: Date, default: Date.now },
    birthDate: Date,
    gender: {
      type: String,
      enum: ["male", "female", "other", "prefer-not-to-say"],
      lowercase: true,
    },
    avatar: {
      type: String,
      default:
        "https://upload.wikimedia.org/wikipedia/commons/9/99/Sample_User_Icon.png",
      validate: {
        validator: function (v) {
          return /^(https?:\/\/).+\.(jpg|jpeg|png|gif)$/i.test(v);
        },
        message: (props) => `${props.value} is not a valid image URL!`, 
      },
    },
    role: {
      type: String,
      enum: ["user", "admin", "super_admin"],
      default: "user",
    },
    adminRequest: {
      type: Boolean,
      default: false,
      required: false,
    },
    status: {
      type: String,
      enum: ["pending", "approved", "denied"],
      default: function () {
        return this.role === "user" ? "approved" : "pending";
      },
    },
    tags: {
      type: [String],
      enum: [
        "premium",
        "frequent",
        "new",
        "vip",
        "loyal",
        "wholesale",
        "business",
      ],
      default: [],
    },
    segments: [
      {
        name: String,
        assignedAt: { type: Date, default: Date.now },
        assignedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        expiresAt: Date,
      },
    ],
    customerTier: {
      type: String,
      enum: ["basic", "silver", "gold", "platinum"],
      default: "basic",
    },
    state: {
      type: String,
      enum: ["active", "blocked"],
      default: "active",
    },
    ordersCount: { type: Number, default: 0 },
    totalSpent: { type: Number, default: 0 },
    lastOrderDate: Date,
    lastSiteVisit: Date,
    averageOrderValue: { type: Number, default: 0 },
    isBlocked: { type: Boolean, default: false },
    isHotUser: { type: Boolean, default: false },
    isSubscribedToNewsletter: { type: Boolean, default: false },
    communicationPreferences: {
      email: { type: Boolean, default: true },
      sms: { type: Boolean, default: false },
      whatsapp: { type: Boolean, default: false },
      pushNotifications: { type: Boolean, default: true },
    },
    verification: {
      emailVerified: { type: Boolean, default: false },
      phoneVerified: { type: Boolean, default: false },
      identityVerified: { type: Boolean, default: false },
      verifiedAt: Date,
    },
    activityLog: [
      {
        activityType: {
          type: String,
          enum: [
            "login",
            "purchase",
            "contact",
            "review",
            "complaint",
            "refund",
          ],
          required: true,
        },
        description: String,
        referenceId: mongoose.Schema.Types.ObjectId,
        createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        ipAddress: String,
        deviceInfo: String,
        date: { type: Date, default: Date.now },
      },
    ],
    creditLimit: { type: Number, default: 0 },
    currentCredit: { type: Number, default: 0 },
    specialCases: [
      {
        caseType: { type: String, required: true },
        description: String,
        severity: {
          type: String,
          enum: ["low", "medium", "high"],
          default: "medium",
        },
        addedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        addedAt: { type: Date, default: Date.now },
        resolvedAt: Date,
        isActive: { type: Boolean, default: true },
        isDeleted: { type: Boolean, default: false },
      },
    ],
    tierLock: {
      type: Boolean,
      default: false, // Flag to lock the tier update
    },
    deletedAt: Date,
    deletedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    isActive: { type: Boolean, default: true },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtuals
userSchema.virtual("fullName").get(function () {
  return `${this.firstName} ${this.lastName}`; 
});

userSchema.virtual("age").get(function () {
  if (!this.birthDate) return null;
  const today = new Date();
  const birthDate = new Date(this.birthDate);
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
});

userSchema.pre("save", function (next) {
  // Skip automatic tier update if tierLock is true
  if (this.tierLock) return next();

  // Existing tier calculation logic
  if (this.isModified("ordersCount") || this.isModified("totalSpent")) {
    const newTags = [];

    if (this.ordersCount >= 20) newTags.push("premium", "loyal");
    else if (this.ordersCount >= 10) newTags.push("premium");
    else if (this.ordersCount >= 5) newTags.push("frequent");

    if (this.totalSpent >= 1000) newTags.push("vip");
    if (this.ordersCount === 0) newTags.push("new");

    this.tags = [
      ...new Set(
        [
          ...this.tags.filter(
            (t) =>
              !["premium", "frequent", "new", "vip", "loyal"].includes(t)
          ),
          ...newTags,
        ]
      ),
    ];

    if (this.totalSpent >= 5000) this.customerTier = "platinum";
    else if (this.totalSpent >= 2000) this.customerTier = "gold";
    else if (this.totalSpent >= 500) this.customerTier = "silver";
    else this.customerTier = "basic";
  }

  next();
});

module.exports = mongoose.model("User", userSchema);

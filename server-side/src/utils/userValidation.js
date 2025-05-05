const Ajv = require("ajv");
// const { type } = require("server/reply");
const ajv = new Ajv();

// User schema validation using Ajv library
const userSchema = {
  type: "object",
  properties: {
    username: { type: "string", pattern: "^[a-zA-Z ]*$", minLength: 3 },
    email: {
      type: "string",
      pattern: "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,}$",
    },
    googleId: { type: "string" },
    password: { type: "string", minLength: 8 },
    phone: {
      type: "string",
      pattern: "^\\+?([0-9]{1,4})?\\d{7,15}$",
    },
    role: {
      type: "string",
      enum: ["ADMIN", "USER", "SUPER_ADMIN"],
      default: "USER",
    },
    status:{
      type:"string",
      enum:["pending","approval","denied"], default: "pending"
    },
    agree: { type: "boolean" },
    thumbnail: { type: "string" },
  },
  required: ["username", "email","password"],
  additionalProperties: false,
};
module.exports = ajv.compile(userSchema);

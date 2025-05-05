const express = require("express");
const app = express();
const path = require('path');
app.use('/images', express.static(path.join(__dirname, 'public/images')));
const cors = require('cors');
require('dotenv').config();
const passport = require('passport');
require("dotenv").config();
const cloudinary = require("./src/config/cloudinary.config");

// Scripts to run
require("./src/middlewares/passport.middleware");
require("./src/services/orderStatus.service");


/* * * * Utils * * * * */
const httpStatusText = require("./src/utils/httpStatusText");
/* * * * End Utils * * * * */

const PORT = process.env.PORT || 5000;
app.use(passport.initialize());

/* * * * DB * * * * */
const connectDB = require("./src/config/db");
/* * * * End Db * * * * */
// const seedData = require("./seed");

/* * * * Router imports * * * * */
const registerationRouter = require("./src/routes/registration.routes");
const userRouter = require("./src/routes/user.routes");
const categoreRouter = require("./src/routes/category.routes");
const productRouter = require("./src/routes/product.routes");
const postRouter = require("./src/routes/post.routes");
const checkoutRouter = require("./src/routes/checkout.routes");
const cartRouter = require("./src/routes/cart.routes");
const galleryRouter = require("./src/routes/gallery.routes");
const contactRouter = require("./src/routes/contact.routes");
const orderRouter = require("./src/routes/order.routes");
const paymentRouter = require("./src/routes/payment.routes");
const settingsRouter = require("./src/routes/settings.routes");
const statsRouter = require("./src/routes/stats.routes");
/* * * * End Router imports * * * * */

// Connect to MongoDB
connectDB();

// Middlewares
app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.json("You need furniture? Here’s Furniro!");
});

/* * * Routes * * * */
app.use('/auth', registerationRouter);
app.use('/api/users', userRouter);
app.use('/categories', categoreRouter);
app.use('/products', productRouter);
app.use('/posts', postRouter);
app.use('/checkout', checkoutRouter);
app.use('/cart', cartRouter);
app.use('/api', galleryRouter);
app.use('/contact', contactRouter);
app.use('/orders', orderRouter);
app.use('/payments', paymentRouter);
app.use("/api/settings", settingsRouter);
app.use('/api/currencies', require('./src/routes/currencies'));


/* * * Global MiddleWare * * * */
app.all("*", (req, res, next) => {
  return res.status(404).json({
    status: httpStatusText.ERROR,
    message: "this resource is not available",
  });
});

// Global error handlers
app.use((error, req, res, next) => {
  return res.status(error.statusCode || 500).json({
    status: error.statusText || httpStatusText.ERROR,
    error: error.message,
    code: error.statusCode || 500,
    data: null,
  });
});

app.listen(PORT, () =>
  console.log(`I am running on: http://localhost:${PORT}`)
);

module.exports = app;

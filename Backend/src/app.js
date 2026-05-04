
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import authRoutes from './routes/auth.routes.js';
import productRoutes from './routes/product.routes.js';
import cartRoutes from './routes/cart.routes.js';
import orderRoutes from './routes/order.routes.js';
import paymentRoutes from './routes/payment.routes.js';
import vendorRoutes from './routes/vendor.routes.js';
import adminRoutes from './routes/admin.routes.js';
import addressRoutes from './routes/address.routes.js';
import reviewRoutes from "./routes/review.routes.js";
import supportRoutes from "./routes/support.routes.js";
import payoutRoutes from "./routes/payout.routes.js";

const ipv6 = process.env.IPV6;


const app = express();

// 🔥 FIXED CORS CONFIG
// app.use(cors({
//   origin: "http://localhost:3000", // frontend URL
//   credentials: true,               // VERY IMPORTANT
// }));

// ✅ ALLOW BOTH IPv4 AND IPv6 LOCALHOST
app.use(cors({
  origin: [
    "http://localhost:3000",
    `http://[${ipv6}]:3000`
  ],
  credentials: true
}));

// Middleware
app.use(express.json());
app.use(cookieParser());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/vendor', vendorRoutes);
app.use('/api/admin', adminRoutes);
app.use("/api/address", addressRoutes);
app.use("/api/reviews", reviewRoutes);

app.use("/api/support", supportRoutes);

app.use("/api/payout", payoutRoutes);

app.get("/", (req, res) => {
  res.send("Server is running 🚀");
});

export default app;
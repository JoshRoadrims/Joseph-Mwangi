import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import cookieParser from "cookie-parser"

import connectDB  from './configs/db.js'
import authRoutes from "./routes/auth.routes.js"
import dashboardRoutes from "./routes/dashboard.routes.js"
import orderRoutes from "./routes/order.routes.js"
import returnRoutes from "./routes/return.routes.js"
import billingroutes from "./routes/billing.routes.js"
import settingRoutes from "./routes/setting.routes.js"
import generelRoutes from "./routes/generel.routes.js"

//CONFIGURATIONS
dotenv.config();
const app = express();
const PORT = process.env.PORT || 9000;

// MongoDB connection
connectDB()

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors({credentials: true}));


// Routes
app.use("/api/auth", authRoutes)
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/orders', orderRoutes);
app.use("/api/returns", returnRoutes)
app.use("/api/billings", billingroutes)
app.use("/api/settings", settingRoutes)
app.use("/api/general", generelRoutes) 


app.listen(PORT, () => console.log(`Roadrims backend server running on port: ${PORT}`))


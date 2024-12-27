import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'
import dotenv from 'dotenv'

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

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/orders', orderRoutes);
app.use("/api/returns", returnRoutes)
app.use("/api/billings", billingroutes)
app.use("/api/settings", settingRoutes)
app.use("/api/general", generelRoutes) 

// MongoDB connection
mongoose.connect(process.env.MONGODB_URL).then(() => {
    app.listen(PORT, () => console.log(`Roadrims backend server running on port: ${PORT}`))
}).catch((error) => console.log(`${error} did not connect`))

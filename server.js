
import bodyParser from "body-parser";
import cors from "cors";
import express from "express";
import router from './Routes/AuthRouters.js';
import productRouter from "./Routes/ProductRouters.js";
import dotenv from 'dotenv';
import adminRouter from "./Routes/AdminRoutes.js";
import supplierRouter from "./Routes/SupplierRoutes.js";
import customerRouter from "./Routes/CustomerRoute.js";
import salesRouter from "./Routes/SalesRoute.js";
import purchaseRouter from "./Routes/PurchaseRoute.js";
import publicRouter from "./Routes/PublicRoutes.js";
dotenv.config();

const app = express();
app.use(bodyParser.json());
app.use(cors())

const PORT = process.env.PORT || 8080;


app.use('/auth', router),
app.use('/admin', adminRouter),
app.use('/product', productRouter)
app.use('/supplier', supplierRouter)
app.use('/customer', customerRouter)
app.use('/sales', salesRouter)
app.use('/purchase', purchaseRouter)
app.use('/public', publicRouter)
app.use(express.static('upload_data'));

app.get('/helth-check', (req, res) =>{res.send("Helth check done")})
app.get('/', (req, res) =>{res.send("Hello Surya")})

app.listen(PORT, () =>{
    console.log("Server is runing is port", PORT)
})
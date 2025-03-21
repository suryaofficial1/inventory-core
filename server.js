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
import productionRouter from "./Routes/ProductionRoute.js";
import materialsRouter from "./Routes/MaterialsRoute.js";
import reportRouter from "./Routes/ReportRoutes.js";
import path from 'path';
import fs from 'fs';

dotenv.config();

const mime = {
    html: 'text/html',
    txt: 'text/plain',
    css: 'text/css',
    gif: 'image/gif',
    jpg: 'image/jpeg',
    png: 'image/png',
    svg: 'image/svg+xml',
    js: 'application/javascript'
};

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
app.use('/production', productionRouter)
app.use('/material', materialsRouter)
app.use('/report', reportRouter)
app.use(express.static('upload_data'));


const __dirname = path.resolve();
const dir = path.join(__dirname, 'app');
console.log("dir", dir)
app.use(express.static(dir));
app.get('*', function (req, res) {

    let filePath = path.join(__dirname, 'app', req.url, 'index.html');
    if (!fs.existsSync(filePath)) {
        filePath = path.join(__dirname, 'app', 'index.html');
    }
    res.sendFile(filePath);
})

app.get('/helth-check', (req, res) => { res.send("Helth check done") })
//app.get('/', (req, res) =>{res.send("Hello Surya")})

app.listen(PORT, () => {
    console.log("Server is runing is port", PORT)
})
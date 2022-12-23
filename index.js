import express, { response } from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import authRoute from "./routes/auth.js";
import usersRoute from "./routes/users.js";
import shopsRoute from "./routes/shops.js";
import productsRoute from "./routes/products.js";
import checkoutRoute from "./routes/checkout.js";
import reviewRoute from "./routes/reviews.js";
import auctionRoute from "./routes/auction.js";
import checkoutAuctionRoute from "./routes/checkoutAuction.js";
import cookieParser from "cookie-parser";
import paypalRoute from "./routes/paypals.js";
import categoryRoute from "./routes/categories.js";
import shippingCostRoute from "./routes/shippingCost.js";
import bodyParser from "body-parser";
import { urlencoded, json } from "express";
// import mongoosePatchUpdate from "mongoose-patch-update";
import cors from "cors";

const app = express();
dotenv.config();

app.use(function (req, res, next) {
    // Website you wish to allow to connect
    res.setHeader(
        "Access-Control-Allow-Origin",
        "https://fourtl-web-e-commerce.onrender.com"
    );

    // Request methods you wish to allow
    res.setHeader(
        "Access-Control-Allow-Methods",
        "GET, POST, OPTIONS, PUT, PATCH, DELETE"
    );

    // Request headers you wish to allow
    res.setHeader(
        "Access-Control-Allow-Headers",
        "X-Requested-With,content-type"
    );

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader("Access-Control-Allow-Credentials", true);

    // Pass to next layer of middleware
    next();
});

const connect = async () => {
    try {
        // node > 17 => 127.0.0.1 else localhost
        await mongoose.connect(
            "mongodb+srv://4TL:ghw3h8HJiUwBEioK@cluster0.vijfszk.mongodb.net/test"
        ); //process.env.MONGO //mongodb://localhost:27017/web-ec
        console.log("Connected to mongoDB.");
    } catch (error) {
        throw error;
    }
};

mongoose.connection.on("disconnected", () => {
    console.log("mongoDB disconnected!");
});

mongoose.connection.on("connected", () => {
    console.log("mongoDB connected!");
});
//mongoose.plugin(mongoosePatchUpdate);

// middlewares
app.use(bodyParser.json({ limit: "50000mb" }));
app.use(bodyParser.urlencoded({ limit: "50000mb", extended: true }));
app.use(
    express.urlencoded({
        extended: true,
    })
);
app.use(cors({ credentials: true, origin: true }));
//app.use(bodyParser.urlencoded({ limit: '10mb', extended: false }))

app.options(
    "*",
    cors({
        credentials: true,
        origin: true,
    })
);
app.use(cookieParser());
app.use(express.json());
//app.get("/", test)
// app.get("/backend/cookie", (req, res, next) => { const rs = res.cookie("an", "611").send("SET COOKIE"); console.log(rs) })
app.use("/auth", authRoute);
app.use("/users", usersRoute);
app.use("/shops", shopsRoute);
app.use("/products", productsRoute);
app.use("/checkouts", checkoutRoute);
app.use("/reviews", reviewRoute);
app.use("/paypal", paypalRoute);
app.use("/categories", categoryRoute);
app.use("/shippingCost", shippingCostRoute);
app.use("/auction", auctionRoute);
app.use("/checkoutAuction", checkoutAuctionRoute);

app.use((err, req, res, next) => {
    const errorStatus = err.status || 500;
    const errorMessage = err.message || "Something went wrong!";

    return res.status(500).json({
        success: false,
        status: errorStatus,
        message: errorMessage,
        stack: err.stack,
    });
});

app.listen(8800, () => {
    connect();
    console.log("Connected to backend");
});

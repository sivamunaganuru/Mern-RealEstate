import Express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import authRoute from "./routes/auth.route.js";
import cookieParser from "cookie-parser";
import listingRoute from "./routes/listing.route.js";
import path from "path";

const __dirname = path.resolve();


dotenv.config();
mongoose.connect(process.env.MONGO, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log("MongoDB connected");
}).catch((err) => {
    console.log(err);
});

mongoose.connection.on("error", (err) => {
    console.log(err);
});

mongoose.connection.on("disconnected", () => {
    console.log("MongoDB disconnected");
});


const port = 3000;

const app = new Express();
app.use(Express.json());
app.use(Express.urlencoded({ extended: true }));
app.use(cookieParser());

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
}); 


app.use("/", authRoute);
app.use("/listing", listingRoute);

app.use(Express.static(path.join(__dirname, '/Realestate/dist');
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '/Realestate/dist/index.html'));
});

app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    return res.status(statusCode).json({
        success: false,
        statusCode,
        message
    });
});

const express = require("express");
const PORT = 3000;
const app = express();

const {authRouter} = require("./routes/auth") 
const adminRouter = require("./routes/admin"); 
const productRouter = require("./routes/product"); 
const userRouter = require("./routes/user"); 



const {connectMongoDb} = require("./connection")

const DB= "mongodb+srv://abhimanyubablet:Abhi%40123@cluster0.rlrkm.mongodb.net/amazon-clonedb"
// connections
connectMongoDb(DB).then(() => console.log("Mongodb connected"))

// middlewares
app.use(express.json());

// routes
app.use("/api",authRouter)
app.use("/api",adminRouter)
app.use("/api",productRouter)
app.use("/api",userRouter)


app.listen(PORT, () => {
    console.log(`connected at port ${PORT}`);
});
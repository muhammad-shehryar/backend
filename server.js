const express =require("express")
const authRoute = require("./routes/authRoute")
const postRoute = require("./routes/postRoute")

const connectDB = require("./config/db")

const app = express()
const PORT = process.env.PORT || 5000;
const cors = require("cors")

app.use(cors())
app.use(express.json())
app.use("/api/route",authRoute)
app.use("/api/route/",postRoute)

connectDB()

app.get("/",(req,res)=>{
    res.send("blog api is running")
})

app.listen(PORT,()=>{
    console.log(`server started at PORT ${PORT}`)
})
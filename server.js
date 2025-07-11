const mongoose = require("mongoose");
const next = require("next");
const dotenv = require("dotenv");
dotenv.config();
// dotenv.config({path:"./config.env"});

const dev = process.env.NODE_ENV != "production";
const nextServer = next({dev});
const handle = nextServer.getRequestHandler();


const app = require("./app");//This imports your Express server logic (like routes, middleware) from app.js.

const DB = process.env.NEXT_PUBLIC_DATABASE.replace(
     "<PASSWORD>",
     process.env.NEXT_PUBLIC_DATABASE_PASSWORD
);

mongoose.connect(DB).then(()=>console.log("DB connection successful"))
.catch((err)=>console.log("connections",err));


const port = process.env.PORT || 3000

nextServer.prepare().then(()=>{
// Mount your API routes first
//   app.use('/api/v1/user', require('./Api/Routers/userRouter'));

     app.get("*",(req,res)=>{
          return handle(req,res);
     });
     app.listen(port,()=>{
          console.log(`App running on ${port}...`)
     })
});



//import package
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
//import from file
const authRouter = require('./routes/auth');
const adminRouter = require('./routes/admin');
const productRouter = require('./routes/product');
const userRouter = require('./routes/user');


//INIT
const PORT = 3000 || process.env.PORT;
const app = express();
app.use(cors());
app.use(express.json());

//middleware
app.use(express.json());
app.use(authRouter);
app.use(adminRouter);
app.use(productRouter);
app.use(userRouter);

mongoose.connect("mongodb+srv://alialialihabibhabib:YvBqVODk1b2HyMDM@cluster0.3fwfb.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0").then(()=>{
          console.log('connect success');
}).catch((e)=>{
          console.log(e);
})
//eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2ZDJiZWMwZTIzZTk5ZWQxNmY5N2MzNyIsImlhdCI6MTcyNTE3MzI2OX0.Bm66q_uE4_xdinn3JGpnJsYBNBYwXDO8c-dxJq2PaSo
app.listen(PORT, ()=>{
          console.log(`listening on port: ${PORT}`)
});


const express = require('express');
const mongoose = require('mongoose');
const authRouter  = require('./routes/authRoutes')
const PORT =  process.env.PORT || 9000
const app = express()
const cors = express('cors')

app.use(express.json())
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
        "Access-Control-Allow-Headers",
        "Origin,X-Requested-With,Content-Type,Accept"
    );
    res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE");
    next();
});
app.use('/auth',authRouter)
async function start(){
    try{
        await mongoose.connect('mongodb+srv://AntonQQQ:1q2w3e4r@cluster0.tfr1u.mongodb.net/users', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        })

        app.listen(PORT, () => {
            console.log('Server has been started')
        })
    }catch (e) {
        console.log(e)
    }
}

start()
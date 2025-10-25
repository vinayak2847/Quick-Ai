import express from 'express';
import 'dotenv/config';
import cors from 'cors';


const PORT=process.env.PORT || 3000;
const app=express()


app.use(cors())
app.use(express.json())


app.get('/',(req,res)=> res.send("Server is Live"));

app.listen(PORT,()=>{
    console.log("Server running on port "+PORT);
})
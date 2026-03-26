import express from "express";
import cors from "cors";
import fetch from "node-fetch";

const app = express();
app.use(cors());
app.use(express.json());

const API_KEY = "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";

app.post("/chat", async (req,res)=>{
const r = await fetch("https://api.openai.com/v1/chat/completions",{
method:"POST",
headers:{
"Content-Type":"application/json",
Authorization:`Bearer ${API_KEY}`
},
body:JSON.stringify({
model:"gpt-4o-mini",
messages:[{role:"user",content:req.body.message}]
})
});

const d = await r.json();
res.json({reply:d.choices[0].message.content});
});

app.listen(3000);
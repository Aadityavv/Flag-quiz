import express from "express";
import bodyParser from "body-parser";
import pg from "pg";

const app = express();
const port = 3000;
const db = new pg.Client({
    user:"postgres",
    password:"Aaditya",
    host:"localhost",
    port:"5434",
    database: "world"
})

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));

let quiz = {};
let totalCorrect = 0;
let currentQuestion = {};

db.connect(err=>{
    if (err) {
        console.log(`Unable to fetch ${err.stack}`);
    }
    else{
        console.log(`Database connected successfully`);
    }
})

db.query(`SELECT * FROM flags`,(err,res)=>{
    if (err) {
        console.error(`Error Fetching data ${err.stack}`);
    }
    else{
        quiz = res.rows;
        console.log(`Data fetched successfully.`)
    }
})

app.get("/",async(req,res)=>{
    totalCorrect = 0;
    await nextQuestion();
    res.render("index.ejs",{
        question : currentQuestion
    })
    console.log(currentQuestion);
});

app.post("/submit",async(req,res)=>{
    const answer = req.body.answer.trim();
    let isCorrect = false;
    if(currentQuestion.name.toLowerCase() === answer.toLowerCase()){
        isCorrect = true;
        totalCorrect++;
        console.log(totalCorrect);
    }
    await nextQuestion();
    res.render("index.ejs",{
        totalScore : totalCorrect,
        wasCorrect : isCorrect,
        question : currentQuestion
    })
    console.log(currentQuestion);
    });

    async function nextQuestion(){
        const randomCountry = quiz[Math.floor(Math.random() * quiz.length)];
        currentQuestion = randomCountry;
        
    }


app.listen(port,()=>{
    console.log(`Database connected successfully`);
});
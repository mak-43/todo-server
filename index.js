const express = require('express');
const cors = require('cors');
const { MongoClient,ServerApiVersion, ObjectId } = require('mongodb');
const jwt = require('jsonwebtoken');
const { query } = require('express');
require('dotenv').config()
const app=express()
const port=process.env.PORT ||5000

app.use(cors())
app.use(express.json())

function verifyJWT(req,res,next){
    const authHeader=req.headers.authorization
    if(!authHeader){
        return res.status(401).send({message:'unauthorized access'})
    }
    const token=authHeader.split(' ')[1]
    jwt.verify(token,process.env.ACCESS_TOKEN_SECRET,(err,decoded)=>{
        if(err){
            return res.status(403).send({message:'Forbidden  access'})
        }        
        req.decoded=decoded
        next() 
    })
}
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.o9fi3.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        await client.connect()
        const taskCollection = client.db('ToDoList').collection('TaskList')
       // const itemCollection=client.db("Assignment-11").collection('myitem')

        app.post('/addtask',async(req,res)=>{
            const task=req.body 
            const name=req.body.name
            const result=await taskCollection.insertOne(task) 
            res.send({result:result,name:name})
        })

        app.get('/alltask',async(req,res)=>{
            const query={}
            const cursor=taskCollection.find(query)
            const alltasks=await cursor.toArray()
            res.send(alltasks)
        })
        app.delete('/delete/:id',async(req,res)=>{
            const id=req.params.id 
            const query={_id:ObjectId(id)} 
            console.log(query)
            const result= await taskCollection.deleteOne(query) 
            res.send(result)
        })
      
      
    }
    finally {

    }
}


run().catch(console.dir)
app.get('/',(req,res)=>{
    res.send('Running server')
})
app.listen(port,()=>{
    console.log('Listening to port ',port)
})
const express = require("express");
const { MongoClient } = require("mongodb");
const ObjectId = require('mongodb').ObjectId
const cors = require('cors')

const app = express();
const port = 5000;

app.use(cors())
app.use(express.json())

//user name: mydbuser1
//password : SRxNg78YsHc095Ai
const uri =
  "mongodb+srv://mydbuser1:SRxNg78YsHc095Ai@cluster0.9wbut.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
async function run() {
  try {
    await client.connect();
    const database = client.db("foodmaster");
    const usersCollection = database.collection("users");
    
    // get api 
    app.get('/users', async(req, res)=>{
      const cursor = usersCollection.find({})
      const users = await cursor.toArray()
      res.send(users)
    })

    // POST api
    app.post("/users", async (req, res) => {
      console.log("hitting the post",req.body);
      const newUser = req.body;
      const result = await usersCollection.insertOne(newUser)
      console.log('added new user ', result)
      res.json(result);
    });

    //delate api

    app.delete('/users/:id', async(req, res)=>{
      const id = req.params.id;

      // query 
      const query = {_id: ObjectId(id)}
      const result = await usersCollection.deleteOne(query)
      console.log('delete id with ', result);
      res.json(result)
    })

    //single user loading API

    app.get('/users/:id', async(req, res)=>{
      const id = req.params.id;
      const query = {_id : ObjectId(id)};
      const user = await usersCollection.findOne(query)
      console.log('load user with ', id)
      res.send(user)
    })

    //update api 
    app.put('/users/:id', async(req, res) =>{
      const id = req.params.id;
      const updateUser = req.body;
      const filter = {_id: ObjectId(id)}
      const options = {upsert : true}
      const updateDoc = {
        $set: {
          name : updateUser.name,
          email: updateUser.email
        }
      }
      const result = await usersCollection.updateOne(filter, updateDoc, options)
      console.log('updating user', req)
      res.json(result)
    })

  } finally {
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("hello vai i am running");
});

app.listen(port, () => {
  console.log("runningPort");
});

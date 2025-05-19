const express = require('express')
const cors = require('cors')
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express()
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.vdaznfz.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;


const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    await client.connect();

    const coffeesCollection = client.db('coffeeDB').collection('coffees');
    const usersCollection = client.db('coffeeDB').collection('users');


    app.get('/coffees', async(req, res)=> {
        // const cursor = coffeesCollection.find();
        // const result = await cursor.toArray();
        const result = await coffeesCollection.find().toArray();
        res.send(result);
    })

    app.get('/coffees/:id', async(req, res) => {
        const id = req.params.id;
        const query = {_id: new ObjectId(id)}
        const result = await coffeesCollection.findOne(query)
        res.send(result)
    })


    app.post('/coffees', async(req, res) => {
        const newCoffee = req.body;
        console.log(newCoffee);
        const result = await coffeesCollection.insertOne(newCoffee);
        res.send(result);
    })

    app.put('/coffees/:id', async(req, res) => {
      const id = req. params.id;
      const filter = {_id: new ObjectId(id)};
      const options = {upsert: true};
      const updatedCoffee = req.body;
      const updatedDoc = {
        $set : updatedCoffee
      }
      const result = await coffeesCollection.updateOne(filter,updatedDoc, options);
      res.send(result);
    })


    app.delete('/coffees/:id', async(req, res) => {
        const id = req.params.id;
        const query = {_id: new ObjectId(id)}
        const result = await coffeesCollection.deleteOne(query)
        res.send(result)
    })

    // User related APIs

    app.get('/users', async(req, res) => {
      const result = await usersCollection.find().toArray();
      res.send(result)
    })


    app.post('/users', async(req, res) => {
      const userProfile = req.body;
      console.log(userProfile);
      const result = await usersCollection.insertOne(userProfile);
      res.send(result);
    })


   
app.patch('/users', async(req, res) => {
  const { email, lastSignInTime } = req.body;
  
  if (!email) {
    return res.status(400).send({ error: 'Email is required for update.' });
  }

  const filter = { email }; 
  const updateDoc = {
    $set: { lastSignInTime }
  };

  const result = await usersCollection.updateOne(filter, updateDoc);

  res.send(result);
});


    app.delete('/users/:id', async(req, res) => {
      const id = req.params.id;
      const query = {_id: new ObjectId(id)}
      const result = await usersCollection.deleteOne(query);
      res.send(result);
    })



    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);




app.get('/', (req, res) => {
  res.send('Coffee Server is getting hotter.')
})

app.listen(port, () => {
  console.log(`Coffee server is running on port ${port}`)
}) 
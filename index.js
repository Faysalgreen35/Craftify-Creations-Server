const express = require('express');
const cors = require('cors'); 
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

require('dotenv').config()
const app = express();
const port = process.env.PORT || 5000;

// miidleware  written here
app.use(cors());
app.use(express.json());
  
 

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.5ynzghe.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    const craftifyCollection = client.db('craftifycreationsDB').collection('craftify');

    app.get('/craftify', async (req, res) => {
      const cursor = craftifyCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    })
    app.post('/craftify', async (req, res) => {
        const newcraftify = req.body;
        console.log(newcraftify);
        const result = await craftifyCollection.insertOne(newcraftify);
        res.send(result);
  
      })

    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/', (req, res) => {
  res.send('craftify-creations-server server is running ')
})

app.listen(port, () => {
  console.log(`craftify=creations-server is running on port: ${port}`)
})
const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

require('dotenv').config()
const app = express();
const port = process.env.PORT || 5000;

// miidleware  written here
const corsConfig = {
  origin: '*',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE']
  }
  app.use(cors(corsConfig))
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
    const categoryCollection = client.db('craftifycreationsDB').collection('category');


    app.get('/craftify', async (req, res) => {
      const cursor = craftifyCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    })
//my email to search 
    app.get('/craftify/:email', async (req, res) => {
      console.log(req.params.email);
      const result = await craftifyCollection.find({ email: req.params.email }).toArray();
      res.send(result);
    })


//update
    app.get('/singleCard/:id', async (req, res) => {
       
      console.log(req.params.id);

      const result = await craftifyCollection.findOne({_id: new ObjectId(req.params.id)});
      res.send(result);

    })

    //update
    app.put('/updateCard/:id', async (req, res) => {

      console.log(req.params.id)
      const query= {_id : new ObjectId( req.params.id)};

      const id = req.params.id;
      // const filter = { _id: new ObjectId(id) }
      const options = { upsert: true };
      const updatedCraftify = req.body;
      const craftify = {
        $set: {
          item_name: updatedCraftify.item_name,
          subcategory_Name: updatedCraftify.subcategory_Name,
          description: updatedCraftify.description,
          price: updatedCraftify.price,
          rating: updatedCraftify.rating,
          customization: updatedCraftify.customization,
          photo: updatedCraftify.photo,
          processing_time: updatedCraftify.processing_time,
          stockStatus: updatedCraftify.stockStatus
         
        }
      }
      const result = await craftifyCollection.updateOne(query, craftify, options);
      res.send(result);
    })

    // delete
    app.delete('/updateCard/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await craftifyCollection.deleteOne(query);
      res.send(result);
    })

    //first post here
   

    app.post('/craftify', async (req, res) => {
      const newcraftify = req.body;
      console.log(newcraftify);
      const result = await craftifyCollection.insertOne(newcraftify);
      res.send(result);

    })

    //second  api for category
    
    app.get('/category', async (req, res) => {
      const cursor = categoryCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    })
    
    app.post('/category', async (req, res) => {
      const newcraftify = req.body;
      console.log(newcraftify);
      const result = await categoryCollection.insertOne(newcraftify);
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
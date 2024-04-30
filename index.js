const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;


app.use(cors());
app.use(express.json());





const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.bfaqolh.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const spotsCollection = client.db('spotdb').collection('spot');
    const countryCollection = client.db('spotdb').collection('countryCollection');
    const userCollection = client.db('spootdb').collection('user');



    app.get('/spot', async (req, res) => {
      const cursor = spotsCollection.find();
      const result = await cursor.toArray();
      res.send(result)
    })

    app.get('/spot/:email', async (req, res) => {
      console.log(req.params.email);
      const result = await spotsCollection.find({ email: req.params.email }).toArray();
      res.send(result)
    })


    app.get('/spots/:id', async (req, res) => {
      console.log(req.params.id)
      const result = await spotsCollection.findOne({ _id: new ObjectId(req.params.id) })
      console.log(result)
      res.send(result)
    })

    app.post('/spot', async (req, res) => {
      const touristSpots = req.body;
      console.log(touristSpots)
      const result = await spotsCollection.insertOne(touristSpots);
      res.send(result)
    })

    app.put('/spots/:id', async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const updateSpot = req.body;
      const updateOperation = {
        $set: {
          spotName: updateSpot.spotName,
          countryName: updateSpot.countryName,
          location: updateSpot.location,
          description: updateSpot.description,
          average: updateSpot.average,
          seasonality: updateSpot.seasonality,
          travel: updateSpot.travel,
          totalVisitors: updateSpot.totalVisitors,
          photoURL: updateSpot.photoURL
        }
      };
      try {
        const result = await spotsCollection.updateOne(filter, updateOperation);
        res.send(result);
      } catch (error) {
        console.error('Error updating tourist spot:', error);
        res.status(500).send('Internal Server Error');
      }
    });

    app.delete('/spots/:id', async(req, res) => {
     const id = req.params.id;
     console.log('please delete from database', id);
     const query = {_id: new ObjectId(id)};
     const result = await spotsCollection.deleteOne(query);
     res.send(result);
    })

  // Country Collection

  app.post('/country', async (req, res) => {
    const country = req.body;
    console.log(user);
    const result = await countryCollection.insertOne(country);
    res.send(result);
  })


  app.get('/country', async (req, res) => {
    const cursor = countryCollection.find();
    const result = await cursor.toArray();
    res.send(result)
  })

  app.get('/country/:country_Name', async (req, res) => {
    console.log(req.params.country_Name);
    const result = await countryCollection.find({ country_Name: req.params.country_Name }).toArray();
    res.send(result)
  })


    // Client site of user

    app.get('/user', async (req, res) => {
      const cursor = userCollection.find();
      const result = await cursor.toArray();
      res.send(result)
    })

    app.post('/user', async (req, res) => {
      const user = req.body;
      console.log(user);
      const result = await userCollection.insertOne(user);
      res.send(result);
    })


    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/', (req, res) => {
  res.send('Goromer adventure is runnig')
})

app.listen(port, () => {
  console.log(`Goromer adventure in runnig on ${port}`)
})
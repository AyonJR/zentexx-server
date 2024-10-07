const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { MongoClient, ServerApiVersion } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;

// middlewares
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.4dm99p5.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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
    // Connect to the MongoDB client
    await client.connect();

    const standardFundingCollection = client.db("zentexx").collection("standardFunding");
    const instantFundingCollection = client.db("zentexx").collection("instantFunding");
    const p10Collection = client.db("zentexx").collection("p10");


   
    // price getting

    app.get('/p10', async(req,res)=> {
      const result = await p10Collection.find().toArray()
      res.send(result)
    })

    app.get('/p20', async(req,res)=> {
      const result = await p20Collection.find().toArray()
      res.send(result)
    })

    app.get('/p30', async(req,res)=> {
      const result = await p30Collection.find().toArray()
      res.send(result)
    })

    app.get('/p40', async(req,res)=> {
      const result = await p40Collection.find().toArray()
      res.send(result)
    })

    app.get('/p50', async(req,res)=> {
      const result = await p50Collection.find().toArray()
      res.send(result)
    })




    // Standard Funding
    app.get('/standardFunding', async (req, res) => {
      try {
        const result = await standardFundingCollection.find().toArray();
        res.send(result);
      } catch (error) {
        res.status(500).send({ message: "Failed to fetch standard funding data" });
      }
    });


  // instant Funding 

  app.get('/instantFunding', async (req, res) => {
    try {
      const result = await instantFundingCollection.find().toArray();
      res.send(result);
    } catch (error) {
      res.status(500).send({ message: "Failed to fetch standard funding data" });
    }
  });













    app.get('/', (req, res) => {
      res.send("Server is running");
    });

    app.listen(port, () => {
      console.log(`App is running on port ${port}`);
    });

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");

  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
}

run().catch(console.dir);

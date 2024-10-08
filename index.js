const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();
const port = process.env.PORT || 5000;

// middlewares
app.use(cors());
app.use(express.json());

const ADMIN_EMAIL = process.env.ADMIN_MAIL;
const ADMIN_PASSWORD = process.env.ADMIN_PASS;

console.log(ADMIN_EMAIL, ADMIN_PASSWORD);

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.4dm99p5.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect to the MongoDB client
    await client.connect();

    const standardFundingCollection = client
      .db("zentexx")
      .collection("standardFunding");
    const instantFundingCollection = client
      .db("zentexx")
      .collection("instantFunding");

    const priceCollection = client.db("zentexx").collection("price");

    app.get("/price", async (req, res) => {
      try {
        const result = await priceCollection.find().toArray();
        res.send(result);
      } catch (error) {
        res
          .status(500)
          .send({ message: "Failed to fetch standard funding data" });
      }
    });

    // Login route
    app.post("/login", (req, res) => {
      console.log(req.body);
      const { email, password } = req.body;

      if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
        return res.send({ success: true, message: "Login successful" });
      } else {
        return res
          .status(401)
          .json({ success: false, message: "Invalid credentials" });
      }
    });

    // Standard Funding
    app.get("/standardFunding", async (req, res) => {
      try {
        const result = await standardFundingCollection.find().toArray();
        res.send(result);
      } catch (error) {
        res
          .status(500)
          .send({ message: "Failed to fetch standard funding data" });
      }
    });

    // instant Funding

    app.get("/instantFunding", async (req, res) => {
      try {
        const result = await instantFundingCollection.find().toArray();
        res.send(result);
      } catch (error) {
        res
          .status(500)
          .send({ message: "Failed to fetch standard funding data" });
      }
    });

    app.get("/", (req, res) => {
      res.send("Server is running");
    });

    app.listen(port, () => {
      console.log(`App is running on port ${port}`);
    });

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
}

run().catch(console.dir);

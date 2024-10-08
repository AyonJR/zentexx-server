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


  // single Update Item 

  app.get("/price/:id", async(req,res)=> {
    const id = req.params.id 
    const query = {_id : new ObjectId(id)}
    const result = await priceCollection.findOne(query)
    res.send(result)

  })


  // updating that item 


   // PATCH route to update a price item by ID
app.patch("/price/:id", async (req, res) => {
  const id = req.params.id;
  const updatedData = req.body; // The data that will be used to update the item

  const filter = { _id: new ObjectId(id) };
  const updateDoc = {
    $set: {
      r1: updatedData.r1,
      r2: updatedData.r2,
      r3: updatedData.r3,
      r4: updatedData.r4,
      r5: updatedData.r5,
      r6: updatedData.r6,
      r7: updatedData.r7,
      row: updatedData.row,
    },
  };

  try {
    const result = await priceCollection.updateOne(filter, updateDoc);
    if (result.matchedCount > 0) {
      res.send({ success: true, message: "Item updated successfully" });
    } else {
      res.status(404).send({ success: false, message: "Item not found" });
    }
  } catch (error) {
    res.status(500).send({ success: false, message: "Failed to update item" });
  }
});


// DELETE route to remove a price item by ID
app.delete("/price/:id", async (req, res) => {
  const id = req.params.id; 

  try {
    const query = { _id: new ObjectId(id) }; 
    const result = await priceCollection.deleteOne(query); 

    if (result.deletedCount > 0) {
      res.send({ success: true, message: "Item deleted successfully" });
    } else {
      res.status(404).send({ success: false, message: "Item not found" });
    }
  } catch (error) {
    res.status(500).send({ success: false, message: "Failed to delete item" });
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

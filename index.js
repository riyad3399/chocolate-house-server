const express = require("express");
const app = express();
const cors = require("cors");
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();

// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.xiw11k9.mongodb.net/?retryWrites=true&w=majority`;

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
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const chocolateCollection = client
      .db("chocolateDB")
      .collection("chocolate");

    app.get("/allChocolate", async (req, res) => {
      const cursor = chocolateCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });
    app.get("/allChocolate/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const cursor = await chocolateCollection.findOne(filter);
      res.send(cursor);
    });

    app.post("/allChocolate", async (req, res) => {
      const newChocolate = req.body;
      const result = await chocolateCollection.insertOne(newChocolate);
      res.send(result);
    });

    app.put("/allChocolate/:id", async (req, res) => {
      const id = req.params.id;
      console.log(id);
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updatedChocolate = req.body;
      const newChocolate = {
        $set: {
          name: updatedChocolate.name,
          country: updatedChocolate.country,
          category: updatedChocolate.category,
          photo: updatedChocolate.photo,
        },
      };
      const result = await chocolateCollection.updateOne(
        filter,
        newChocolate,
        options
      );
      res.send(result);
    });

    app.delete("/allChocolate/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      console.log(query);
      const result = await chocolateCollection.deleteOne(query);
      res.send(result);
    });

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("CHOCOLATE HOUSE is running");
});

app.listen(port, () => {
  console.log(`running on port: ${port}`);
});

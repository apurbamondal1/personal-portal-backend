const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;

require('dotenv').config();

// Middleware
app.use(cors());
app.use(express.json());


const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
// MongoDB Atlas URI (Use environment variables or replace with actual credentials)
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.p33egdz.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
console.log(uri)
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // await client.connect(); 
    const ContactCollections = client.db('personal-portal-server').collection('contactOptions');

    // Route to save contact form submission
    app.post('/contact', async (req, res) => {
      const { name, email, message, userId } = req.body;
      console.log("New message received:", { name, email, message, userId });

      try {
        const result = await ContactCollections.insertOne({ name, email, message, userId, createdAt: new Date() });
        res.status(200).json({ message: "Message saved successfully!", id: result.insertedId });
      } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to save message" });
      }
    });

  } catch (err) {
    console.error("MongoDB connection failed:", err);
  }
}

run().catch(console.dir);

// Default route
app.get('/', (req, res) => {
  res.send('personal portal server is running');
});

app.listen(port, () => {
    console.log(`personal portal is sitting on port ${port}`);
})

const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config();

class ReciterService {
  constructor() {
    // Create a new instance of MongoClient
    this.client = new MongoClient(process.env.CONNECTION_STRING, {
      serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
      }
    });

    this.db = this.client.db(process.env.DB_NAME);  // Connecting to the MongoDB database
    this.collection = this.db.collection("reciters"); // Get the "reciters" collection from the database
  }

  // This method closes the connection to the database to free up system resources and maintain effe
  async disconnect() {
    await this.client.close();
    this.db = null;
  }

  // Add a new reciter to the database
  async addReciter(name, gender) {
    let result;

    try {
      // Create a document with the given name and gender
      const document = {
        name: name,
        gender: gender,
      };

      // Insert the document into the "reciters" collection
      result = await this.collection.insertOne(document);
    } finally {
      // Close the database connection
      this.client.close();
    }

    return result;
  }

  // Get all the reciters from the database
  async getAllReciters() {
    const reciters = await this.collection.find().toArray(); // Converting all documents in the collection to an arr
    return reciters;
  }

  // Get number of reciters (documents) from "reciters" collection
  async getReciterCount() {
    return await this.collection.estimatedDocumentCount();
  }  
}

module.exports = ReciterService;

const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config();

class SessionService {
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
    this.collection = this.db.collection("sessions"); // Get the "sessions" collection from the database
  }

  // This method closes the connection to the database to free up system resources and maintain resource effeciency
  async disconnect() {
    await this.client.close();
    this.db = null;
  }

  async createSession(surah, ayah, reciterIds) {
    let result;

    try {
      // Create a document with the given name and gender
      const document = {
        surah: surah,
        ayah: ayah,
        reciterIds: reciterIds
      };

      // Insert the document into the "sessions" collection
      result = await this.collection.insertOne(document);
    } finally {
      // Close the database connection
      this.client.close();
    }

    return result;
  }
}

module.exports = SessionService;

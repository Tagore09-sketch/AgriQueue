const { MongoClient } = require("mongodb");
const dotenv = require("dotenv");
const path = require("path");

dotenv.config({ path: path.join(__dirname, "../../.env") });

const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/agriqueue";
const DB_NAME = "agriqueue";

let dbInstance = null;
let clientInstance = null;

// In-Memory Fallback Store mimicking MongoDB collections if MongoDB Atlas/Server is unreachable
class MemoryCollection {
  constructor(name) {
    this.name = name;
    this.docs = [];
  }

  async findOne(query) {
    return this.docs.find(doc => this._match(doc, query)) || null;
  }

  async insertOne(doc) {
    const _id = doc._id || `id_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`;
    const newDoc = { ...doc, _id };
    this.docs.push(newDoc);
    return { insertedId: _id, acknowledged: true };
  }

  find(query = {}) {
    const results = this.docs.filter(doc => this._match(doc, query));
    return {
      toArray: async () => results,
      sort: (sortObj) => {
        const key = Object.keys(sortObj)[0];
        const dir = sortObj[key];
        results.sort((a, b) => (a[key] > b[key] ? dir : -dir));
        return {
          toArray: async () => results,
          limit: (n) => ({ toArray: async () => results.slice(0, n) })
        };
      },
      limit: (n) => ({ toArray: async () => results.slice(0, n) })
    };
  }

  async updateOne(query, updateObj) {
    const index = this.docs.findIndex(doc => this._match(doc, query));
    if (index === -1) return { matchedCount: 0, modifiedCount: 0 };
    if (updateObj.$set) {
      this.docs[index] = { ...this.docs[index], ...updateObj.$set };
    }
    return { matchedCount: 1, modifiedCount: 1 };
  }

  async countDocuments(query = {}) {
    return this.docs.filter(doc => this._match(doc, query)).length;
  }

  _match(doc, query) {
    return Object.keys(query).every(key => {
      if (typeof query[key] === 'object' && query[key] !== null) {
        if (query[key].$in) return query[key].$in.includes(doc[key]);
        if (query[key].$ne) return doc[key] !== query[key].$ne;
      }
      return String(doc[key]) === String(query[key]);
    });
  }
}

class MemoryDb {
  constructor() {
    this.collections = {
      users: new MemoryCollection("users"),
      bookings: new MemoryCollection("bookings"),
      procurements: new MemoryCollection("procurements"),
      payments: new MemoryCollection("payments")
    };
  }
  collection(name) {
    if (!this.collections[name]) {
      this.collections[name] = new MemoryCollection(name);
    }
    return this.collections[name];
  }
}

const connectDB = async () => {
  if (dbInstance) return dbInstance;
  try {
    clientInstance = new MongoClient(MONGO_URI, {
      serverSelectionTimeoutMS: 2500
    });
    await clientInstance.connect();
    console.log("✅ Connected successfully to MongoDB Atlas/Server");
    dbInstance = clientInstance.db(DB_NAME);
  } catch (err) {
    console.warn("⚠️ Could not connect to external MongoDB URI. Using resilient embedded memory storage fallback.");
    dbInstance = new MemoryDb();
  }
  return dbInstance;
};

const getDb = () => {
  if (!dbInstance) {
    dbInstance = new MemoryDb();
  }
  return dbInstance;
};

module.exports = { connectDB, getDb };

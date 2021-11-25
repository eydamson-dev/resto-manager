const { MongoClient } = require('mongodb');
const fakeMongodb = require('mongo-mock');
const path = require('path');

const connectionString = process.env.CONNECTION_STRING;
let client;

if (process.env.NODE_ENV === 'test') {
  client = fakeMongodb.MongoClient;
  client.persist = path.resolve(__dirname, '../fakedb.js');
} else {
  client = new MongoClient(connectionString, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });
}

let dbConnection;

module.exports = {
  connectToServer(callback) {
    if (process.env.NODE_ENV === 'test') {
      return this.getTestClient(callback);
    } else {
      return this.getActualClient(callback);
    }
  },

  getTestClient(callback) {
    return client.connect('mongodb://localhost:27017/restaurants', (_, db) => {
      dbConnection = db.db('restaurants');
      callback();
    });
  },

  getActualClient(callback) {
    return client.connect(function (err, db) {
      if (err || !db) {
        return callback(err);
      }

      dbConnection = db.db('restaurants');
      return callback();
    });
  },

  close(callback) {
    return client.close(callback);
  },

  getDb() {
    return dbConnection;
  },

  collection(collectionName) {
    return this.getDb().collection(collectionName);
  }
};


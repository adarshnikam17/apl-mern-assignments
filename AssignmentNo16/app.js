const MongoClient = require('mongodb').MongoClient;
const url = "mongodb://localhost:27017/";

MongoClient.connect(url, function(err, db) {
  if (err) throw err;
  console.log("Database created!");
  db.close();
});

const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.question('Enter 1,2,3,4: ', (answer) => {
  const client = new MongoClient(url);
  client.connect(err => {
    if (err) throw err;
    const db = client.db('practical15');
    const collection = db.collection('students');

    switch(answer) {
      case '1': 
        collection.find().toArray((err, result) => {
          if (err) throw err;
          console.log(JSON.stringify(result, null, 2));
          client.close();
        });
        break;
      case '2': 
        const student = { name: 'Sami', age: 21 };
        collection.insertOne(student, (err, result) => {
          if (err) throw err;
          console.log('Student inserted');
          client.close();
        });
        break;
      case '3': 
        const query = { name: 'Sami' };
        const newValues = { $set: { age: 22 } };
        collection.updateOne(query, newValues, (err, result) => {
          if (err) throw err;
          console.log('Student updated');
          client.close();
        });
        break;
      case '4': 
        const deleteQuery = { name: 'Sami' };
        collection.deleteOne(deleteQuery, (err, result) => {
          if (err) throw err;
          console.log('Student deleted');
          client.close();
        });
        break;
      default:
        console.log('Invalid input');
        client.close();
    }
  });
  rl.close();
});

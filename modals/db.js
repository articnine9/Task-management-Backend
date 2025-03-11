const mongodb=require('mongodb')
const mongoClient=mongodb.MongoClient
const ObjectId=mongodb.ObjectId

let database

async function getDatabase(){
    const client = await mongoClient.connect("mongodb://localhost:27017")
    database=client.db('taskmanagementsystem')

    if(!database){
        console.log("Database not connected")
    }
    return database
}

module.exports={getDatabase,ObjectId}
const { MongoClient } = require('mongodb');
require('dotenv').config();

async function nukeDB() {
    const url = process.env.MONGO_URL;
    const dbName = 'antidoteTranscribe';
    const client = new MongoClient(url);

    try {
        await client.connect();
        console.log(`Connected to database: ${dbName}`);
        const db = client.db(dbName);

        // List collections before dropping
        const initialCollections = await db.collections();
        console.log('Initial collections:', initialCollections.map(c => c.collectionName));

        for (let collection of initialCollections) {
            await collection.drop();
            console.log(`Dropped collection: ${collection.collectionName}`);
        }

        // List collections after dropping
        const finalCollections = await db.collections();
        console.log('Final collections:', finalCollections.map(c => c.collectionName));

        console.log('Dropped all collections in the database');
    } catch (error) {
        console.error('Error nuking the DB!', error);
    } finally {
        await client.close();
    }
}

nukeDB();

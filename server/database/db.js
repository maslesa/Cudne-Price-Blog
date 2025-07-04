const mongoose = require('mongoose');

const connectToMongoDB = async() => {
    try {
        await mongoose.connect(process.env.MONGODB_URL);
        console.log('successfully connected to mongodb');
    } catch (error) {
        console.log('error connecting to mongodb: ', error);
        process.exit(0);
    }
}

module.exports = connectToMongoDB;
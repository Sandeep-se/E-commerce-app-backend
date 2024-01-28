const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
     mongoose.connect(process.env.DB_API, {useNewUrlParser: true,useUnifiedTopology: true})

    mongoose.connection.on('error', console.error.bind(console, 'connection error'));
    mongoose.connection.once('open', () => console.log('MongoDB connected'));
};

module.exports = connectDB;

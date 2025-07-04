require('dotenv').config();
const express = require('express');
const app = express();

const connectToMongoDB = require('./database/db');
const authRoutes = require('./routes/auth-routes');

connectToMongoDB();

app.use(express.json());
app.use('/admin', authRoutes);

app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
})
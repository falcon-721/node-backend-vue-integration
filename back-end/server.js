const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');

require('dotenv').config();

const app = express();
const port = process.env.PORT;

app.use(cors());
app.use(express.json());

const uri = process.env.ATLAS_URI;
mongoose.connect(uri, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true });

const connection = mongoose.connection;

connection.once('open', () => {
    console.log("MongoDB database connection established successfully");
});


// chargebee routes
const chargebeeRouter = require('./api/routes/RouteModel');

app.use('/chargebee', chargebeeRouter);

app.use('/', express.static(path.resolve(__dirname, './dist')));

app.get('*', function(req, res) {
    res.sendFile(path.resolve(__dirname, './dist/index.html'));
    res.end();
});

app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
});
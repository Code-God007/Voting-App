const mongoose = require('mongoose');

// Map global promises
mongoose.Promise = global.Promise;

// Mongoose Connect
mongoose.connect('mongodb+srv://nitish:nitish@cluster0-d3dss.mongodb.net/test?retryWrites=true&w=majority')
.then(() => console.log('MongoDB Connected'))
.catch(err => console.log(err));


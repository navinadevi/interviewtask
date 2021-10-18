const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/task',
{   useNewUrlParser: true,
    useUnifiedTopology: true
});

mongoose.connection.once("open", function() {
    console.log("MongoDB database connection established successfully");
});

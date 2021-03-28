const express = require('express');
const connectDB = require('./config/db');
const PORT = process.env.PORT || 5000;


const configExpress = require('./config/express');
const app = express();
configExpress(app);

// Connect Database : Mongoose
connectDB();

// connectDB()
//     .then(() => {
//         app.listen(PORT, () => {
//             console.log(`Server started on port ${PORT}`);
//         });
//     })
//     .catch(err => {
//         console.error(err.message);
//         // Exit process with failure
//         process.exit(1);
//     });

app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});
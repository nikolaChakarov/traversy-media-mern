const mongoose = require('mongoose');
const config = require('config');
const db = config.get('mongoURI');

const connectDB = async () => {
    try {
        await mongoose.connect(db, {
            useUnifiedTopology: true,
            useNewUrlParser: true,
            useCreateIndex: true,
            useFindAndModify: false
        }, () => {
            console.log('MongoDB connected...');
        })
    } catch (err) {
        console.error(err.message);
        // Exit process with failure
        process.exit(1);
    }
}

// function configMongoose() {
//     return mongoose.connect(db)
//         .then(() => console.log('Database connected'))
//         .catch(err => console.error(err.message));
// }

module.exports = connectDB;
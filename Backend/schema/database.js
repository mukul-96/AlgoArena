const mongoose = require("mongoose");
require('dotenv').config();
const mongoURI = process.env.MONGODB_URI;
mongoose.connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log("MongoDB connected successfully");
}).catch((err) => {
    console.error("MongoDB connection error:", err);
});

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true, match: /.+\@.+\..+/ }, 
    password: { type: String, required: true, minlength: 6 }, 
    friends: [{ type: String }],
    rank: { type: String, default: 'KING' },
    createdAt: { type: Date, default: Date.now },
});

const problemSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    testCases: [
        {
            input: { type: String, required: true }, 
            expectedOutput: { type: String, required: true }, 
        },
    ],
    tags: [{ type: String }],
    difficulty: { type: String, enum: ['Easy', 'Medium', 'Hard'], required: true },
    createdAt: { type: Date, default: Date.now },
});

const User = mongoose.model('User', userSchema);
const Problem = mongoose.model('Problem', problemSchema);

module.exports = { User, Problem };

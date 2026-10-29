const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

// Connect to MongoDB Compass
mongoose.connect('mongodb://localhost:27017/learnifyDB')
    .then(() => console.log('Connected to MongoDB successfully!'))
    .catch(err => console.error('Connection error:', err));

// Student Schema & Model
const studentSchema = new mongoose.Schema({
    name: String,
    age: Number,
    course: String,
    city: String,
    email: { type: String, unique: true },
    password: String
});

const Student = mongoose.model('Student', studentSchema);

// Registration Route
app.post('/api/register', async (req, res) => {
    try {
        const newStudent = new Student(req.body);
        await newStudent.save();
        res.json({ success: true, message: "Registration Successful & Saved to MongoDB!" });
    } catch (err) {
        res.json({ success: false, message: "Error: Email might already exist." });
    }
});

// Login Route
app.post('/api/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const student = await Student.findOne({ email, password });
        
        if (student) {
            res.json({ success: true, student });
        } else {
            res.json({ success: false, message: "Invalid Email or Password!" });
        }
    } catch (err) {
        res.json({ success: false, message: "Server error." });
    }
});

app.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
});
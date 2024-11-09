const express = require("express");
const bcrypt = require('bcryptjs');
const { User, Problem } = require("../schema/database");
const jwt = require('jsonwebtoken');
const axios = require('axios');
require('dotenv').config(); 
const JWT_SECRET = process.env.JWT_SECRET;
const rapidApiKey = process.env.RAPID_API_KEY;
const router = express.Router();
router.post('/register', async (req, res) => {
    const { username, email, password } = req.body;

    try {
        const existingUser = await User.findOne({ $or: [{ email }, { username }] });
        if (existingUser) {
            if (existingUser.email === email) {
                return res.status(400).json({ message: 'Email already in use' });
            } else if (existingUser.username === username) {
                return res.status(400).json({ message: 'Username already taken' });
            }
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            username,
            email,
            password: hashedPassword,
        });
        await newUser.save();

        const token = jwt.sign({ id: newUser._id,username:newUser.username }, JWT_SECRET);

        res.json({ token, user: { id: newUser._id, username: newUser.username, email: newUser.email, rank: newUser.rank } });
    } catch (err) {
        res.status(500).json({ message: 'Server Error' });
    }
});

router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'User does not exist' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign({ id: user._id,username:user.username }, JWT_SECRET);

        res.json({ token, user: { id: user._id, username: user.username, email: user.email, rank: user.rank } });
    } catch (err) {
        res.status(500).json({ message: 'Server Error' });
    }
});

router.post('/addproblem', async (req, res) => {
    const { title, description, difficulty, testCases, tags } = req.body;
    console.log(title,description,difficulty,testCases,tags)
    try {
        const existingProblem = await Problem.findOne({ title });
        if (existingProblem) {
            return res.status(400).json({ message: 'Problem with this title already exists' });
        }

        if (!title || !description || !difficulty || !testCases || testCases.length === 0) {
            return res.status(400).json({ message: 'All fields are required, and at least one test case is needed' });
        }

        const newProblem = new Problem({
            title,
            description,
            difficulty,
            testCases,
            tags,
        });

        await newProblem.save();

        res.status(201).json({ message: 'Problem added successfully', problem: newProblem });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
});

router.post('/search-friend', async (req, res) => {
    const { friendUsername } = req.body;

    try {
        const user = await User.findOne({ username: friendUsername });

        if (!user) {
            return res.status(404).json({ error: 'No friend found' });
        }

        res.status(200).json({ message: 'Friend found', user: { user } });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to search for friend' });
    }
});

router.get('/friends-list/:userName', async (req, res) => {
    const { userName } = req.params;

    try {
        const user = await User.findOne({ username: userName });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.status(200).json({ friends: user.friends });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch friends' });
    }
});

router.post('/add-friend/:userName', async (req, res) => {
    const { friendUserName } = req.body;
    const { userName: userName } = req.params;

    try {
        const user = await User.findOne({ username: userName });

        if (user.friends.includes(friendUserName)) {
            return res.status(400).json({ error: 'Friend already added' });
        }
        user.friends.push(friendUserName);
        await user.save();

        res.status(200).json({ message: 'Friend added successfully', friends: user.friends });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to add friend' });
    }
});

router.get('/random-problem', async (req, res) => {
    try {
        const count = await Problem.countDocuments();
        const randomIndex = Math.floor(Math.random() * count);
        const randomProblem = await Problem.findOne().skip(randomIndex);

        if (randomProblem) {
            res.status(200).json(randomProblem);
        } else {
            res.status(404).json({ message: 'No problem found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'An error occurred', error });
    }
});

router.post('/submit', async (req, res) => {
    const { source_code, problem_id, language_id, time, userName } = req.body;
    try {
        const problem = await Problem.findById(problem_id);
        if (!problem) {
            return res.status(400).json({ error: 'Problem not found' });
        }
        const encodedSourceCode = Buffer.from(source_code).toString('base64');
        const results = [];

        for (const testCase of problem.testCases) {
            const stdin = Buffer.from(testCase.input).toString('base64');
            const expected_output = Buffer.from(testCase.expectedOutput).toString('base64');

            const options = {
                method: 'POST',
                url: 'https://judge029.p.rapidapi.com/submissions',
                params: {
                    base64_encoded: 'true',
                    wait: 'false',
                    fields: '*'
                },
                headers: {
                    'x-rapidapi-key': rapidApiKey,
                    'x-rapidapi-host': 'judge029.p.rapidapi.com',
                    'Content-Type': 'application/json'
                },
                data: {
                    source_code: encodedSourceCode,
                    language_id: parseInt(language_id),
                    stdin: stdin,
                    expected_output: expected_output
                }
            };

            const submissionResponse = await axios.request(options);
            const token = submissionResponse.data.token;

            let retries = 5;
            let taskResult;

            while (retries > 0) {
                await new Promise(resolve => setTimeout(resolve, 2000));

                const taskResponse = await axios.get(`https://judge029.p.rapidapi.com/submissions/${token}`, {
                    params: {
                        base64_encoded: 'true',
                        fields: '*'
                    },
                    headers: {
                        'x-rapidapi-key': rapidApiKey,
                        'x-rapidapi-host': 'judge029.p.rapidapi.com',
                    }
                });

                taskResult = taskResponse.data;

                if (taskResult.status.description !== 'In Queue') {
                    break;
                }

                retries--;
            }

            results.push({
                task: token,
                status: taskResult.status.description,
                stdout: taskResult.stdout,
                stderr: taskResult.stderr,
                compile_output: taskResult.compile_output,
            });
        }

        const allPassed = results.every(result => result.status === 'Accepted');
        const message = allPassed ? "All test cases passed" : "Some test cases failed";

        res.json({
            message,
            status: allPassed ? "Accepted" : "Failed",
            results
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Submission failed', details: error.message });
    }
});

module.exports = router;

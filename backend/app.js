const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const Post = require('./models/post.js');
const mongoose = require('mongoose');

// Use bodyParser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Use cors middleware
app.use(cors());

// Connect to MongoDB
mongoose.connect("mongodb+srv://07209292:09984831193@janrey.cym6m47.mongodb.net/janrey?retryWrites=true&w=majority&appName=janrey")
.then(() => {
    console.log('Connected to the database');
})
.catch(() => {
    console.log('connection failed');
});
// Set CORS headers
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Headers", "Origin, x-Requested-with, Content-Type, Accept");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE, OPTIONS");
    next();
});

// POST route for adding a new post
// Example backend route for creating a new post
app.post('/api/posts', (req, res) => {
    const post = new Post({
       title: req.body.title,
       content: req.body.content
    });
    post.save()
       .then(savedPost => {
         res.status(201).json(savedPost);
       })
       .catch(err => {
         console.error(err);
         res.status(500).json({ message: 'Error saving post' });
       });
   });
   
// app.js
app.delete('/api/posts/:id', async (req, res) => {
    try {
       const post = await Post.findByIdAndDelete(req.params.id);
       if (!post) {
         return res.status(404).json({ message: 'Post not found' });
       }
       res.json({ message: 'Post deleted successfully' });
    } catch (error) {
       res.status(500).json({ message: 'Server error' });
    }
   });

// PUT route for updating a post
app.put('/api/posts/:id', async (req, res) => {
    console.log('Received PUT request for post ID:', req.params.id);
    console.log('Request body:', req.body);
    try {
       const post = await Post.findByIdAndUpdate(req.params.id, req.body, { new: true });
       if (!post) {
         return res.status(404).json({ message: 'Post not found' });
       }
       res.json(post);
    } catch (error) {
       res.status(500).json({ message: 'Server error' });
    }
});

// GET route for fetching all posts
app.use('/api/posts', (req, res, next) => {
   Post.find().then(documents => {
    res.status(200).json({
        message: 'Posts fetched successfully',
        posts: documents
     });
    })
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

module.exports = app;
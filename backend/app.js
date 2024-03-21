const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const Post = require('./models/post.js');
const mongoose = require('mongoose');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(cors());

mongoose.connect("mongodb+srv://07209292:09984831193@janrey.cym6m47.mongodb.net/janrey?retryWrites=true&w=majority&appName=janrey")
.then(() => {
    console.log('Connected to the database');
})
.catch(() => {
    console.log('connection failed');
});

app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Headers", "Origin, x-Requested-with, Content-Type, Accept");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE, OPTIONS");
    next();
});

// POST route for adding a new post
app.post('/api/posts', (req, res) => {
    const post = new Post({
       title: req.body.title,
       content: req.body.content,
       imageUrl: req.body.imageUrl // Include the imageUrl field
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

// DELETE route for deleting a post
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
app.get('/api/posts', (req, res) => { // Changed from app.use to app.get
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
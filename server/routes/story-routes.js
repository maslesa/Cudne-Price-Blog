const express = require('express');
const { getAllStories, postStory, updateStory, deleteStory } = require('../controllers/story-controllers');
const isAdmin = require('../middlewares/isAdmin');
const router = express.Router();

router.get('/fetch-all', getAllStories);
router.post('/post-story', isAdmin, postStory);
router.put('/update-story/:id', isAdmin, updateStory);
router.delete('/delete-story/:id', isAdmin, deleteStory);

module.exports = router;
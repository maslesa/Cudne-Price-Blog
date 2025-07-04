const Story = require('../models/Story');

const { sendStoryNotification } = require('../utils/emailNotification');

const getAllStories = async (req, res) => {
    try {
        const stories = await Story.find();

        if (!stories) {
            return res.status(404).json({
                success: false,
                message: 'Error fetching all stories'
            })
        }

        if (stories.length === 0) {
            return res.status(200).json({
                success: true,
                message: 'There are no any story.'
            })
        }

        res.status(200).json({
            success: true,
            message: 'All stories fetched successfully',
            stories,
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        })
    }
}

const postStory = async (req, res) => {
    try {
        const { title, shortDesc, desc, tags, socialLinks } = req.body;

        const newStory = new Story({
            title,
            shortDesc,
            desc,
            tags,
            socialLinks
        });

        newStory.save();

        await sendStoryNotification(req.userInfo.username, newStory.title, "created");

        res.status(200).json({
            success: true,
            message: 'Story posted successfully!',
            newStory
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        })
    }
}

const updateStory = async (req, res) => {
    try {
        const storyId = req.params.id;

        const story = await Story.findById(storyId);
        if (!story) {
            return res.status(404).json({
                success: false,
                message: 'Story with that ID has not found!'
            })
        }

        const userInputUpdate = req.body;

        const updatedStory = await Story.findByIdAndUpdate(storyId, userInputUpdate, { new: true });

        await sendStoryNotification(req.userInfo.username, updatedStory.title, "updated");

        res.status(200).json({
            success: true,
            message: 'Story updated successfully',
            updatedStory
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        })
    }
}

const deleteStory = async (req, res) => {
    try {
        const storyId = req.params.id;

        const story = await Story.findById(storyId);
        if (!story) {
            return res.status(404).json({
                success: false,
                message: 'Story with that ID has not found!'
            })
        }

        await Story.findByIdAndDelete(storyId);

        await sendStoryNotification(req.userInfo.username, story.title, "deleted");

        res.status(200).json({
            success: true,
            message: 'Story deleted successfully',
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        })
    }
}


module.exports = {
    getAllStories,
    postStory,
    updateStory,
    deleteStory
}
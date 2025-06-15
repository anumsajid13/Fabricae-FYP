const SuccessStory = require('../data/models/SuccessStory');

class SuccessStoryController {
  // Create new success story
  async createStory(req, res) {
    try {
      // Basic validation (you can expand this)
      const { name, profession, rating, testimonial } = req.body;
      
      if (!name || !profession || !rating || !testimonial) {
        return res.status(400).json({
          success: false,
          message: 'All fields are required',
          errors: [
            { field: 'name', message: 'Name is required' },
            { field: 'profession', message: 'Profession is required' },
            { field: 'rating', message: 'Rating is required' },
            { field: 'testimonial', message: 'Testimonial is required' }
          ].filter(error => !req.body[error.field])
        });
      }

      const story = new SuccessStory(req.body);
      await story.save();

      res.status(201).json({
        success: true,
        message: 'Success story created successfully',
        data: story
      });
    } catch (error) {
      if (error.name === 'ValidationError') {
        return res.status(400).json({
          success: false,
          message: 'Validation error',
          errors: Object.values(error.errors).map(err => ({
            field: err.path,
            message: err.message
          }))
        });
      }

      res.status(500).json({
        success: false,
        message: 'Error creating success story',
        error: error.message
      });
    }
  }

  // Get top 3 success stories (highest rated)
  async getTopStories(req, res) {
    try {
      const stories = await SuccessStory.find()
        .sort({ rating: -1, createdAt: -1 })
        .limit(3)
        .select('-__v');

      res.status(200).json({
        success: true,
        data: stories
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error fetching top stories',
        error: error.message
      });
    }
  }

  // Get all success stories
  async getAllStories(req, res) {
    try {
      const { page = 1, limit = 10 } = req.query;

      const stories = await SuccessStory.find()
        .sort({ rating: -1, createdAt: -1 })
        .limit(limit * 1)
        .skip((page - 1) * limit)
        .select('-__v');

      const total = await SuccessStory.countDocuments();

      res.status(200).json({
        success: true,
        data: stories,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(total / limit),
          totalItems: total,
          itemsPerPage: parseInt(limit)
        }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error fetching success stories',
        error: error.message
      });
    }
  }
}

module.exports = new SuccessStoryController();
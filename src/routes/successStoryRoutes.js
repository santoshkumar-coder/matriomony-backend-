const express = require("express");
const router = express.Router();

const {
  createStory,
  getAllStories,
  getStoryById,
  updateStory,
  deleteStory,
} = require("../controllers/successStoryController");

router
  .route("/")
  .post(createStory)
  .get(getAllStories);

router
  .route("/:id")
  .get(getStoryById)
  .put(updateStory)
  .delete(deleteStory);

module.exports = router;
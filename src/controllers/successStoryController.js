const SuccessStory = require("../models/successStoryModel");
const asyncHandler = require("../utils/asyncHandler");

const createSuccessStory = asyncHandler(async (req, res) => {
  const { title, coupleName, description, weddingDate, yearsTogether } = req.body;

  if (!title || !coupleName || !description || !weddingDate || !yearsTogether) {
    return res.status(400).json({
      success: false,
      message: "All fields are required",
    });
  }

  if (!req.files || req.files.length === 0) {
    return res.status(400).json({
      success: false,
      message: "At least one image is required",
    });
  }

  const imagePaths = req.files.map((file) => `/uploads/${file.filename}`);

  const successStory = await SuccessStory.create({
    title,
    coupleName,
    description,
    weddingDate,
    yearsTogether,
    images: imagePaths,
  });

  res.status(201).json({
    success: true,
    message: "Success story created successfully",
    data: successStory,
  });
});

const getAllSuccessStories = asyncHandler(async (req, res) => {
  const stories = await SuccessStory.find().sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    data: stories,
  });
});

const getSuccessStoryById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const story = await SuccessStory.findById(id);

  if (!story) {
    return res.status(404).json({
      success: false,
      message: "Success story not found",
    });
  }

  res.status(200).json({
    success: true,
    data: story,
  });
});

const deleteSuccessStory = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const story = await SuccessStory.findByIdAndDelete(id);

  if (!story) {
    return res.status(404).json({
      success: false,
      message: "Success story not found",
    });
  }

  res.status(200).json({
    success: true,
    message: "Success story deleted successfully",
  });
});

const toggleHideSuccessStory = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const story = await SuccessStory.findById(id);

  if (!story) {
    return res.status(404).json({
      success: false,
      message: "Success story not found",
    });
  }

  story.isHidden = !story.isHidden;
  await story.save();

  res.status(200).json({
    success: true,
    message: `Success story ${story.isHidden ? "hidden" : "unhidden"} successfully`,
    data: {
      isHidden: story.isHidden,
    },
  });
});

module.exports = {
  createSuccessStory,
  getAllSuccessStories,
  getSuccessStoryById,
  deleteSuccessStory,
  toggleHideSuccessStory,
};
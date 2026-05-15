const successStoryService = require("../services/successStoryService");
const asyncHandler = require("../utils/asyncHandler");
const cleanBody = require("../utils/cleanBody");


exports.createStory = asyncHandler(async (req, res) => {
  const data = cleanBody(req.body);
  const story = await successStoryService.create(data);
  res.status(201).json({
    success: true,
    message: "Success story created successfully",
    data: story,
  });
});


exports.getAllStories = asyncHandler(async (req, res) => {
  const stories = await successStoryService.getAll();
  res.status(200).json({
    success: true,
    count: stories.length,
    data: stories,
  });
});


exports.getStoryById = asyncHandler(async (req, res) => {
  const story = await successStoryService.getById(req.params.id);
  res.status(200).json({
    success: true,
    data: story,
  });
});


exports.updateStory = asyncHandler(async (req, res) => {
  const data = cleanBody(req.body);
  const story = await successStoryService.update(req.params.id, data);
  res.status(200).json({
    success: true,
    data: story,
  });
});


exports.deleteStory = asyncHandler(async (req, res) => {
  await successStoryService.delete(req.params.id);
  res.status(200).json({
    success: true,
    message: "Success story removed successfully",
  });
});
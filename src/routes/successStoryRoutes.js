const router = require("express").Router();
const {
  createSuccessStory,
  getAllSuccessStories,
  getSuccessStoryById,
  deleteSuccessStory,
  toggleHideSuccessStory,
} = require("../controllers/successStoryController");
const upload = require("../config/multer");

router.post("/create", upload.array("images", 4), createSuccessStory);
router.get("/", getAllSuccessStories);
router.get("/:id", getSuccessStoryById);
router.put("/toggle-hide/:id", toggleHideSuccessStory);
router.delete("/delete/:id", deleteSuccessStory);

module.exports = router;
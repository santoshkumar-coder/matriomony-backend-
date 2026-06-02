const router = require("express").Router();
const savedSearchController = require("../controllers/savedSearchController");
const { authMiddleware } = require("../middlewares/authMiddleware");

router.use(authMiddleware);

router.post("/create", savedSearchController.createSavedSearch);
router.get("/get-all", savedSearchController.getSavedSearches);
router.put("/update/:id", savedSearchController.updateSavedSearch);
router.delete("/delete/:id", savedSearchController.deleteSavedSearch);
router.get("/execute/:id", savedSearchController.executeSavedSearch);

module.exports = router;
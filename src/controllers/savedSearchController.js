const asyncHandler = require("../utils/asyncHandler");
const SavedSearch = require("../models/savedSearchModel");
const User = require("../models/userModel");

const savedSearchController = {
  createSavedSearch: asyncHandler(async (req, res) => {
    const userId = req.user.id;
    const {
      title,
      minAge,
      maxAge,
      professions,
      locations,
      religions,
      motherTongues,
      isPremium,
      isVerifiedOnly,
      specialTags,
    } = req.body;

    if (!title) {
      return res.status(400).json({
        success: false,
        message: "Title is required",
      });
    }

    const savedSearch = new SavedSearch({
      userId,
      title,
      minAge,
      maxAge,
      professions,
      locations,
      religions,
      motherTongues,
      isPremium,
      isVerifiedOnly,
      specialTags,
    });

    await savedSearch.save();

    res.status(201).json({
      success: true,
      message: "Search filter saved successfully",
      data: savedSearch,
    });
  }),

  getSavedSearches: asyncHandler(async (req, res) => {
    const userId = req.user.id;
    const savedSearches = await SavedSearch.find({ userId }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: savedSearches,
    });
  }),

  updateSavedSearch: asyncHandler(async (req, res) => {
    const { id } = req.params;
    const userId = req.user.id;

    const savedSearch = await SavedSearch.findOne({ _id: id, userId });

    if (!savedSearch) {
      return res.status(404).json({
        success: false,
        message: "Saved search not found",
      });
    }

    const updatedData = await SavedSearch.findByIdAndUpdate(
      id,
      { $set: req.body },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: "Saved search updated successfully",
      data: updatedData,
    });
  }),

  deleteSavedSearch: asyncHandler(async (req, res) => {
    const { id } = req.params;
    const userId = req.user.id;

    const savedSearch = await SavedSearch.findOneAndDelete({ _id: id, userId });

    if (!savedSearch) {
      return res.status(404).json({
        success: false,
        message: "Saved search not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Saved search deleted successfully",
    });
  }),

  executeSavedSearch: asyncHandler(async (req, res) => {
    const { id } = req.params;
    const userId = req.user.id;

    const searchPref = await SavedSearch.findOne({ _id: id, userId });

    if (!searchPref) {
      return res.status(404).json({
        success: false,
        message: "Saved search preference not found",
      });
    }

    let query = {
      _id: { $ne: userId },
      isActive: true,
      isHidden: false,
    };

    if (searchPref.minAge || searchPref.maxAge) {
      query.dob = {};
      const today = new Date();
      if (searchPref.minAge) {
        const maxDob = new Date(today.getFullYear() - searchPref.minAge, today.getMonth(), today.getDate());
        query.dob.$lte = maxDob;
      }
      if (searchPref.maxAge) {
        const minDob = new Date(today.getFullYear() - (searchPref.maxAge + 1), today.getMonth(), today.getDate());
        query.dob.$gte = minDob;
      }
    }

    if (searchPref.professions && searchPref.professions.length > 0) {
      query.profession = { $in: searchPref.professions };
    }

    if (searchPref.locations && searchPref.locations.length > 0) {
      query.$or = [
        { city: { $in: searchPref.locations } },
        { state: { $in: searchPref.locations } },
        { country: { $in: searchPref.locations } }
      ];
    }

    if (searchPref.religions && searchPref.religions.length > 0) {
      query.religion = { $in: searchPref.religions };
    }

    if (searchPref.motherTongues && searchPref.motherTongues.length > 0) {
      query.motherTongue = { $in: searchPref.motherTongues };
    }

    if (searchPref.isVerifiedOnly) {
      query.$or = [
        { "verification.identityVerified": true },
        { "verification.mobileVerified": true },
        { "verification.professionalVerified": true }
      ];
    }

    const matchedUsers = await User.find(query)
      .select("fullName gender dob profession city state country religion motherTongue photos subscriptionTier verification")
      .limit(50);

    res.status(200).json({
      success: true,
      count: matchedUsers.length,
      data: matchedUsers,
    });
  }),
};

module.exports = savedSearchController;
const User = require("../models/userModel");

exports.getAdvancedMatches = async (req, res) => {
  try {
    const loggedInUser = req.user;
    if (!loggedInUser) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const currentUser = await User.findById(loggedInUser.id || loggedInUser._id);
    if (!currentUser) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const {
      degrees,
      profession,
      minIncome,
      country,
      citizenship,
      diets,
      smoking,
      drinking,
      gotra,
      page = 1,
      limit = 10
    } = req.body;

    const pageNumber = parseInt(page, 10) || 1;
    const limitNumber = parseInt(limit, 10) || 10;
    const skip = (pageNumber - 1) * limitNumber;

    const query = {
      _id: { $ne: currentUser._id },
      isActive: true,
      isHidden: false,
      blockedProfiles: { $ne: currentUser._id }
    };

    if (currentUser.gender) {
      query.gender = currentUser.gender.toLowerCase() === "male" ? "female" : "male";
    }

    const excludedIds = [
      ...(currentUser.blockedProfiles || []),
      ...(currentUser.rejectedProfiles || [])
    ];

    if (excludedIds.length > 0) {
      query._id = { $ne: currentUser._id, $nin: excludedIds };
    }

    if (degrees && degrees.length > 0) {
      const degreeArray = Array.isArray(degrees) ? degrees : [degrees];
      query.highestQualification = { $in: degreeArray.map(d => new RegExp(d, "i")) };
    }

    if (profession) {
      query.profession = { $regex: profession, $options: "i" };
    }

    if (minIncome) {
      query.incomeValue = { $gte: Number(minIncome) };
    }

    if (country) {
      query.country = { $regex: `^${country}$`, $options: "i" };
    }

    if (citizenship) {
      query.citizenship = { $regex: `^${citizenship}$`, $options: "i" };
    }

    if (diets && diets.length > 0) {
      const dietArray = Array.isArray(diets) ? diets : [diets];
      query["lifestyle.diet"] = { $in: dietArray.map(d => new RegExp(d, "i")) };
    }

    if (smoking && smoking.length > 0) {
      const smokingArray = Array.isArray(smoking) ? smoking : [smoking];
      query["lifestyle.smoking"] = { $in: smokingArray.map(s => new RegExp(s, "i")) };
    }

    if (drinking && drinking.length > 0) {
      const drinkingArray = Array.isArray(drinking) ? drinking : [drinking];
      query["lifestyle.drinking"] = { $in: drinkingArray.map(d => new RegExp(d, "i")) };
    }

    if (gotra) {
      query["horoscope.gotra"] = { $regex: gotra, $options: "i" };
    }

    const total = await User.countDocuments(query);
    const data = await User.find(query)
      .select("-password")
      .skip(skip)
      .limit(limitNumber)
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: data.length,
      totalMatches: total,
      currentPage: pageNumber,
      totalPages: Math.ceil(total / limitNumber),
      data: data
    });
  } catch (error) {
    console.error("Match Controller Error:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message
    });
  }
};

exports.getPersonalizedMatches = async (req, res) => {
  try {
    const loggedInUser = req.user;
    if (!loggedInUser) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const currentUser = await User.findById(loggedInUser.id || loggedInUser._id);
    if (!currentUser) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    if (!currentUser.partnerPreference) {
      return res.status(400).json({ success: false, message: "Please set your partner preferences first" });
    }

    const pref = currentUser.partnerPreference;
    const query = {
      _id: { $ne: currentUser._id },
      isActive: true,
      isHidden: false,
      gender: currentUser.gender.toLowerCase() === "male" ? "female" : "male"
    };

    const excludedIds = [
      ...(currentUser.blockedProfiles || []),
      ...(currentUser.rejectedProfiles || [])
    ];

    if (excludedIds.length > 0) {
      query._id = { $nin: excludedIds };
    }

    if (pref) {
      if (pref.ageRange) {
        const currentYear = new Date().getFullYear();
        const minBirthYear = currentYear - pref.ageRange.max;
        const maxBirthYear = currentYear - pref.ageRange.min;
        query.dob = {
          $gte: new Date(`${minBirthYear}-01-01`),
          $lte: new Date(`${maxBirthYear}-12-31`)
        };
      }

      if (pref.religion && pref.religion.length > 0) {
        query.religion = { $in: pref.religion };
      }

      if (pref.motherTongue && pref.motherTongue.length > 0) {
        query.motherTongue = { $in: pref.motherTongue };
      }

      if (pref.maritalStatus && pref.maritalStatus.length > 0) {
        query.maritalStatus = { $in: pref.maritalStatus };
      }
    }

    const matches = await User.find(query).select("-password").limit(50);

    res.status(200).json({
      success: true,
      count: matches.length,
      data: matches
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getCompatibilityDetails = async (req, res) => {
  try {
    const loggedInUser = req.user;
    const { targetUserId } = req.params;

    if (!loggedInUser) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const currentUser = await User.findById(loggedInUser.id);
    if (!currentUser) {
      return res.status(404).json({ success: false, message: "Current user profile not found" });
    }

    const targetUser = await User.findById(targetUserId);
    if (!targetUser) {
      return res.status(404).json({ success: false, message: "Target user not found" });
    }

    let scorePoints = 0;

    const isSameReligion = currentUser.religion && targetUser.religion && 
      currentUser.religion.toLowerCase() === targetUser.religion.toLowerCase();
    if (isSameReligion) scorePoints += 15;

    const isSameMotherTongue = currentUser.motherTongue && targetUser.motherTongue && 
      currentUser.motherTongue.toLowerCase() === targetUser.motherTongue.toLowerCase();
    if (isSameMotherTongue) scorePoints += 5;

    const isVegetarianMatch = currentUser.lifestyle?.diet && targetUser.lifestyle?.diet && 
      currentUser.lifestyle.diet.toLowerCase() === "vegetarian" && 
      targetUser.lifestyle.diet.toLowerCase() === "vegetarian";
    if (isVegetarianMatch) scorePoints += 20;

    const smokingMatch = currentUser.lifestyle?.smoking && targetUser.lifestyle?.smoking && 
      currentUser.lifestyle.smoking.toLowerCase() === targetUser.lifestyle.smoking.toLowerCase();
    if (smokingMatch) scorePoints += 15;

    const drinkingMatch = currentUser.lifestyle?.drinking && targetUser.lifestyle?.drinking && 
      currentUser.lifestyle.drinking.toLowerCase() === targetUser.lifestyle.drinking.toLowerCase();
    if (drinkingMatch) scorePoints += 15;

    const pref = currentUser.partnerPreference;
    if (pref && pref.ageRange && targetUser.dob) {
      const birthYear = new Date(targetUser.dob).getFullYear();
      const currentYear = new Date().getFullYear();
      const age = currentYear - birthYear;
      
      if (age >= pref.ageRange.min && age <= pref.ageRange.max) {
        scorePoints += 30;
      }
    } else {
      scorePoints += 15;
    }

    const finalMatchScore = Math.min(Math.max(scorePoints, 0), 100);

    const religionAndValues = {
      matchLevel: finalMatchScore >= 75 ? "HIGH MATCH" : finalMatchScore >= 50 ? "MEDIUM MATCH" : "POTENTIAL MATCH",
      faith: {
        label: "Faith",
        value: targetUser.religion || "Not specified",
        isMatch: isSameReligion
      },
      vegetarian: {
        label: "Vegetarian",
        value: isVegetarianMatch ? "Yes, Both" : "Varies",
        isMatch: isVegetarianMatch
      }
    };

    const curProfession = currentUser.profession || "Not specified";
    const curQual = currentUser.highestQualification || "Not specified";
    const tarProfession = targetUser.profession || "Not specified";
    const tarQual = targetUser.highestQualification || "Not specified";

    const educationAndCareer = {
      currentUser: {
        name: currentUser.fullName.split(" ")[0],
        value: `${curQual}, ${curProfession}`
      },
      targetUser: {
        name: targetUser.fullName.split(" ")[0],
        value: `${tarQual}, ${tarProfession}`
      },
      insight: "Complementary professional backgrounds with a shared focus on corporate leadership."
    };

    const lifestyleAndHabits = [
      {
        label: "Non-Smoker",
        isMatch: (targetUser.lifestyle?.smoking || "").toLowerCase() === "no",
        iconType: "check"
      },
      {
        label: "Active Lifestyle",
        isMatch: targetUser.lifestyle?.interests?.includes("Gym") || targetUser.lifestyle?.interests?.includes("Sports") || false,
        iconType: "check"
      },
      {
        label: "Global Nomad",
        isMatch: targetUser.citizenship !== "Indian" || false,
        iconType: "neutral"
      }
    ];

    let connectionStatus = "NONE";
    if (currentUser.interestsSent && currentUser.interestsSent.includes(targetUserId)) {
      connectionStatus = "SENT";
    } else if (currentUser.interestsReceived && currentUser.interestsReceived.includes(targetUserId)) {
      connectionStatus = "RECEIVED";
    } else if (currentUser.matches && currentUser.matches.includes(targetUserId)) {
      connectionStatus = "CONNECTED";
    }

    const compatibilityData = {
      matchScore: finalMatchScore,
      compatibilityAnalysis: `You and ${targetUser.fullName.split(" ")[0]} share exceptional alignment in core life values and long-term goals.`,
      currentUser: {
        id: currentUser._id,
        name: currentUser.fullName.split(" ")[0],
        photo: currentUser.photos?.find(p => p.isPrimary)?.url || (currentUser.photos && currentUser.photos[0]?.url) || null
      },
      targetUser: {
        id: targetUser._id,
        name: targetUser.fullName.split(" ")[0],
        photo: targetUser.photos?.find(p => p.isPrimary)?.url || (targetUser.photos && targetUser.photos[0]?.url) || null
      },
      religionAndValues,
      educationAndCareer,
      lifestyleAndHabits,
      connectionStatus
    };

    res.status(200).json({
      success: true,
      data: compatibilityData
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message
    });
  }
};
const User = require("../models/userModel");

const getAdvancedMatches = async (filters, currentUser) => {
  const {
    degrees, profession, minIncome, country, 
    diet, smoking, drinking, gotra, 
    page = 1, limit = 10 
  } = filters;

  const skip = (page - 1) * limit;

  let matchQuery = {
    _id: { $ne: currentUser._id },
    gender: currentUser.gender === "Male" ? "Female" : "Male",
    isActive: true,
    isBlocked: false,
    profileCompleted: true
  };

  const pipeline = [
    { $match: matchQuery },

    {
      $addFields: {
        matchScore: {
          $add: [
            { $cond: [{ $eq: ["$religion", currentUser.religion] }, 30, 0] },
            { $cond: [{ $in: ["$highestQualification", degrees || []] }, 20, 0] },
            { $cond: [{ $in: ["$lifestyle.diet", diet || []] }, 20, 0] },
            { $cond: [{ $gte: ["$incomeValue", minIncome || 0] }, 30, 0] }
          ]
        }
      }
    },

    {
      $match: {
        ...(degrees?.length > 0 && { highestQualification: { $in: degrees } }),
        ...(minIncome && { incomeValue: { $gte: Number(minIncome) } }),
        ...(country && { country: country }),
        ...(diet?.length > 0 && { "lifestyle.diet": { $in: diet } }),
        ...(smoking?.length > 0 && { "lifestyle.smoking": { $in: smoking } }),
        ...(drinking?.length > 0 && { "lifestyle.drinking": { $in: drinking } }),
        ...(profession && { profession: { $regex: profession, $options: "i" } }),
        ...(gotra && { "horoscope.gotra": { $regex: gotra, $options: "i" } })
      }
    },

    { $sort: { matchScore: -1, createdAt: -1 } },

    {
      $facet: {
        metadata: [{ $count: "total" }],
        data: [
          { $skip: skip },
          { $limit: Number(limit) },
          {
            $project: {
              fullName: 1, dob: 1, photos: 1, profession: 1,
              highestQualification: 1, city: 1, matchPercentage: "$matchScore"
            }
          }
        ]
      }
    }
  ];

  const results = await User.aggregate(pipeline);
  
  const data = results[0].data;
  const total = results[0].metadata[0]?.total || 0;

  return { data, total };
};




const getMyMatches = async (currentUser) => {
  const { partnerPreference } = currentUser;

  const today = new Date();
  const minDob = new Date(today.getFullYear() - partnerPreference.ageRange.max - 1, today.getMonth(), today.getDate());
  const maxDob = new Date(today.getFullYear() - partnerPreference.ageRange.min, today.getMonth(), today.getDate());

  let query = {
    _id: { $ne: currentUser._id },
    gender: currentUser.gender === "Male" ? "Female" : "Male",
    isActive: true,
    isBlocked: false,
    profileCompleted: true,
    
    dob: { $gte: minDob, $lte: maxDob },
    religion: { $in: partnerPreference.religion },
    motherTongue: { $in: partnerPreference.motherTongue },
    maritalStatus: { $in: partnerPreference.maritalStatus }
  };

  return await User.find(query)
    .select("fullName photos dob profession highestQualification city religion matchPercentage")
    .limit(20) 
    .sort({ createdAt: -1 });
};


module.exports = {
  getAdvancedMatches,
   getMyMatches
};
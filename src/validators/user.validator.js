const Joi = require("joi");

// Partner Preference
const partnerPreferenceSchema = Joi.object({
  ageRange: Joi.object({
    min: Joi.number(),
    max: Joi.number(),
  }),

  heightRange: Joi.object({
    min: Joi.string(),
    max: Joi.string(),
  }),

  maritalStatus: Joi.array().items(Joi.string()),

  religion: Joi.array().items(Joi.string()),

  motherTongue: Joi.array().items(Joi.string()),
});

// Lifestyle
const lifestyleSchema = Joi.object({
  diet: Joi.string().valid(
    "Veg",
    "Non-Veg",
    "Eggetarian",
    "Vegan"
  ),

  smoking: Joi.string().valid(
    "No",
    "Yes",
    "Occasionally"
  ),

  drinking: Joi.string().valid(
    "No",
    "Yes",
    "Occasionally"
  ),

  interests: Joi.array().items(Joi.string()),
});

// Horoscope
const horoscopeSchema = Joi.object({
  dateOfBirth: Joi.date(),

  timeOfBirth: Joi.string(),

  cityOfBirth: Joi.string(),

  gotra: Joi.string(),

  manglik: Joi.string().valid(
    "Yes",
    "No",
    "Dont Know"
  ),
});

// MAIN USER VALIDATION
const createUserSchema = Joi.object({
  phone: Joi.number().required(),

  email: Joi.string().email().allow("", null),

  password: Joi.string().min(6).allow("", null),


  profileFor: Joi.string().valid(
    "Self",
    "Son",
    "Daughter",
    "Brother",
    "Sister",
    "Friend",
    "Relative"
  ),

  fullName: Joi.string().required(),

  gender: Joi.string().valid(
    "Male",
    "Female",
    "Other"
  ),

  dob: Joi.date(),

  religion: Joi.string(),

  motherTongue: Joi.string(),

  maritalStatus: Joi.string().valid(
    "unMarried",
    "Divorced",
    "Widowed",
    "Awaiting Divorce"
  ),

  highestQualification: Joi.string(),

  college: Joi.string(),

  workingWith: Joi.string().valid(
    "Private",
    "Government",
    "Business",
    "Self Employed"
  ),

  profession: Joi.string(),

  annualIncome: Joi.string(),

  familyStatus: Joi.string().valid(
    "Middle Class",
    "Upper Middle Class",
    "Rich",
    "Affluent"
  ),

  familyType: Joi.string().valid(
    "Joint",
    "Nuclear"
  ),

  familyValues: Joi.string().valid(
    "Traditional",
    "Moderate",
    "Liberal"
  ),

  fatherOccupation: Joi.string(),

  motherOccupation: Joi.string(),

  aboutFamily: Joi.string(),

  partnerPreference: partnerPreferenceSchema,

  lifestyle: lifestyleSchema,

  photos: Joi.array().items(
    Joi.object({
      url: Joi.string(),
      isPrimary: Joi.boolean(),
    })
  ),

  aboutMe: Joi.string(),

  values: Joi.array().items(Joi.string()),

  lifeGoals: Joi.string(),

  hobbies: Joi.array().items(Joi.string()),

  verification: Joi.object({
    identityVerified: Joi.boolean(),
    mobileVerified: Joi.boolean(),
    professionalVerified: Joi.boolean(),
  }),

  horoscope: horoscopeSchema,

  profileCompleted: Joi.boolean(),

  profileCompletionPercentage: Joi.number(),

  isActive: Joi.boolean(),

  isBlocked: Joi.boolean(),

  lastSeen: Joi.date(),
});

module.exports = {
  createUserSchema,
};
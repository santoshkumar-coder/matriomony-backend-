const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    // AUTH
    phone: {
      type: Number,
      required: true,
      unique: true,
    },

    country: {
      type: String,
      default: "India"
    },
    state: String,
    city: String,
    citizenship: {
      type: String,
      default: "Indian"
    },
    email: {
      type: String,
      lowercase: true,
      trim: true,
      unique: true,
    },

    password: {
      type: String,
      select: false,
    },

    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },

    // STEP 1 — BASIC DETAILS
    profileFor: {
      type: String,
      enum: [
        "Self",
        "Son",
        "Daughter",
        "Brother",
        "Sister",
        "Friend",
        "Relative",
      ],
    },

    fullName: {
      type: String,
      required: true,
      trim: true,
    },

    gender: {
      type: String,
      enum: ["Male", "Female", "Other"],
    },

    dob: Date,

    religion: String,

    motherTongue: String,

    maritalStatus: {
      type: String,
      enum: [
        "unMarried",
        "Divorced",
        "Widowed",
        "Awaiting Divorce",
      ],
    },

    // STEP 2 — EDUCATION & CAREER
    highestQualification: String,

    college: String,

    workingWith: {
      type: String,
      enum: [
        "Private",
        "Government",
        "Business",
        "Self Employed",
      ],
    },

    profession: String,

    annualIncome: String,
    incomeValue: {              // Filtering ke liye logic: 2500000
      type: Number,
      index: true
    },

    // STEP 3 — ROOTS & FAMILY
    familyStatus: {
      type: String,
      enum: ["Middle Class", "Upper Middle Class", "Rich", "Affluent"],
    },

    familyType: {
      type: String,
      enum: ["Joint", "Nuclear"],
    },

    familyValues: {
      type: String,
      enum: ["Traditional", "Moderate", "Liberal"],
    },

    fatherOccupation: String,

    motherOccupation: String,

    aboutFamily: String,

    // STEP 4 — PARTNER PREFERENCES
    partnerPreference: {
      ageRange: {
        min: Number,
        max: Number,
      },

      heightRange: {
        min: String,
        max: String,
      },

      maritalStatus: [String],

      religion: [String],

      motherTongue: [String],
    },

    // STEP 5 — LIFESTYLE
    lifestyle: {
      diet: {
        type: String,
        enum: ["Veg", "Non-Veg", "Eggetarian", "Vegan"],
      },

      smoking: {
        type: String,
        enum: ["Never", "Occasionally", "Regularly"],
      },

      drinking: {
        type: String,
        enum: ["Never", "Occasionally", "Regularly"],
      },

      interests: [String],
    },

    // STEP 6 — PHOTOS
    photos: [
      {
        url: String,
        isPrimary: {
          type: Boolean,
          default: false,
        },
      },
    ],

    // STEP 7 — ABOUT
    aboutMe: String,

    values: [String],

    lifeGoals: String,

    hobbies: [String],

    // STEP 8 — VERIFICATION
    verification: {
      identityVerified: {
        type: Boolean,
        default: false,
      },

      mobileVerified: {
        type: Boolean,
        default: false,
      },

      professionalVerified: {
        type: Boolean,
        default: false,
      },
    },

    // STEP 9 — HOROSCOPE
    horoscope: {
      dateOfBirth: Date,

      timeOfBirth: String,

      cityOfBirth: String,

      gotra: String,

      manglik: {
        type: String,
        enum: ["Yes", "No", "Dont Know"],
      },
    },

    // PROFILE STATUS
    profileCompleted: {
      type: Boolean,
      default: false,
    },

    profileCompletionPercentage: {
      type: Number,
      default: 0,
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    isBlocked: {
      type: Boolean,
      default: false,
    },
    isReported: {
      type: Boolean,
      default: false,
    },
    lastSeen: Date,
  },


  {
    timestamps: true,
  }
);





userSchema.index({ religion: 1 });
userSchema.index({ gender: 1 });
userSchema.index({ motherTongue: 1 });

module.exports = mongoose.model("User", userSchema);
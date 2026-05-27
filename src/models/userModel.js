const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
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
    profileFor: {
      type: String,
      // enum: [
      //   "Self",
      //   "Son",
      //   "Daughter",
      //   "Brother",
      //   "Sister",
      //   "Friend",
      //   "Relative",
      // ],
    },
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    gender: {
      type: String,
      // enum: ["Male", "Female", "Other"],
    },
    dob: Date,

    religion: {
      type: String,
      // enum: ["Hindu", "Muslim", "Christian", "Sikh", "Jain", "Buddhist", "Parsi", "Jewish", "Other"],
      default: "Hindu"
    },

    motherTongue: {
      type: String,
      // enum: ["Hindi", "English", "Bengali", "Telugu", "Marathi", "Tamil", "Gujarati", "Urdu", "Kannada", "Odia", "Malayalam", "Punjabi", "Assamese", "Maithili", "Other"],
      default: "Hindi"
    },

    maritalStatus: {
      type: String,
      // enum: [
      //   "unMarried",
      //   "Divorced",
      //   "Widowed",
      //   "Awaiting Divorce",
      // ],
    },

    // STEP 2 — EDUCATION & CAREER
    highestQualification: {
      type: String,
      // enum: ['High school', 'Bachelor', 'Master', 'PHD', 'Other']
    },

    college: String,
    workingWith: {
      type: String,
      // enum: [
      //   "Private",
      //   "Government",
      //   "Business",
      //   "Self Employed",
      // ],
    },

    profession: {
      type: String,
      // enum: [
      //   'Engineer', 'Doctor', 'Teacher', 'Business', 'Artist', 'Other', 'Student'
      // ]
    },

    annualIncome: String,
    incomeValue: {
      type: Number,
      index: true
    },
    familyStatus: {
      type: String,
      // enum: ["Middle Class", "Upper Middle Class", "Rich", "Affluent"],
    },
    familyType: {
      type: String,
      // enum: ["Joint", "Nuclear"],
    },
    familyValues: {
      type: String,
      // enum: ["Traditional", "Moderate", "Liberal"],
    },
    fatherOccupation: String,
    motherOccupation: String,
    aboutFamily: String,
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
    lifestyle: {
      diet: {
        type: String,
        // enum: ["Veg", "Non-Veg", "Eggetarian", "Vegan"],
      },
      smoking: {
        type: String,
        // enum: ["Never", "No", "Occasionally", "Regularly"],
      },
      drinking: {
        type: String,
        // enum: ["Never", "No", "Occasionally", "Regularly"],
      },

      interests: {
        type: [String],
        // enum: ['Cooking', 'Reading', 'Traveling', 'Sports', 'Music', 'Movies', 'Other']
      },
    },
    photos: [
      {
        url: String,
        isPrimary: {
          type: Boolean,
          default: false,
        },
      },
    ],
    aboutMe: String,
    values: [String],
    lifeGoals: String,
    hobbies: [String],
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
    horoscope: {
      dateOfBirth: Date,
      timeOfBirth: String,
      cityOfBirth: String,
      gotra: String,
      manglik: {
        type: String,
        // enum: ["Yes", "No", "Dont Know"],
      },
    },
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
    interestsSent: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    interestsReceived: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    matches: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    rejectedProfiles: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    blockedProfiles: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    subscriptionTier: {
      type: String,
      enum: ['FREE', 'GOLD', 'PREMIUM', 'ELITE'],
      default: 'FREE'
    },
    isReported: {
      type: Boolean,
      default: false,
    },
    moderationStatus: {
      type: String,
      enum: ["Pending", "Approved", "Rejected"],
      default: "Pending",
    },
    reportReason: {
      type: String,
      default: ""
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
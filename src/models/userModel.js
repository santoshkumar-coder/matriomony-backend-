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
      default: "India",
    },
    state: String,
    city: String,
    citizenship: {
      type: String,
      default: "Indian",
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
    },
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    gender: {
      type: String,
    },
    dob: Date,
    religion: {
      type: String,
      default: "Hindu",
    },
    motherTongue: {
      type: String,
      default: "Hindi",
    },
    maritalStatus: {
      type: String,
    },
    highestQualification: {
      type: String,
    },
    college: String,
    workingWith: {
      type: String,
    },
    profession: {
      type: String,
    },
    isHidden: {
      type: Boolean,
      default: false,
    },
    deactivatedUntil: {
      type: Date,
      default: null,
    },
    hiddenUntil: {
      type: Date,
      default: null,
    },
    annualIncome: String,
    incomeValue: {
      type: Number,
      index: true,
    },
    familyStatus: {
      type: String,
    },
    familyType: {
      type: String,
    },
    familyValues: {
      type: String,
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
      },
      smoking: {
        type: String,
      },
      drinking: {
        type: String,
      },
      interests: {
        type: [String],
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
      enum: ["FREE", "GOLD", "PREMIUM", "ELITE"],
      default: "FREE",
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
    sessions: [
      {
        device: String,
        location: String,
        lastActive: {
          type: Date,
          default: Date.now,
        },
        token: String,
      },
    ],
    reportReason: {
      type: String,
      default: "",
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
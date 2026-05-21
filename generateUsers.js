const fs = require('fs');

// Sample data for random generation
const maleNames = ['Rahul', 'Amit', 'Vikram', 'Suresh', 'Rohan', 'Aditya', 'Sanjay', 'Karan', 'Manish', 'Ankit'];
const femaleNames = ['Priya', 'Anjali', 'Sneha', 'Pooja', 'Neha', 'Riya', 'Kavya', 'Shreya', 'Divya', 'Ayesha'];
const emails = ['test', 'user', 'demo', 'sample'];
const religions = ['hindu', 'muslim', 'christian', 'sikh'];
const motherTongues = ['hindi', 'gujarati', 'marathi', 'punjabi'];
const maritalStatuses = ['unMarried', 'divorced', 'widow'];
const qualifications = ['b.tech', 'm.tech', 'mba', 'b.com', 'mca'];
const colleges = ['DAV Public School', 'St. Xavier', 'MIT', 'IIT', 'Delhi University'];
const professions = ['developer', 'engineer', 'teacher', 'doctor', 'manager'];
const annualIncomes = ['3.2lpa', '5lpa', '7lpa', '10lpa', '12lpa'];
const familyTypes = ['Joint', 'Nuclear'];
const familyStatuses = ['Middle Class', 'Upper Middle', 'Rich'];
const interests = ['Travel', 'Music', 'Gym', 'Reading', 'Sports', 'Cooking'];

// Function to generate a random integer between min and max
const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

// Function to pick random element from array
const randomPick = (arr) => arr[Math.floor(Math.random() * arr.length)];

// Generate 50 male and 50 female users
const users = [];

for (let i = 0; i < 100; i++) {
  const gender = i < 50 ? 'Male' : 'Female';
  const fullName = gender === 'Male' ? randomPick(maleNames) : randomPick(femaleNames);
  const email = `${fullName.toLowerCase()}${i}@gmail.com`;

  users.push({
    phone: 900000000 + i,
    email,
    password: 'hello@123',
    role: 'user',
    profileFor: 'Self',
    fullName,
    gender,
    dob: new Date(1995, randomInt(0, 11), randomInt(1, 28)),
    religion: randomPick(religions),
    motherTongue: randomPick(motherTongues),
    maritalStatus: randomPick(maritalStatuses),
    highestQualification: randomPick(qualifications),
    college: randomPick(colleges),
    workingWith: 'Private',
    profession: randomPick(professions),
    annualIncome: randomPick(annualIncomes),
    familyStatus: randomPick(familyStatuses),
    familyType: randomPick(familyTypes),
    familyValues: 'Traditional',
    fatherOccupation: 'Professional',
    motherOccupation: 'Home Maker',
    aboutFamily: 'Happy family',
    partnerPreference: JSON.stringify({
      ageRange: { min: 24, max: 30 },
      heightRange: { min: '5ft 2in', max: '6ft' },
      maritalStatus: ['Never Married'],
      religion: [randomPick(religions)],
      motherTongue: [randomPick(motherTongues)],
    }),
    lifestyle: JSON.stringify({
      diet: 'Veg',
      smoking: 'No',
      drinking: 'Occasionally',
      interests: [randomPick(interests), randomPick(interests)],
    }),
    photos: [
      { url: `https://example.com/photo${i + 1}.jpg`, isPrimary: true },
    ],
    aboutMe: 'Simple and caring person',
    values: [JSON.stringify(['Honesty', 'Respect', 'Family'])],
    lifeGoals: 'Build happy family',
    hobbies: [JSON.stringify([randomPick(interests), randomPick(interests)])],
    verification: {
      identityVerified: false,
      mobileVerified: false,
      professionalVerified: false,
    },
    horoscope: JSON.stringify({
      dateOfBirth: '1998-05-15',
      timeOfBirth: '10:30 AM',
      cityOfBirth: 'Ahmedabad',
      gotra: 'Kashyap',
      manglik: 'No',
    }),
    profileCompleted: false,
    profileCompletionPercentage: 80,
    isActive: true,
    isBlocked: false,
    lastSeen: new Date(),
    createdAt: new Date(),
    updatedAt: new Date(),
  });
}

// Write to a JSON file
fs.writeFileSync('users_bulk.json', JSON.stringify(users, null, 2));

console.log('100 users generated successfully!');
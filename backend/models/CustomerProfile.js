const mongoose = require("mongoose");

const customerProfileSchema = new mongoose.Schema({
  staffVisit: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "StaffVisit",
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  organizationName: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  contactInfo: {
    type: String,
    required: true,
  },
  classification: {
    type: String,
    enum: [
      "Student",
      "Owner of a business",
      "Employee of a business",
      "Government employee",
      "Professional",
      "Overseas Filipino Worker",
      "Not employed",
      "Others",
    ],
    required: true,
  },
  professionalSpecify: String,
  othersSpecify: String,
  isFirstVisit: {
    type: Boolean,
    required: true,
  },
  sex: {
    type: String,
    enum: ["Male", "Female"],
    required: true,
  },
  ageGroup: {
    type: String,
    enum: [
      "15 & below",
      "16-20",
      "21-30",
      "31-40",
      "41-50",
      "51-59",
      "60 & above",
    ],
    required: true,
  },
  isPwd: {
    type: Boolean,
    required: true,
  },
  educationLevel: {
    type: String,
    enum: ["Elementary", "High School", "College", "Masters/ PhD.", "Others"],
    required: true,
  },
  educationOthersSpecify: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("CustomerProfile", customerProfileSchema);

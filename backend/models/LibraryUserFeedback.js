const mongoose = require("mongoose");

const libraryUserFeedbackSchema = new mongoose.Schema({
  customerFeedback: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "CustomerFeedback",
    required: true,
  },
  staffVisit: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "StaffVisit",
    required: true,
  },
  queriesAnswered: {
    type: Boolean,
    required: true,
  }, subjectsOfInterest
 : {
    agriHorticulture: { type: Boolean, default: false },
    aquacultureMarine: { type: Boolean, default: false },
    furniture: { type: Boolean, default: false },
    foodProcessing: { type: Boolean, default: false },
    giftsHousewaresDecors: { type: Boolean, default: false },
    healthAndPharma: { type: Boolean, default: false },
    ict: { type: Boolean, default: false },
    metalsAndEngineering: { type: Boolean, default: false },
    others: { type: Boolean, default: false },
    othersSpecify: { type: String },
  },
  mainReason: {
    type: String,
    enum: ["support_course", "independent_learning", "leisure", "others"],
    required: true,
  },
  mainReasonOthersSpecify: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Add virtual for getting full feedback details
libraryUserFeedbackSchema.virtual("fullFeedback", {
  ref: "CustomerFeedback",
  localField: "customerFeedback",
  foreignField: "_id",
  justOne: true,
});

module.exports = mongoose.model(
  "LibraryUserFeedback",
  libraryUserFeedbackSchema
);
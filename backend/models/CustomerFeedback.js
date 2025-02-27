const mongoose = require("mongoose");

const customerFeedbackSchema = new mongoose.Schema({
  customerProfile: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "CustomerProfile",
    required: true,
  },
  staffVisit: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "StaffVisit",
    required: true,
  },
  satisfaction: {
    speedAndTimeliness: {
      type: Number,
      enum: [1, 2, 3, 4, 5, 6], // 1-Very Satisfied to 5-Very Dissatisfied
      required: true,
    },
    qualityOfService: {
      type: Number, 
      enum: [1, 2, 3, 4, 5,6],
      required: true,
    },
    relevanceOfService: {
      type: Number,
      enum: [1, 2, 3, 4, 5,6],
      required: true,
    },
    staffCompetence: {
      type: Number,
      enum: [1, 2, 3, 4, 5,6],
      required: true,
    },
    staffAttitude: {
      type: Number,
      enum: [1, 2, 3, 4, 5,6],
      required: true,
    },
    overallPerception: {
      type: Number,
      enum: [1, 2, 3, 4, 5,6],
      required: true,
    },
  },
  recommendationScore: {
    type: Number,
    min: 0,
    max: 10,
    required: true,
  },
  suggestions: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

customerFeedbackSchema.virtual("libraryUserFeedback", {
  ref: "LibraryUserFeedback",
  localField: "_id",
  foreignField: "customerFeedback",
  justOne: true
});

module.exports = mongoose.model("CustomerFeedback", customerFeedbackSchema);

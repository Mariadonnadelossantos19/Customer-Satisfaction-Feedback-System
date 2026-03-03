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
    unique: true
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
  // SQD - Service Quality Dimensions (0=N/A, 1=Strongly Disagree, 2=Disagree, 3=Neutral, 4=Agree, 5=Strongly Agree)
  sqd: {
    sqd0: { type: Number, enum: [0, 1, 2, 3, 4, 5] },
    sqd1: { type: Number, enum: [0, 1, 2, 3, 4, 5] },
    sqd2: { type: Number, enum: [0, 1, 2, 3, 4, 5] },
    sqd3: { type: Number, enum: [0, 1, 2, 3, 4, 5] },
    sqd4: { type: Number, enum: [0, 1, 2, 3, 4, 5] },
    sqd5: { type: Number, enum: [0, 1, 2, 3, 4, 5] },
    sqd6: { type: Number, enum: [0, 1, 2, 3, 4, 5] },
    sqd7: { type: Number, enum: [0, 1, 2, 3, 4, 5] },
    sqd8: { type: Number, enum: [0, 1, 2, 3, 4, 5] },
  },
  sqdDisagreeReason: { type: String },
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

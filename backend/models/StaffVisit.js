const mongoose = require("mongoose");

const staffVisitSchema = new mongoose.Schema(
  {
    dateOfVisit: {
      type: Date,
      required: true,
    },
    attendingStaff: {
      type: String,
      required: true,
    },
    serviceInquired: {
      type: String,
    },
    tna: {
      type: Boolean,
      default: false,
    },
    technoTransfer: {
      enabled: { type: Boolean, default: false },
      sectors: {
        foodProcessing: { type: Boolean, default: false },
        metalsAndEngineering: { type: Boolean, default: false },
        giftsHousewaresDecors: { type: Boolean, default: false },
        healthAndPharma: { type: Boolean, default: false },
        agriHorticulture: { type: Boolean, default: false },
        ict: { type: Boolean, default: false },
        aquacultureMarine: { type: Boolean, default: false },
        furniture: { type: Boolean, default: false },
        others: { type: Boolean, default: false },
      },
      othersSpecify: String,
    },
    technoConsultancy: {
      enabled: { type: Boolean, default: false },
      services: {
        mpex: { type: Boolean, default: false },
        cape: { type: Boolean, default: false },
        cpt: { type: Boolean, default: false },
        energyAudit: { type: Boolean, default: false },
        others: { type: Boolean, default: false },
      },
      othersSpecify: String,
    },
    projectProposalPreparation: {
      type: Boolean,
      default: false,
    },
    packagingAndLabeling: {
      type: Boolean,
      default: false,
    },
    technologyTraining: {
      type: Boolean,
      default: false,
    },
    technologyClinics: {
      enabled: { type: Boolean, default: false },
      name: { type: String, default: "Technology Clinics/Forum" },
    },
    scholarship: {
      type: Boolean,
      default: false,
    },
    laboratory: {
      enabled: { type: Boolean, default: false },
      name: { type: String, default: "Laboratory (Metrology/Microbiology)" },
    },
    library: {
      enabled: { type: Boolean, default: false },
      name: { type: String },
    },
    others: {
      enabled: { type: Boolean, default: false },
      specify: String,
    },
    referralSource: {
      type: String,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Add virtual for customerProfile
staffVisitSchema.virtual("customerProfile", {
  ref: "CustomerProfile",
  localField: "_id",
  foreignField: "staffVisit",
  justOne: true,
});

// Add pre-remove middleware to delete associated CustomerProfile
staffVisitSchema.pre("remove", async function (next) {
  await this.model("CustomerProfile").deleteOne({ staffVisit: this._id });
  next();
});

module.exports = mongoose.model("StaffVisit", staffVisitSchema);

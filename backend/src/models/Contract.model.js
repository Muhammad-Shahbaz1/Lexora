const mongoose = require('mongoose');

const riskFlagSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    severity: {
      type: String,
      enum: ['low', 'medium', 'high'],
      default: 'low',
    },
  },
  { _id: false }
);

const keyClauseSchema = new mongoose.Schema(
  {
    clause: { type: String, required: true },
    explanation: { type: String, required: true },
  },
  { _id: false }
);

const analysisSchema = new mongoose.Schema(
  {
    summary: {
      english: { type: String, default: '' },
      romanUrdu: { type: String, default: '' },
    },
    riskFlags: [riskFlagSchema],
    keyClauses: [keyClauseSchema],
    negotiationTips: [{ type: String }],
    disclaimer: { type: String, default: '' },
    overallRiskLevel: {
      type: String,
      enum: ['low', 'medium', 'high', 'unknown'],
      default: 'unknown',
    },
  },
  { _id: false }
);

const contractSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: {
      type: String,
      required: [true, 'Contract title is required'],
      trim: true,
      maxlength: [100, 'Title cannot exceed 100 characters'],
    },
    category: {
      type: String,
      enum: ['rent', 'job', 'business', 'other'],
      default: 'other',
    },
    fileUrl: {
      type: String,
      required: true,
    },
    fileType: {
      type: String,
      enum: ['pdf', 'image'],
      required: true,
    },
    publicId: {
      type: String,
      required: true,
    },
    mimeType: {
      type: String,
      default: '',
    },
    fileSize: {
      type: Number,
      default: 0,
    },
    analysis: {
      type: analysisSchema,
      default: null,
    },
    status: {
      type: String,
      enum: ['pending', 'analyzing', 'done', 'error'],
      default: 'pending',
    },
    errorMessage: {
      type: String,
      default: '',
    },
  },
  { timestamps: true }
);

// Index for fast user-specific queries
contractSchema.index({ userId: 1, createdAt: -1 });

module.exports = mongoose.model('Contract', contractSchema);

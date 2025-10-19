const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const ProblemSchema = new mongoose.Schema({
  problem_id: { type: String, default: () => uuidv4(), index: true, unique: true },
  title: { type: String, required: true },
  difficulty: { type: String, enum: ['easy', 'medium', 'hard'], default: 'easy' },
  tags: [{ type: String }],
  description: { type: String },
  images: [{ type: String }], // store image URLs or base64 refs
  constraints: { type: String },
  acceptanceRate: { type: Number, default: 0 },
  submissionCount: { type: Number, default: 0 },
  createdBy: { type: String }, // admin_id
}, { timestamps: true });

module.exports = mongoose.model('Problem', ProblemSchema);

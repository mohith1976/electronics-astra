const mongoose = require('mongoose');

const TestcaseSchema = new mongoose.Schema({
  problem_id: { type: String, required: true, index: true },
  input: { type: String, required: true },
  output: { type: String, required: true },
  visible: { type: Boolean, default: false },
  createdBy: { type: String }, // admin_id
}, { timestamps: true });

module.exports = mongoose.model('Testcase', TestcaseSchema);

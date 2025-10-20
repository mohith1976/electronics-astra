const Testcase = require('../models/Testcase');
const Problem = require('../models/Problem');

// Add multiple testcases for a problem
exports.addTestcases = async (req, res) => {
  try {
    const problemId = req.params.id;
    // verify problem exists
    const problem = await Problem.findOne({ problem_id: problemId });
    if (!problem) return res.status(404).json({ message: 'Problem not found' });
    const { visible = [], hidden = [] } = req.body;
    const createdBy = req.user && req.user.id;
    const docs = [];
    if (!Array.isArray(visible) || !Array.isArray(hidden)) {
      return res.status(400).json({ message: 'visible and hidden must be arrays' });
    }
    visible.forEach(tc => {
      docs.push({ problem_id: problemId, input: tc.input, output: tc.output, visible: true, createdBy });
    });
    hidden.forEach(tc => {
      docs.push({ problem_id: problemId, input: tc.input, output: tc.output, visible: false, createdBy });
    });
    const inserted = await Testcase.insertMany(docs);
    res.status(201).json({ count: inserted.length, testcases: inserted });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Get all testcases for a problem (admin)
exports.getAll = async (req, res) => {
  try {
    const problemId = req.params.id;
    // verify problem exists
    const problem = await Problem.findOne({ problem_id: problemId });
    if (!problem) return res.status(404).json({ message: 'Problem not found' });
    const testcases = await Testcase.find({ problem_id: problemId }).sort({ createdAt: -1 });
    res.json({ testcases });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Get public (visible) testcases for a problem
exports.getPublic = async (req, res) => {
  try {
    const problemId = req.params.id;
    // verify problem exists
    const problem = await Problem.findOne({ problem_id: problemId });
    if (!problem) return res.status(404).json({ message: 'Problem not found' });
    const testcases = await Testcase.find({ problem_id: problemId, visible: true }).sort({ createdAt: -1 });
    res.json({ testcases });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Get a single testcase by id (admin)
exports.getSingle = async (req, res) => {
  try {
    const { id: problemId, tcid } = req.params;
    // verify problem exists
    const problem = await Problem.findOne({ problem_id: problemId });
    if (!problem) return res.status(404).json({ message: 'Problem not found' });
    const testcase = await Testcase.findOne({ _id: tcid, problem_id: problemId });
    if (!testcase) return res.status(404).json({ message: 'Testcase not found' });
    res.json({ testcase });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Update a single testcase (admin)
exports.updateTestcase = async (req, res) => {
  try {
    const { id: problemId, tcid } = req.params;
    // verify problem exists
    const problem = await Problem.findOne({ problem_id: problemId });
    if (!problem) return res.status(404).json({ message: 'Problem not found' });
    const updates = {};
    const { input, output, visible } = req.body;
    if (input !== undefined) updates.input = input;
    if (output !== undefined) updates.output = output;
    if (visible !== undefined) updates.visible = visible;
    const updated = await Testcase.findOneAndUpdate(
      { _id: tcid, problem_id: problemId },
      { $set: updates },
      { new: true }
    );
    if (!updated) return res.status(404).json({ message: 'Testcase not found' });
    res.json({ testcase: updated });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Delete a single testcase (admin)
exports.deleteTestcase = async (req, res) => {
  try {
    const { id: problemId, tcid } = req.params;
    // verify problem exists
    const problem = await Problem.findOne({ problem_id: problemId });
    if (!problem) return res.status(404).json({ message: 'Problem not found' });
    const result = await Testcase.deleteOne({ _id: tcid, problem_id: problemId });
    if (result.deletedCount === 0) return res.status(404).json({ message: 'Testcase not found' });
    res.json({ message: 'Testcase deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

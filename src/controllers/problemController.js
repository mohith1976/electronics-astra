const Problem = require('../models/Problem');

exports.createProblem = async (req, res) => {
  try {
    const { title, difficulty, tags, description, constraints } = req.body;
    if (!title) return res.status(400).json({ message: 'Title required' });
    const images = [];
    if (req.files && req.files.length) {
      req.files.forEach(f => images.push(`/uploads/${f.filename}`));
    }
    const parsedTags = typeof tags === 'string' ? JSON.parse(tags) : tags;
    const problem = await Problem.create({
      title,
      difficulty,
      tags: parsedTags,
      description,
      images,
      constraints,
      createdBy: req.user && req.user.id,
    });
    res.status(201).json({ problem });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.updateProblem = async (req, res) => {
  try {
    const problem = await Problem.findOne({ problem_id: req.params.id });
    if (!problem) return res.status(404).json({ message: 'Problem not found' });
    const { title, difficulty, tags, description, constraints } = req.body;
    if (title) problem.title = title;
    if (difficulty) problem.difficulty = difficulty;
    if (typeof tags !== 'undefined') problem.tags = (typeof tags === 'string') ? JSON.parse(tags) : tags;
    if (description) problem.description = description;
    if (constraints) problem.constraints = constraints;
    if (req.files && req.files.length) {
      req.files.forEach(f => problem.images.push(`/uploads/${f.filename}`));
    }
    await problem.save();
    res.json({ message: 'Problem updated', problem });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.deleteProblem = async (req, res) => {
  try {
    const problem = await Problem.findOne({ problem_id: req.params.id });
    if (!problem) return res.status(404).json({ message: 'Problem not found' });
    await problem.remove();
    res.json({ message: 'Problem deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.listProblems = async (req, res) => {
  try {
    const problems = await Problem.find().sort({ createdAt: -1 }).limit(100);
    res.json({ problems });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.getProblem = async (req, res) => {
  try {
    const problem = await Problem.findOne({ problem_id: req.params.id });
    if (!problem) return res.status(404).json({ message: 'Problem not found' });
    res.json({ problem });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

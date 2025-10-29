const Problem = require('../models/Problem');
const Testcase = require('../models/Testcase');
const fs = require('fs');
const path = require('path');

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
    // Ensure problem exists
    const problem = await Problem.findOne({ problem_id: req.params.id });
    if (!problem) return res.status(404).json({ message: 'Problem not found' });
    // Delete related testcases
    const tcResult = await Testcase.deleteMany({ problem_id: req.params.id });
    // Attempt to delete files referenced in problem.images
    let deletedFiles = 0;
    let failedFiles = 0;
    if (Array.isArray(problem.images) && problem.images.length) {
      for (const imgPath of problem.images) {
        try {
          // Normalize and resolve local uploads paths like '/uploads/filename' or 'uploads/filename'
          let rel = imgPath;
          if (rel.startsWith('/')) rel = rel.slice(1);
          const absolute = path.resolve(__dirname, '../../', rel);
          if (fs.existsSync(absolute)) {
            fs.unlinkSync(absolute);
            deletedFiles++;
          } else {
            failedFiles++;
          }
        } catch (e) {
          
          failedFiles++;
        }
      }
    }
    // Delete the problem
    await Problem.deleteOne({ problem_id: req.params.id });
    res.json({ message: 'Problem deleted', deletedTestcases: tcResult.deletedCount, deletedFiles, failedFiles });
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

// Delete a single image from a problem.images array and unlink the file
exports.deleteProblemImage = async (req, res) => {
  try {
    const problem = await Problem.findOne({ problem_id: req.params.id });
    if (!problem) return res.status(404).json({ message: 'Problem not found' });
    const { image } = req.body;
    if (!image) return res.status(400).json({ message: 'image field required in body' });
    // find index
    const idx = problem.images.findIndex(p => p === image || p.endsWith(image));
    if (idx === -1) return res.status(404).json({ message: 'Image not found on problem' });
    // remove from array
    const [removed] = problem.images.splice(idx, 1);
    await problem.save();
    // attempt unlink
    try {
      let rel = removed;
      if (rel.startsWith('/')) rel = rel.slice(1);
      const absolute = require('path').resolve(__dirname, '../../', rel);
      if (require('fs').existsSync(absolute)) {
        require('fs').unlinkSync(absolute);
      }
    } catch (e) {
      // don't fail whole request if unlink fails; just log
      console.error('Failed to delete image file', e.message);
    }
    res.json({ message: 'Image removed from problem', removed });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

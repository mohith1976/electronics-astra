const express = require('express');
const router = express.Router();
const problemController = require('../controllers/problemController');
const auth = require('../middlewares/auth');
const upload = require('../middlewares/upload');

// Create problem (admin only) - multipart/form-data, images[]
router.post('/', auth, upload.array('images', 10), problemController.createProblem);
// List problems
router.get('/', problemController.listProblems);
// Get single problem by problem_id
router.get('/:id', problemController.getProblem);
// Update problem (admin only)
router.put('/:id', auth, upload.array('images', 10), problemController.updateProblem);
// Delete problem (admin only)
router.delete('/:id', auth, problemController.deleteProblem);

module.exports = router;

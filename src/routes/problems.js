const express = require('express');
const router = express.Router();
const problemController = require('../controllers/problemController');
const auth = require('../middlewares/auth');
const upload = require('../middlewares/upload');

// Create problem (admin only) - multipart/form-data, images[]
router.post('/', auth, (req, res, next) => {
	const ct = req.headers['content-type'] || '';
	if (ct.includes('multipart/form-data')) {
		// accept any file field names (client may use 'image' or 'file')
		return upload.any()(req, res, next);
	}
	return next();
}, problemController.createProblem);
// List problems
router.get('/', problemController.listProblems);
// Get single problem by problem_id
router.get('/:id', problemController.getProblem);
// Update problem (admin only)
router.put('/:id', auth, (req, res, next) => {
	const ct = req.headers['content-type'] || '';
	if (ct.includes('multipart/form-data')) {
		// accept any file field names on update
		return upload.any()(req, res, next);
	}
	return next();
}, problemController.updateProblem);
// Delete problem (admin only)
router.delete('/:id', auth, problemController.deleteProblem);

module.exports = router;

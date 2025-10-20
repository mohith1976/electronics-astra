const express = require('express');
const router = express.Router({ mergeParams: true });
const testcaseController = require('../controllers/testcaseController');
const auth = require('../middlewares/auth');

// Add testcases (admin only)
router.post('/', auth, testcaseController.addTestcases);
// Get all (admin)
router.get('/', auth, testcaseController.getAll);
// Get public (visible) - no auth
router.get('/public', testcaseController.getPublic);

// Get single testcase (admin)
router.get('/:tcid', auth, testcaseController.getSingle);
// Update testcase (admin)
router.put('/:tcid', auth, testcaseController.updateTestcase);
// Delete testcase (admin)
router.delete('/:tcid', auth, testcaseController.deleteTestcase);

module.exports = router;

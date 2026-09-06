const express = require('express');
const router = express.Router();
const progressController = require('../controllers/progressController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.get('/', progressController.getAllProgress);
router.get('/:vulnerabilityId', progressController.getProgress);
router.post('/:vulnerabilityId/theory', progressController.completeTheory);
router.post('/:vulnerabilityId/lab', progressController.completeLab);
router.post('/:vulnerabilityId/assessment', progressController.submitAssessment);
router.get('/history/:vulnerabilityId', progressController.getAssessmentHistory);

module.exports = router;

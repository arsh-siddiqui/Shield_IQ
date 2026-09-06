const mongoose = require('mongoose');
const LearningProgress = require('../models/LearningProgress');
const AssessmentAttempt = require('../models/AssessmentAttempt');
const Vulnerability = require('../models/Vulnerability');
const User = require('../models/User');

const PASSING_THRESHOLD = 70;

async function getOrCreateProgress(userId, vulnerabilityId) {
  let progress = await LearningProgress.findOne({ user: userId, vulnerability: vulnerabilityId });
  if (!progress) {
    progress = new LearningProgress({ user: userId, vulnerability: vulnerabilityId });
    await progress.save();
  }
  return progress;
}

exports.getAllProgress = async (req, res) => {
  try {
    const progress = await LearningProgress.find({ user: req.user._id }).populate('vulnerability', 'title slug category severity');
    res.json({ success: true, data: progress });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

exports.getProgress = async (req, res) => {
  try {
    const progress = await getOrCreateProgress(req.user._id, req.params.vulnerabilityId);
    res.json({ success: true, data: progress });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

exports.completeTheory = async (req, res) => {
  try {
    const progress = await getOrCreateProgress(req.user._id, req.params.vulnerabilityId);
    let xpAwarded = 0;

    if (!progress.theoryCompleted) {
      progress.theoryCompleted = true;
      if (progress.status === 'not_started') progress.status = 'in_progress';
      
      const user = await User.findById(req.user._id);
      user.xp += 10;
      await user.save();
      xpAwarded = 10;
      await progress.save();
    }

    res.json({ success: true, data: { progress, xpAwarded } });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

exports.completeLab = async (req, res) => {
  try {
    const progress = await getOrCreateProgress(req.user._id, req.params.vulnerabilityId);
    let xpAwarded = 0;

    if (!progress.labCompleted) {
      progress.labCompleted = true;
      if (progress.status === 'not_started') progress.status = 'in_progress';
      
      const user = await User.findById(req.user._id);
      user.xp += 20;
      await user.save();
      xpAwarded = 20;
      await progress.save();
    }

    res.json({ success: true, data: { progress, xpAwarded, message: 'Lab Practice Completed.' } });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

exports.submitAssessment = async (req, res) => {
  try {
    const vulnerabilityId = req.params.vulnerabilityId;
    const { answers } = req.body; // Expects [{ questionId, selectedOptionId }]

    if (!Array.isArray(answers)) {
      return res.status(400).json({ success: false, message: 'Invalid payload format' });
    }

    const vuln = await Vulnerability.findById(vulnerabilityId);
    if (!vuln) {
      return res.status(404).json({ success: false, message: 'Vulnerability not found' });
    }

    // 1. Validate against backend authority
    let correctCount = 0;
    const totalQuestions = vuln.assessment.length;
    
    if (totalQuestions === 0) {
      return res.status(400).json({ success: false, message: 'This vulnerability has no assessment' });
    }

    const processedAnswers = [];

    for (const q of vuln.assessment) {
      const submitted = answers.find(a => a.questionId === q._id.toString());
      let isCorrect = false;
      let selectedOptionId = submitted ? submitted.selectedOptionId : null;

      if (submitted) {
        const correctOpt = q.options.find(o => o.isCorrect);
        if (correctOpt && correctOpt._id.toString() === selectedOptionId) {
          isCorrect = true;
          correctCount++;
        }
      }

      processedAnswers.push({
        questionId: q._id,
        selectedOptionId: selectedOptionId,
        isCorrect
      });
    }

    // 2. Calculate score and determine pass/fail
    const score = Math.round((correctCount / totalQuestions) * 100);
    const passed = score >= PASSING_THRESHOLD;

    // 3. Create AssessmentAttempt
    const attempt = new AssessmentAttempt({
      user: req.user._id,
      vulnerability: vulnerabilityId,
      answers: processedAnswers,
      score,
      passed
    });
    await attempt.save();

    // 4. Update LearningProgress
    const progress = await getOrCreateProgress(req.user._id, vulnerabilityId);
    let xpAwarded = 0;
    
    progress.attempts += 1;
    progress.lastAttempt = new Date();
    
    // Only update best score if it's higher
    if (score > progress.assessmentScore) {
      progress.assessmentScore = score;
    }

    const wasAlreadyCompleted = progress.status === 'completed';

    if (passed && !wasAlreadyCompleted) {
      progress.status = 'completed';
      progress.completedAt = new Date();
      
      const user = await User.findById(req.user._id);
      user.xp += 30;
      await user.save();
      xpAwarded = 30;
    } else if (progress.status === 'not_started') {
      progress.status = 'in_progress';
    }

    await progress.save();

    // 5. Update Learning Profile
    const user = await User.findById(req.user._id);
    const categoryName = vuln.category;
    
    let strengths = new Set(user.learningProfile.strengths);
    let weaknesses = new Set(user.learningProfile.weaknesses);

    if (score < PASSING_THRESHOLD) {
      weaknesses.add(vuln.title);
      strengths.delete(vuln.title);
      user.learningProfile.recommendedFocus = vuln.title;
    } else if (score >= 85) {
      strengths.add(vuln.title);
      weaknesses.delete(vuln.title);
      if (user.learningProfile.recommendedFocus === vuln.title) {
        user.learningProfile.recommendedFocus = 'Advanced Vulnerabilities'; // default fallback
      }
    }

    user.learningProfile.strengths = Array.from(strengths);
    user.learningProfile.weaknesses = Array.from(weaknesses);
    await user.save();

    res.json({ success: true, data: { attempt, progress, xpAwarded, passed, score } });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

exports.getAssessmentHistory = async (req, res) => {
  try {
    const history = await AssessmentAttempt.find({ user: req.user._id, vulnerability: req.params.vulnerabilityId })
                                           .sort({ attemptedAt: -1 });
    res.json({ success: true, data: history });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

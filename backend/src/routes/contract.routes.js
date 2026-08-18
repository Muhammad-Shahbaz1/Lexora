const express = require('express');
const router = express.Router();
const {
  uploadContract,
  getContracts,
  getContract,
  deleteContract,
  reanalyzeContract,
} = require('../controllers/contract.controller');
const { protect } = require('../middleware/auth.middleware');
const { upload } = require('../middleware/upload.middleware');

// All routes are protected
router.use(protect);

router.route('/').get(getContracts);
router.route('/upload').post(upload.single('contract'), uploadContract);
router.route('/:id').get(getContract).delete(deleteContract);
router.route('/:id/reanalyze').post(reanalyzeContract);

module.exports = router;

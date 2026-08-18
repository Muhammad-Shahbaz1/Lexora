const asyncHandler = require('express-async-handler');
const cloudinary = require('../config/cloudinary');
const Contract = require('../models/Contract.model');
const User = require('../models/User.model');
const { analyzeContract } = require('../services/gemini.service');

// @desc    Upload and analyze a new contract
// @route   POST /api/contracts/upload
// @access  Private
const uploadContract = asyncHandler(async (req, res) => {
  if (!req.file) {
    res.status(400);
    throw new Error('No file uploaded. Please upload a PDF or image.');
  }

  const { title, category } = req.body;

  if (!title) {
    res.status(400);
    throw new Error('Contract title is required');
  }

  const isPdf = req.file.mimetype === 'application/pdf';
  const fileType = isPdf ? 'pdf' : 'image';

  // Create contract record with pending status
  const contract = await Contract.create({
    userId: req.user._id,
    title: title.trim(),
    category: category || 'other',
    fileUrl: req.file.path,
    fileType,
    publicId: req.file.filename,
    mimeType: req.file.mimetype,
    fileSize: req.file.size || 0,
    status: 'analyzing',
  });

  // Update user's contract list
  await User.findByIdAndUpdate(req.user._id, {
    $push: { contracts: contract._id },
  });

  // Respond immediately so the client can track status
  res.status(201).json({
    success: true,
    message: 'Contract uploaded. AI analysis in progress...',
    contractId: contract._id,
    status: 'analyzing',
  });

  // Run AI analysis asynchronously (non-blocking)
  (async () => {
    try {
      console.log(`🔍 Starting AI analysis for contract: ${contract._id}`);
      const analysis = await analyzeContract(
        contract.fileUrl,
        contract.mimeType,
        contract.category
      );

      await Contract.findByIdAndUpdate(contract._id, {
        analysis,
        status: 'done',
      });

      // Increment user's total analyses count
      await User.findByIdAndUpdate(req.user._id, {
        $inc: { totalAnalyses: 1 },
      });

      console.log(`✅ Analysis saved for contract: ${contract._id}`);
    } catch (error) {
      console.error(`❌ Analysis failed for contract ${contract._id}: ${error.message}`);
      await Contract.findByIdAndUpdate(contract._id, {
        status: 'error',
        errorMessage: error.message,
      });
    }
  })();
});

// @desc    Get all contracts for logged-in user
// @route   GET /api/contracts
// @access  Private
const getContracts = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;
  const { category, status } = req.query;

  const filter = { userId: req.user._id };
  if (category) filter.category = category;
  if (status) filter.status = status;

  const total = await Contract.countDocuments(filter);
  const contracts = await Contract.find(filter)
    .select('-analysis') // Exclude heavy analysis field from list
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  res.status(200).json({
    success: true,
    data: contracts,
    pagination: {
      total,
      page,
      pages: Math.ceil(total / limit),
      limit,
    },
  });
});

// @desc    Get a single contract with full analysis
// @route   GET /api/contracts/:id
// @access  Private
const getContract = asyncHandler(async (req, res) => {
  const contract = await Contract.findOne({
    _id: req.params.id,
    userId: req.user._id,
  });

  if (!contract) {
    res.status(404);
    throw new Error('Contract not found');
  }

  res.status(200).json({
    success: true,
    data: contract,
  });
});

// @desc    Delete a contract and its Cloudinary file
// @route   DELETE /api/contracts/:id
// @access  Private
const deleteContract = asyncHandler(async (req, res) => {
  const contract = await Contract.findOne({
    _id: req.params.id,
    userId: req.user._id,
  });

  if (!contract) {
    res.status(404);
    throw new Error('Contract not found');
  }

  // Delete from Cloudinary
  try {
    const resourceType = contract.fileType === 'pdf' ? 'raw' : 'image';
    await cloudinary.uploader.destroy(contract.publicId, {
      resource_type: resourceType,
    });
  } catch (err) {
    console.warn('⚠️ Cloudinary deletion failed:', err.message);
  }

  // Remove from DB
  await contract.deleteOne();
  await User.findByIdAndUpdate(req.user._id, {
    $pull: { contracts: contract._id },
  });

  res.status(200).json({
    success: true,
    message: 'Contract deleted successfully',
  });
});

// @desc    Re-analyze an existing contract
// @route   POST /api/contracts/:id/reanalyze
// @access  Private
const reanalyzeContract = asyncHandler(async (req, res) => {
  const contract = await Contract.findOne({
    _id: req.params.id,
    userId: req.user._id,
  });

  if (!contract) {
    res.status(404);
    throw new Error('Contract not found');
  }

  if (contract.status === 'analyzing') {
    res.status(400);
    throw new Error('Contract is currently being analyzed. Please wait.');
  }

  await Contract.findByIdAndUpdate(contract._id, {
    status: 'analyzing',
    analysis: null,
    errorMessage: '',
  });

  res.status(200).json({
    success: true,
    message: 'Re-analysis started',
    contractId: contract._id,
    status: 'analyzing',
  });

  // Run AI analysis asynchronously
  (async () => {
    try {
      const analysis = await analyzeContract(
        contract.fileUrl,
        contract.mimeType,
        contract.category
      );
      await Contract.findByIdAndUpdate(contract._id, {
        analysis,
        status: 'done',
      });
    } catch (error) {
      await Contract.findByIdAndUpdate(contract._id, {
        status: 'error',
        errorMessage: error.message,
      });
    }
  })();
});

module.exports = {
  uploadContract,
  getContracts,
  getContract,
  deleteContract,
  reanalyzeContract,
};

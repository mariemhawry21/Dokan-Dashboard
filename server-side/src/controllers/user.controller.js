const User = require("../models/user.model");
const asyncWrapper = require("../middlewares/asyncWrapper.middleware");
const AppError = require("../utils/appError");
const httpStatusText = require("../utils/httpStatusText");
const cloudinary = require("cloudinary").v2;
const { body } = require("express-validator");

// Helper function for pagination
const paginate = async (model, query, options) => {
  const page = parseInt(options.page) || 1;
  const limit = parseInt(options.limit) || 10;
  const skip = (page - 1) * limit;

  const data = await model
    .find(query)
    .skip(skip)
    .limit(limit)
    .sort(options.sort);

  const total = await model.countDocuments(query);

  return {
    data,
    total,
    page,
    totalPages: Math.ceil(total / limit),
  };
};

// @desc    Create new user
// @route   POST /api/users
// @access  Public
const createUser = asyncWrapper(async (req, res, next) => {
  const { firstName, lastName, email, mobile } = req.body;

  if (!firstName || !lastName || !email) {
    return next(
      new AppError(
        "First name, last name and email are required",
        400,
        httpStatusText.FAIL
      )
    );
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return next(new AppError("Email already in use", 400, httpStatusText.FAIL));
  }

  const newUser = await User.create({
    firstName,
    lastName,
    email,
    mobile,
    ...req.body,
  });

  res.status(201).json({
    status: httpStatusText.SUCCESS,
    data: { user: newUser },
  });
});

// @desc    Get all users
// @route   GET /api/users
// @access  Public
const getAllUsers = asyncWrapper(async (req, res, next) => {
  const { page = 1, limit = 10, search, isActive, role } = req.query;

  const query = {};
  if (search) {
    query.$or = [
      { firstName: { $regex: search, $options: "i" } },
      { lastName: { $regex: search, $options: "i" } },
      { email: { $regex: search, $options: "i" } },
    ];
  }

  if (isActive === "true") query.isActive = true;
  if (isActive === "false") query.isActive = false;
  if (role) query.role = role;

  const {
    data: users,
    total,
    page: currentPage,
    totalPages,
  } = await paginate(User, query, { page, limit, sort: { createdAt: -1 } });

  res.status(200).json({
    status: httpStatusText.SUCCESS,
    results: users.length,
    total,
    currentPage,
    totalPages,
    data: { users },
  });
});

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = asyncWrapper(async (req, res, next) => {
  const user = await User.findById(req.user.id);
  if (!user) {
    return next(new AppError("User not found", 404, httpStatusText.NOT_FOUND));
  }

  res.status(200).json({
    status: httpStatusText.SUCCESS,
    data: { user },
  });
});

// @desc    Update user profile
// @route   PATCH /api/users/profile
// @access  Private
const updateUserProfile = asyncWrapper(async (req, res, next) => {
  const updates = {};
  const allowedFields = [
    "firstName",
    "lastName",
    "mobile",
    "addresses",
    "birthDate",
    "gender",
    "communicationPreferences",
  ];

  allowedFields.forEach((field) => {
    if (req.body[field] !== undefined) {
      updates[field] = req.body[field];
    }
  });

  const user = await User.findByIdAndUpdate(req.user.id, updates, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    status: httpStatusText.SUCCESS,
    data: { user },
  });
});

// @desc    Update user avatar
// @route   PATCH /api/users/profile/avatar
// @access  Private
const updateAvatar = asyncWrapper(async (req, res, next) => {
  if (!req.file) {
    return next(
      new AppError("Please upload an image", 400, httpStatusText.FAIL)
    );
  }

  const result = await cloudinary.uploader.upload(req.file.path, {
    folder: "user-avatars",
    width: 150,
    height: 150,
    crop: "fill",
  });

  const user = await User.findByIdAndUpdate(
    req.user.id,
    { avatar: result.secure_url },
    { new: true }
  );

  res.status(200).json({
    status: httpStatusText.SUCCESS,
    data: { avatar: user.avatar },
  });
});

// @desc    Change password
// @route   PATCH /api/users/profile/password
// @access  Private
const changePassword = asyncWrapper(async (req, res, next) => {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    return next(
      new AppError(
        "Current and new password are required",
        400,
        httpStatusText.FAIL
      )
    );
  }

  const user = await User.findById(req.user.id).select("+password");
  if (!user) {
    return next(new AppError("User not found", 404, httpStatusText.NOT_FOUND));
  }

  const isMatch = await user.comparePassword(currentPassword);
  if (!isMatch) {
    return next(
      new AppError("Current password is incorrect", 401, httpStatusText.FAIL)
    );
  }

  user.password = newPassword;
  await user.save();

  res.status(200).json({
    status: httpStatusText.SUCCESS,
    message: "Password changed successfully",
  });
});

// @desc    Get user by ID
// @route   GET /api/users/:id
// @access  Private (Admin/SuperAdmin)
const getUserById = asyncWrapper(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    return next(new AppError("User not found", 404, httpStatusText.NOT_FOUND));
  }

  res.status(200).json({
    status: httpStatusText.SUCCESS,
    data: { user },
  });
});

// @desc    Update user
// @route   PATCH /api/users/:id
// @access  Private (Admin/SuperAdmin)
const updateUser = asyncWrapper(async (req, res, next) => {
  const updates = {};
  const allowedFields = [
    "firstName",
    "lastName",
    "email",
    "mobile",
    "role",
    "isActive",
    "isHotUser",
    "creditLimit",
  ];

  allowedFields.forEach((field) => {
    if (req.body[field] !== undefined) {
      updates[field] = req.body[field];
    }
  });

  if (updates.email) {
    const existingUser = await User.findOne({
      email: updates.email,
      _id: { $ne: req.params.id },
    });
    if (existingUser) {
      return next(
        new AppError("Email already in use", 400, httpStatusText.FAIL)
      );
    }
  }

  const user = await User.findByIdAndUpdate(req.params.id, updates, {
    new: true,
    runValidators: true,
  });

  if (!user) {
    return next(new AppError("User not found", 404, httpStatusText.NOT_FOUND));
  }

  res.status(200).json({
    status: httpStatusText.SUCCESS,
    data: { user },
  });
});

// @desc    Delete user (soft delete)
// @route   DELETE /api/users/:id
// @access  Private (SuperAdmin)
const deleteUser = asyncWrapper(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(
    req.params.id,
    {
      isActive: false,
      deletedAt: Date.now(),
      deletedBy: req.user.id,
    },
    { new: true }
  );

  if (!user) {
    return next(new AppError("User not found", 404, httpStatusText.NOT_FOUND));
  }

  res.status(200).json({
    status: httpStatusText.SUCCESS,
    message: "User deactivated successfully",
  });
});

// @desc    Restore user
// @route   POST /api/users/:id/restore
// @access  Private (SuperAdmin)
const restoreUser = asyncWrapper(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(
    req.params.id,
    {
      isActive: true,
      deletedAt: null,
      deletedBy: null,
    },
    { new: true }
  );

  if (!user) {
    return next(new AppError("User not found", 404, httpStatusText.NOT_FOUND));
  }

  res.status(200).json({
    status: httpStatusText.SUCCESS,
    data: { user },
  });
});

// @desc    Add activity
// @route   POST /api/users/:id/activities
// @access  Private (Admin/SuperAdmin)
const addActivity = asyncWrapper(async (req, res, next) => {
  const { activityType, description } = req.body;

  if (!activityType || !description) {
    return next(
      new AppError(
        "Activity type and description are required",
        400,
        httpStatusText.FAIL
      )
    );
  }

  const activity = {
    activityType,
    description,
    createdBy: req.user.id,
    ipAddress: req.ip,
    deviceInfo: req.headers["user-agent"],
  };

  const user = await User.findByIdAndUpdate(
    req.params.id,
    { $push: { activityLog: activity } },
    { new: true }
  );

  res.status(201).json({
    status: httpStatusText.SUCCESS,
    data: { activity: user.activityLog.slice(-1)[0] },
  });
});

// @desc    Get activities
// @route   GET /api/users/:id/activities
// @access  Private (Admin/SuperAdmin)
const getActivities = asyncWrapper(async (req, res, next) => {
  const { type, page = 1, limit = 10 } = req.query;

  const user = await User.findById(req.params.id);
  if (!user) {
    return next(new AppError("User not found", 404, httpStatusText.NOT_FOUND));
  }

  let activities = user.activityLog;
  if (type) {
    activities = activities.filter(
      (activity) => activity.activityType === type
    );
  }

  // Apply pagination
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const paginatedActivities = activities.slice(startIndex, endIndex);

  res.status(200).json({
    status: httpStatusText.SUCCESS,
    results: paginatedActivities.length,
    total: activities.length,
    currentPage: parseInt(page),
    totalPages: Math.ceil(activities.length / limit),
    data: { activities: paginatedActivities },
  });
});
// @desc    Create support ticket
// @route   POST /api/users/:id/tickets
// @access  Private (Admin/SuperAdmin/Support)
const createTicket = asyncWrapper(async (req, res, next) => {
  const { title, issueType, description, priority } = req.body;

  if (!title || !issueType || !description) {
    return next(
      new AppError(
        "Title, issue type and description are required",
        400,
        httpStatusText.FAIL
      )
    );
  }

  const ticket = {
    ticketId: `TKT-${Date.now().toString().slice(-6)}`,
    title,
    issueType,
    description,
    priority: priority || "medium",
    createdBy: req.user.id,
  };

  const user = await User.findByIdAndUpdate(
    req.params.id,
    { $push: { supportTickets: ticket } },
    { new: true }
  );

  res.status(201).json({
    status: httpStatusText.SUCCESS,
    data: { ticket: user.supportTickets.slice(-1)[0] },
  });
});

// @desc    Get support tickets
// @route   GET /api/users/:id/tickets
// @access  Private (Admin/SuperAdmin/Support)
const getTickets = asyncWrapper(async (req, res, next) => {
  const { status, priority, page = 1, limit = 10 } = req.query;

  const user = await User.findById(req.params.id);
  if (!user) {
    return next(new AppError("User not found", 404, httpStatusText.NOT_FOUND));
  }

  let tickets = user.supportTickets;
  if (status) tickets = tickets.filter((ticket) => ticket.status === status);
  if (priority)
    tickets = tickets.filter((ticket) => ticket.priority === priority);

  // Apply pagination
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const paginatedTickets = tickets.slice(startIndex, endIndex);

  res.status(200).json({
    status: httpStatusText.SUCCESS,
    results: paginatedTickets.length,
    total: tickets.length,
    currentPage: parseInt(page),
    totalPages: Math.ceil(tickets.length / limit),
    data: { tickets: paginatedTickets },
  });
});

// @desc    Update ticket status
// @route   PATCH /api/users/:id/tickets/:ticketId
// @access  Private (Admin/SuperAdmin/Support)
const updateTicket = asyncWrapper(async (req, res, next) => {
  const { status, satisfaction } = req.body;

  if (!status) {
    return next(new AppError("Status is required", 400, httpStatusText.FAIL));
  }

  const update = {
    "supportTickets.$.status": status,
    "supportTickets.$.updatedAt": Date.now(),
  };

  if (status === "resolved") {
    update["supportTickets.$.resolvedAt"] = Date.now();
    if (satisfaction) {
      update["supportTickets.$.customerSatisfaction"] = satisfaction;
    }
  }

  const user = await User.findOneAndUpdate(
    {
      _id: req.params.id,
      "supportTickets._id": req.params.ticketId,
    },
    { $set: update },
    { new: true }
  );

  if (!user) {
    return next(
      new AppError("User or ticket not found", 404, httpStatusText.NOT_FOUND)
    );
  }

  const updatedTicket = user.supportTickets.find(
    (t) => t._id.toString() === req.params.ticketId
  );

  res.status(200).json({
    status: httpStatusText.SUCCESS,
    data: { ticket: updatedTicket },
  });
});

// @desc    Add credit transaction
// @route   POST /api/users/:id/credit
// @access  Private (SuperAdmin/Accountant)
const addCredit = asyncWrapper(async (req, res, next) => {
  const { amount, type, description, reference } = req.body;

  if (!amount || !type || !description) {
    return next(
      new AppError(
        "Amount, type and description are required",
        400,
        httpStatusText.FAIL
      )
    );
  }

  const transaction = {
    transactionId: `TRX-${Date.now().toString().slice(-6)}`,
    amount,
    type,
    description,
    reference: reference || "",
    processedBy: req.user.id,
  };

  const update = {
    $push: { creditHistory: transaction },
  };

  if (type === "credit") {
    update.$inc = { currentCredit: amount };
  } else if (type === "debit") {
    update.$inc = { currentCredit: -amount };
  } else {
    return next(
      new AppError(
        "Type must be either credit or debit",
        400,
        httpStatusText.FAIL
      )
    );
  }

  const user = await User.findByIdAndUpdate(req.params.id, update, {
    new: true,
  });

  res.status(201).json({
    status: httpStatusText.SUCCESS,
    data: {
      transaction,
      currentCredit: user.currentCredit,
    },
  });
});

// @desc    Get credit history
// @route   GET /api/users/:id/credit
// @access  Private (Admin/SuperAdmin/Accountant)
const getCreditHistory = asyncWrapper(async (req, res, next) => {
  const { type, page = 1, limit = 10 } = req.query;

  const user = await User.findById(req.params.id);
  if (!user) {
    return next(new AppError("User not found", 404, httpStatusText.NOT_FOUND));
  }

  let transactions = user.creditHistory;
  if (type) {
    transactions = transactions.filter((t) => t.type === type);
  }

  // Apply pagination
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const paginatedTransactions = transactions.slice(startIndex, endIndex);

  res.status(200).json({
    status: httpStatusText.SUCCESS,
    results: paginatedTransactions.length,
    total: transactions.length,
    currentPage: parseInt(page),
    totalPages: Math.ceil(transactions.length / limit),
    data: {
      currentCredit: user.currentCredit,
      creditLimit: user.creditLimit,
      transactions: paginatedTransactions,
    },
  });
});

// @desc    Add special case
// @route   POST /api/users/:id/special-cases
// @access  Private (Admin/SuperAdmin)
const addSpecialCase = asyncWrapper(async (req, res, next) => {
  const { caseType, description, severity } = req.body;

  if (!caseType || !description) {
    return next(
      new AppError(
        "Case type and description are required",
        400,
        httpStatusText.FAIL
      )
    );
  }

  const specialCase = {
    caseType,
    description,
    severity: severity || "medium",
    addedBy: req.user.id,
  };

  const user = await User.findByIdAndUpdate(
    req.params.id,
    { $push: { specialCases: specialCase } },
    { new: true }
  );

  res.status(201).json({
    status: httpStatusText.SUCCESS,
    data: { specialCase: user.specialCases.slice(-1)[0] },
  });
});

// @desc    Get special cases
// @route   GET /api/users/:id/special-cases
// @access  Private (Admin/SuperAdmin)
const getSpecialCases = asyncWrapper(async (req, res, next) => {
  const { active, severity, page = 1, limit = 10 } = req.query;

  const user = await User.findById(req.params.id);
  if (!user) {
    return next(new AppError("User not found", 404, httpStatusText.NOT_FOUND));
  }

  let cases = user.specialCases;
  if (active === "true") cases = cases.filter((c) => c.isActive);
  if (active === "false") cases = cases.filter((c) => !c.isActive);
  if (severity) cases = cases.filter((c) => c.severity === severity);

  // Apply pagination
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const paginatedCases = cases.slice(startIndex, endIndex);

  res.status(200).json({
    status: httpStatusText.SUCCESS,
    results: paginatedCases.length,
    total: cases.length,
    currentPage: parseInt(page),
    totalPages: Math.ceil(cases.length / limit),
    data: { specialCases: paginatedCases },
  });
});

// @desc    Add review
// @route   POST /api/users/:id/reviews
// @access  Private
const addReview = asyncWrapper(async (req, res, next) => {
  const { productId, rating, reviewText } = req.body;

  if (!productId || !rating || !reviewText) {
    return next(
      new AppError(
        "Product ID, rating and review text are required",
        400,
        httpStatusText.FAIL
      )
    );
  }

  const review = {
    productId,
    rating,
    reviewText,
    photos: req.body.photos || [],
  };

  const user = await User.findByIdAndUpdate(
    req.params.id,
    { $push: { reviews: review } },
    { new: true }
  );

  res.status(201).json({
    status: httpStatusText.SUCCESS,
    data: { review: user.reviews.slice(-1)[0] },
  });
});

// @desc    Get reviews
// @route   GET /api/users/:id/reviews
// @access  Public
const getReviews = asyncWrapper(async (req, res, next) => {
  const { rating, page = 1, limit = 10 } = req.query;

  const user = await User.findById(req.params.id);
  if (!user) {
    return next(new AppError("User not found", 404, httpStatusText.NOT_FOUND));
  }

  let reviews = user.reviews;
  if (rating) reviews = reviews.filter((r) => r.rating === parseInt(rating));

  // Apply pagination
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const paginatedReviews = reviews.slice(startIndex, endIndex);

  res.status(200).json({
    status: httpStatusText.SUCCESS,
    results: paginatedReviews.length,
    total: reviews.length,
    currentPage: parseInt(page),
    totalPages: Math.ceil(reviews.length / limit),
    data: { reviews: paginatedReviews },
  });
});

// @desc    Add incentive
// @route   POST /api/users/:id/incentives
// @access  Private (Admin/SuperAdmin)
const addIncentive = asyncWrapper(async (req, res, next) => {
  const { incentiveType, amount, description, expiryDate } = req.body;

  if (!incentiveType || !amount || !description) {
    return next(
      new AppError(
        "Incentive type, amount and description are required",
        400,
        httpStatusText.FAIL
      )
    );
  }

  const incentive = {
    incentiveType,
    amount,
    description,
    expiryDate: expiryDate || null,
    addedBy: req.user.id,
  };

  const user = await User.findByIdAndUpdate(
    req.params.id,
    { $push: { incentives: incentive } },
    { new: true }
  );

  res.status(201).json({
    status: httpStatusText.SUCCESS,
    data: { incentive: user.incentives.slice(-1)[0] },
  });
});

// @desc    Get incentives
// @route   GET /api/users/:id/incentives
// @access  Private (Admin/SuperAdmin)
const getIncentives = asyncWrapper(async (req, res, next) => {
  const { type, isUsed, page = 1, limit = 10 } = req.query;

  const user = await User.findById(req.params.id);
  if (!user) {
    return next(new AppError("User not found", 404, httpStatusText.NOT_FOUND));
  }

  let incentives = user.incentives;
  if (type) incentives = incentives.filter((i) => i.incentiveType === type);
  if (isUsed === "true") incentives = incentives.filter((i) => i.isUsed);
  if (isUsed === "false") incentives = incentives.filter((i) => !i.isUsed);

  // Apply pagination
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const paginatedIncentives = incentives.slice(startIndex, endIndex);

  res.status(200).json({
    status: httpStatusText.SUCCESS,
    results: paginatedIncentives.length,
    total: incentives.length,
    currentPage: parseInt(page),
    totalPages: Math.ceil(incentives.length / limit),
    data: { incentives: paginatedIncentives },
  });
});

// @desc    Assign tags to user
// @route   POST /api/users/:id/tags
// @access  Private (Admin/SuperAdmin)
const assignUserTags = asyncWrapper(async (req, res, next) => {
  const { tags } = req.body;

  if (!tags || !Array.isArray(tags)) {
    return next(new AppError('Please provide an array of tags', 400, httpStatusText.FAIL));
  }

  const user = await User.findByIdAndUpdate(
    req.params.id,
    { $addToSet: { tags: { $each: tags } } },
    { new: true, runValidators: true }
  );

  if (!user) {
    return next(new AppError('User not found', 404, httpStatusText.NOT_FOUND));
  }

  res.status(200).json({
    status: httpStatusText.SUCCESS,
    data: { tags: user.tags }
  });
});

// @desc    Remove tags from user
// @route   DELETE /api/users/:id/tags
// @access  Private (Admin/SuperAdmin)
const removeUserTags = asyncWrapper(async (req, res, next) => {
  const { tags } = req.body;

  if (!tags || !Array.isArray(tags)) {
    return next(new AppError('Please provide an array of tags to remove', 400, httpStatusText.FAIL));
  }

  const user = await User.findByIdAndUpdate(
    req.params.id,
    { $pull: { tags: { $in: tags } } },
    { new: true }
  );

  if (!user) {
    return next(new AppError('User not found', 404, httpStatusText.NOT_FOUND));
  }

  res.status(200).json({
    status: httpStatusText.SUCCESS,
    data: { tags: user.tags }
  });
});

// @desc    Assign segment to user
// @route   POST /api/users/:id/segments
// @access  Private (Admin/SuperAdmin)
const assignSegment = asyncWrapper(async (req, res, next) => {
  const { segmentName, expiresAt } = req.body;

  if (!segmentName) {
    return next(new AppError('Segment name is required', 400, httpStatusText.FAIL));
  }

  const segmentData = {
    name: segmentName,
    assignedBy: req.user.id
  };

  if (expiresAt) {
    segmentData.expiresAt = new Date(expiresAt);
  }

  const user = await User.findByIdAndUpdate(
    req.params.id,
    { $addToSet: { segments: segmentData } },
    { new: true }
  );

  if (!user) {
    return next(new AppError('User not found', 404, httpStatusText.NOT_FOUND));
  }

  res.status(200).json({
    status: httpStatusText.SUCCESS,
    data: { segments: user.segments }
  });
});

// @desc    Remove segment from user
// @route   DELETE /api/users/:id/segments/:segmentName
// @access  Private (Admin/SuperAdmin)
const removeSegment = asyncWrapper(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(
    req.params.id,
    { $pull: { segments: { name: req.params.segmentName } } },
    { new: true }
  );

  if (!user) {
    return next(new AppError('User not found', 404, httpStatusText.NOT_FOUND));
  }

  res.status(200).json({
    status: httpStatusText.SUCCESS,
    data: { segments: user.segments }
  });
});

// @desc    Get users by tag
// @route   GET /api/users/by-tag/:tag
// @access  Private (Admin/SuperAdmin)
const getUsersByTag = asyncWrapper(async (req, res, next) => {
  const { page = 1, limit = 10 } = req.query;

  const {
    data: users,
    total,
    page: currentPage,
    totalPages,
  } = await paginate(User, { tags: req.params.tag }, { page, limit });

  res.status(200).json({
    status: httpStatusText.SUCCESS,
    results: users.length,
    total,
    currentPage,
    totalPages,
    data: { users }
  });
});

// @desc    Get users by segment
// @route   GET /api/users/by-segment/:segment
// @access  Private (Admin/SuperAdmin)
const getUsersBySegment = asyncWrapper(async (req, res, next) => {
  const { page = 1, limit = 10 } = req.query;

  const {
    data: users,
    total,
    page: currentPage,
    totalPages,
  } = await paginate(User, { 'segments.name': req.params.segment }, { page, limit });

  res.status(200).json({
    status: httpStatusText.SUCCESS,
    results: users.length,
    total,
    currentPage,
    totalPages,
    data: { users }
  });
});

// @desc    Update customer tier
// @route   PATCH /api/users/:id/tier
// @access  Private (Admin/SuperAdmin)
const updateCustomerTier = asyncWrapper(async (req, res, next) => {
  const { tier } = req.body;

  if (!['basic', 'silver', 'gold', 'platinum'].includes(tier)) {
    return next(new AppError('Invalid tier value', 400, httpStatusText.FAIL));
  }

  const user = await User.findByIdAndUpdate(
    req.params.id,
    { customerTier: tier },
    { new: true, runValidators: true }
  );

  if (!user) {
    return next(new AppError('User not found', 404, httpStatusText.NOT_FOUND));
  }

  res.status(200).json({
    status: httpStatusText.SUCCESS,
    data: { customerTier: user.customerTier }
  });
});


// Add these methods to your user.controller.js

// @desc    Get pending users
// @route   GET /api/users/pending
// @access  Private (Admin/SuperAdmin)
const getPendingUsers = asyncWrapper(async (req, res, next) => {
  const { page = 1, limit = 10 } = req.query;

  const {
    data: users,
    total,
    page: currentPage,
    totalPages,
  } = await paginate(User, { status: 'pending' }, { page, limit });

  res.status(200).json({
    status: httpStatusText.SUCCESS,
    results: users.length,
    total,
    currentPage,
    totalPages,
    data: { users },
  });
});

// @desc    Get approved users
// @route   GET /api/users/approved
// @access  Private (Admin/SuperAdmin)
const getApprovedUsers = asyncWrapper(async (req, res, next) => {
  const { page = 1, limit = 10 } = req.query;

  const {
    data: users,
    total,
    page: currentPage,
    totalPages,
  } = await paginate(User, { status: 'approved' }, { page, limit });

  res.status(200).json({
    status: httpStatusText.SUCCESS,
    results: users.length,
    total,
    currentPage,
    totalPages,
    data: { users },
  });
});

// @desc    Get denied users
// @route   GET /api/users/denied
// @access  Private (Admin/SuperAdmin)
const getDeniedUsers = asyncWrapper(async (req, res, next) => {
  const { page = 1, limit = 10 } = req.query;

  const {
    data: users,
    total,
    page: currentPage,
    totalPages,
  } = await paginate(User, { status: 'denied' }, { page, limit });

  res.status(200).json({
    status: httpStatusText.SUCCESS,
    results: users.length,
    total,
    currentPage,
    totalPages,
    data: { users },
  });
});

// @desc    Approve a user
// @route   PATCH /api/users/:id/approve
// @access  Private (Admin/SuperAdmin)
const approveUser = asyncWrapper(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(
    req.params.id,
    { 
      status: 'approved',
      adminRequest: false 
    },
    { new: true, runValidators: true }
  ).select('-password -__v');

  if (!user) {
    return next(new AppError('User not found', 404, httpStatusText.NOT_FOUND));
  }

  // Send approval email
  await sendEmail({
    email: user.email,
    subject: 'Your Account Has Been Approved',
    template: 'account-approved',
    context: { name: user.firstName }
  });

  res.status(200).json({
    status: httpStatusText.SUCCESS,
    data: { user },
  });
});

// @desc    Deny a user
// @route   PATCH /api/users/:id/deny
// @access  Private (Admin/SuperAdmin)
const denyUser = asyncWrapper(async (req, res, next) => {
  const { reason } = req.body;
  
  if (!reason) {
    return next(new AppError('Denial reason is required', 400, httpStatusText.FAIL));
  }

  const user = await User.findByIdAndUpdate(
    req.params.id,
    { 
      status: 'denied',
      adminRequest: false,
      denialReason: reason 
    },
    { new: true }
  ).select('-password -__v');

  if (!user) {
    return next(new AppError('User not found', 404, httpStatusText.NOT_FOUND));
  }

  // Send denial email
  await sendEmail({
    email: user.email,
    subject: 'Your Account Request Has Been Denied',
    template: 'account-denied',
    context: { 
      name: user.firstName,
      reason 
    }
  });

  res.status(200).json({
    status: httpStatusText.SUCCESS,
    data: { user },
  });
});

// @desc    Handle admin request
// @route   PATCH /api/users/:id/request-admin
// @access  Private (Admin/SuperAdmin)
const handleAdminRequest = asyncWrapper(async (req, res, next) => {
  const { action } = req.body; // 'approve' or 'deny'
  const user = await User.findById(req.params.id);

  if (!user || !user.adminRequest) {
    return next(new AppError('No admin request found for this user', 404, httpStatusText.NOT_FOUND));
  }

  if (action === 'approve') {
    user.role = 'admin';
    user.adminRequest = false;
    await user.save();
    
    await sendEmail({
      email: user.email,
      subject: 'Your Admin Request Has Been Approved',
      template: 'admin-approved'
    });
  } else {
    user.adminRequest = false;
    await user.save();
    
    await sendEmail({
      email: user.email,
      subject: 'Your Admin Request Has Been Denied',
      template: 'admin-denied'
    });
  }

  res.status(200).json({
    status: httpStatusText.SUCCESS,
    data: { user },
  });
});

// @desc    Get admin requests
// @route   GET /api/users/admin-requests
// @access  Private (Admin/SuperAdmin)
const getAdminRequests = asyncWrapper(async (req, res, next) => {
  const { page = 1, limit = 10 } = req.query;

  const {
    data: users,
    total,
    page: currentPage,
    totalPages,
  } = await paginate(User, { adminRequest: true }, { page, limit });

  res.status(200).json({
    status: httpStatusText.SUCCESS,
    results: users.length,
    total,
    currentPage,
    totalPages,
    data: { users },
  });
});



module.exports = {
  getIncentives,
  addIncentive,
  getReviews,
  addReview,
  getSpecialCases,
  addSpecialCase,
  getCreditHistory,
  addCredit,
  updateTicket,
  getTickets,
  createTicket,
  getActivities,
  addActivity,
  restoreUser,
  deleteUser,
  updateUser,
  getUserById,
  changePassword,
  updateAvatar,
  updateUserProfile,
  getUserProfile,
  getAllUsers,
  createUser,
  assignUserTags,
  removeUserTags,
  assignSegment,
  removeSegment,
  getUsersByTag,
  getUsersBySegment,
  updateCustomerTier,
  getPendingUsers,
  getApprovedUsers,
  getDeniedUsers,
  approveUser,
  denyUser,
  handleAdminRequest,
  getAdminRequests,
};

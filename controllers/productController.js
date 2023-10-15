const Product = require('../models/productModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

// Better Making A class constructor for this Api Features to use it for every Get All Methods

exports.getAllProducts = catchAsync(async (req, res, next) => {
  // Filtering Querys limit and other uses different querys so we excluded [NOTE !!!!if we put req.query instead of {...req.query} we will edit the real query]
  let query = { ...req.query };
  const excludedFields = ['page', 'limit', 'sort', 'fields'];
  excludedFields.forEach((el) => delete query[el]); // deleting excluded querys

  //Advanced Filtering  changing every less than or great than to $lt and $gt so we can put the filter insiide the find directly
  let strQuery = JSON.stringify(query);
  strQuery = strQuery.replace(
    /\b(gt|lt|gte|lte|ne)\b/g,
    (match) => `$${match}`
  );

  query = JSON.parse(strQuery);

  const allProducts = await Product.find(query).limit(
    parseInt(req.query.limit)
  );

  res.status(200).json({
    status: 'success',
    results: allProducts.length,
    data: allProducts,
  });
});

exports.createProduct = catchAsync(async (req, res, next) => {
  const newProduct = await Product.create(
    Object.assign(req.body, { date: req.requestTime })
  );

  newProduct.save();

  res.status(201).json({
    status: 'success',
    messsage: 'product created succesfully',
    data: newProduct,
  });
});

exports.getProduct = catchAsync(async (req, res, next) => {
  const product = await Product.findById(req.params.id);
  // const product = await Product.findOne({ _id: req.params.id }); Another Way to find a Product By id
  if (!product) {
    return next(new AppError('No Product with this ID', 404));
  }
  res.status(200).json({ status: 'success', data: product });
});

exports.updateProduct = catchAsync(async (req, res, next) => {
  const oldProduct = await Product.findById(req.params.id);
  const updatedProduct = await Product.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true }
  );

  if (!updatedProduct) {
    return next(new AppError('No Product with this ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: { new: updatedProduct, old: oldProduct },
  });
});

exports.deleteProduct = catchAsync(async (req, res, next) => {
  // no need to return any things here
  const product = await Product.findByIdAndDelete(req.params.id);

  if (!product) {
    return next(new AppError('No Product with this ID', 404));
  }

  // Note that 204 is No Content so nothing will returned when deleting any object
  res.status(204).json({ status: 'success', messsage: 'Deleted Successfuly' });
});

// Aggregation PipeLine to get The Avg and More find out more in monogodb docs

exports.getStats = catchAsync(async (req, res, next) => {
  const stats = await Product.aggregate([
    { $match: { price: { $gte: 0 } } },
    {
      $group: {
        _id: '$name',
        numOfProducts: { $sum: 1 },
        avgPricing: { $avg: '$price' },
        minPrice: { $min: '$price' },
        maxPrice: { $max: '$price' },
      },
    },
    { $sort: { avgPricing: -1 } },
    { $match: { _id: { $ne: 'Nikerffsssff' } } },
  ]);

  res
    .status(200)
    .json({ status: 'success', result: stats.length, data: stats });
});

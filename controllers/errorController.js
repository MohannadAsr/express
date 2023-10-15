const AppError = require("../utils/appError");

const handleCastError = (err) => {
  const message = `Invalid ${err.path} : ${err.value}`;
  return new AppError(message, 400);
};

// const handleMongoError = (err) => {
//   const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];
//   const message = `Duplicated Field value : ${value}`;
//   return new AppError("hi", 400);
// };

const handleValidationError = (err, res) => {
  const errors = Object.values(err.errors).map((el) => el.message);
  res.status(400).json({ message: "Invalid Input Data", errors: errors });
};

const errorDev = (error, res) => {
  error.statusCode = error.statusCode || 500;

  res.status(error.statusCode).json({
    status: "error",
    message: error.message,
    error: error,
    stack: error.stack,
  });
};

const sendErrorProd = (error, res) => {
  // Operational error trusted , send message to client
  if (error.isOperational) {
    res
      .status(error.statusCode)
      .json({ status: error.status, message: error.message });
  }
  // programming error or other unknown error , dont leak error deatails in production
  else {
    res
      .status(500)
      .json({ status: "error", message: "Something Went Wrong !" });
  }
};

// Error Controller in Dev Mode and Production Mode and there functions

module.exports = (error, req, res, next) => {
  if (process.env.NODE_ENV === "development") {
    errorDev(error, res);
  } else if (process.env.NODE_ENV === "production") {
    let err = { ...error };
    if (error.name === "CastError") err = handleCastError(error); // Handling cast error for invalid id when getting an product
    // if ((error.code = 11000)) err = handleMongoError(error); //  handling mongoerror when make a  duplicated fields when creating new product with same unique type
    if (error.name === "ValidationError") {
      ///
      return handleValidationError(error, res);
    }
    sendErrorProd(err, res);
  }
  next();
};

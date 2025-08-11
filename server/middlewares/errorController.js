module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = `${err.statusCode}`.startsWith("4") ? "fail" : "error";
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
  });
};

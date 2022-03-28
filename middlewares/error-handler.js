const errorHandler = (err, req, res, next) => {
  const statusCode = err.status || 500;
  res.status(statusCode).json({
    success: false,
    error: err.message,
  });
};

const urlHandler = (req, res, next) => {
  res.status(400).json({ success: false, error: "Invalid URL" });
};

module.exports = { errorHandler, urlHandler };

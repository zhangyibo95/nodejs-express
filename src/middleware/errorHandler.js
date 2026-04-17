const notFoundHandler = (req, res) => {
  res.status(404).json({
    code: 0,
    data: null,
    msg: `Route not found: ${req.method} ${req.originalUrl}`
  });
};

const errorHandler = (error, req, res, next) => {
  if (res.headersSent) {
    return next(error);
  }

  const statusCode = error.statusCode || 500;

  console.error(error);

  res.status(statusCode).json({
    code: 0,
    data: null,
    msg: error.publicMessage || error.message || 'Internal server error'
  });
};

export { notFoundHandler, errorHandler };

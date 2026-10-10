export const errorHandler = (err, req, res, next) => {
  console.error(`❌ [Error Handler] ${req.method} ${req.url}:`, err.stack || err.message);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
    timestamp: new Date().toISOString()
  });
};

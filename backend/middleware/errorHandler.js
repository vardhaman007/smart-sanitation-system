// Standardized backend error handling middleware for REST API
export default function errorHandler(err, req, res, next) {
  console.error('Error occurred on route:', req.method, req.originalUrl);
  console.error(err);

  const statusCode = err.status || err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === 'development' && err.originalError ? { detail: err.originalError } : {})
  });
}

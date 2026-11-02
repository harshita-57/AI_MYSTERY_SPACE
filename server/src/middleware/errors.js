
export function notFound(req, res) {
  res.status(404).json({ error: 'That route could not be found.' });
}

export function errorHandler(error, req, res, next) {
  if (res.headersSent) return next(error);

  console.error('API ERROR:', error);

  const status =
    Number(error.status) ||
    (error.name === 'ValidationError' || error.name === 'ZodError' ? 400 : 500);

  res.status(status).json({
    error: status >= 500
      ? (error.message || 'Something went wrong. Please try again.')
      : error.message,
    details: error.name === 'ZodError'
      ? error.issues?.map(issue => issue.message)
      : undefined
  });
}

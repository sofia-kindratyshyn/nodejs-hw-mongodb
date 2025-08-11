import { HttpError } from 'http-errors';

export const errorHandler = (err, req, res, next) => {
  if (err.name == 'CastError') {
    res.status(400).json({
      status: 400,
      message: 'Invalid contact id format!',
    });
  }
  if (err instanceof HttpError) {
    res.status(err.status).json({
      status: err.status,
      message: err.name,
      data: err,
    });
    return;
  }

  res.status(500).json({
    status: 500,
    message: 'Something went wrong',
    data: err.message,
  });
};

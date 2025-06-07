export const successResponse = (res, { message = 'Success', data = {}, statusCode = 200 }) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
  });
};

export const errorResponse = (res, { message = 'Error', statusCode = 500, stack = '' }) => {
  return res.status(statusCode).json({
    success: false,
    message,
    ...(stack && { stack }),
  });
};
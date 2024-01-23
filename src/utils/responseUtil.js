const sendResponse = (res, statusCode, success, message, data = null) => {
  const response = {
    success,
    message,
  };

  // Include data in the response if it's provided
  if (data) {
    response.data = data;
  }

  res.status(statusCode).json(response);
};

module.exports = sendResponse;

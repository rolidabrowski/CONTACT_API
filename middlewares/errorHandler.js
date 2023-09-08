export const errorHandler = (error, req, res, next) => {
  if (error.message === "data and hash arguments required") {
    return res.status(403).json({
      status: false,
      message: "Please provide password",
    });
  }

  if (error.source === "jwt middleware error") {
    return res.status(403).json({
      status: false,
      message: "Invalid token",
    });
  }

  res.status(error.status || 400).json({
    status: false,
    message: error.message,
  });

  next();
};

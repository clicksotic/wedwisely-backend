exports.validateRequest = (schema, source = "body") => (req, res, next) => {
  const data = req[source];
  const { error } = schema(data);
  if (error) {
    return res.status(400).json({
      message: "Validation failed",
      details: error,
    });
  }
  next();
};



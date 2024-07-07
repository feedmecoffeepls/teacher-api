const validateEmailFormat = (schema) => (req, res, next) => {
  const errors = [];

  const validateEmailFormat = (email) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  Object.entries(schema).forEach(([key, value]) => {
    const requestBodyValue = req.body[key];

    if (!requestBodyValue) {
      errors.push(`${key} is required`);
      return;
    }

    if (typeof value === "string") {
      if (typeof requestBodyValue !== "string") {
        errors.push(`Invalid type for ${key}, expected string`);
      } else if (!validateEmailFormat(requestBodyValue)) {
        errors.push(`Invalid email format for ${key}`);
      }
    } else if (Array.isArray(value)) {
      if (!Array.isArray(requestBodyValue)) {
        errors.push(`Invalid type for ${key}, expected array`);
      } else if (requestBodyValue.length === 0) {
        errors.push(`${key} array should not be empty`);
      } else {
        requestBodyValue.forEach((item) => {
          if (!validateEmailFormat(item)) {
            errors.push(`Invalid email format in ${key} array`);
          }
        });
      }
    } else {
      errors.push(`Invalid type for property ${key}`);
    }
  });

  if (errors.length > 0) {
    res.status(400).json({ errors });
  } else {
    next();
  }
};

export default validateEmailFormat;

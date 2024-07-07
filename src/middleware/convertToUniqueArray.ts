const convertToUniqueArray = (req, res, next) => {
  if (typeof req.query.teacher === 'string') {
    req.query.teacher = [req.query.teacher];
  }
  req.query.teacher = [...new Set(req.query.teacher)];
  next();
};

export default convertToUniqueArray;

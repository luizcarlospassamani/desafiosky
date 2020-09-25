const jsonvalidate = async (req, res, next) => {
  try {
    if (req.get('Content-Type') !== 'application/json') {
      throw new Error('Json format is required');
    }
    next();
  } catch (e) {
    res.status(401).send({ message: e.message });
  }
};

module.exports = jsonvalidate;

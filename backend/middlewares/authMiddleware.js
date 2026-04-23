const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const result = token.replace(/^"|"$/g, "");

    if (!result) {
      return res.status(401).send({
        success: false,
        message: "Authorization token not found",
        data: null,
      });
    }

    const decode = jwt.verify(result, process.env.JWT_SECRET);
    req.user = decode;
    next();
  } catch (error) {
    return res.status(401).send({
      success: false,
      message: "Authorization token not found",
      data: null,
    });
  }
};

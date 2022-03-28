const { verifyToken } = require("../auth/verify-tokens");

const authenticate = async (req, res, next) => {
  try {
    const token = req.header("auth");

    const tokenVerified = await verifyToken(token);

    if (tokenVerified) {
      req.userDetails = {
        id: tokenVerified.id,
        fName: tokenVerified.fName,
      };
      next();
    } else {
      const err = new Error("Invalid token");
      err.status = 400;
      throw err;
    }
  } catch (err) {
    console.log(err);
    next(err);
  }
};

module.exports = { authenticate };

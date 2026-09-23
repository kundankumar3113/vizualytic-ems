const jwt = require("jsonwebtoken");

function requireAuth(req, res, next) {
  const authorizationHeader = req.headers.authorization;

  if (!authorizationHeader?.startsWith("Bearer ")) {
    return res.status(401).json({
      error: "Authentication required",
    });
  }

  const token = authorizationHeader.substring(7);

  try {
    const user = jwt.verify(token, process.env.JWT_SECRET);

    req.user = user;
    next();
  } catch {
    return res.status(401).json({
      error: "Invalid or expired token",
    });
  }
}

module.exports = requireAuth;

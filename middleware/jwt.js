const jwt = require("jsonwebtoken");
exports.jwtGenerate = (user) => {
  const accessToken = jwt.sign(
    { username: user.username, id: user.id, timestamp: new Date().getTime() },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: "30m", algorithm: "HS256" }
  );

  return accessToken;
};

exports.jwtValidate = (req, res, next) => {
  try {
    const token = req.headers.cookie.split("=")[1];
    if (!token) return res.sendStatus(401);

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
      if (err) throw new Error(error);
    });
    next();
  } catch (error) {
    return res.sendStatus(403);
  }
};

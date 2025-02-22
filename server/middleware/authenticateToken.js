import jwt from "jsonwebtoken";

export const authenticateAccessToken = (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ message: "Please Login First" });
  }

  try {
    const decoded = jwt.verify(token, "kermenAlu");

    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: "Incorrectly Info" });
  }

  // Alternative with callback:
  // jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
  //   if (err) return res.status(403).json({ message: "Token is not authenticated" });
  //   req.user = user;
  //   next();
  // });
};

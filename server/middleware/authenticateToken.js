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
};

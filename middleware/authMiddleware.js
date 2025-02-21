import jwt from "jsonwebtoken";

export const authenticate = (req, res, next) => {
  const authHeader = req.header("Authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Geen of onjuiste token verstrekt. Toegang geweigerd." });
  }

  const token = authHeader.split(" ")[1];

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { id: verified.id, username: verified.username }; // Alleen relevante data opslaan
    next();
  } catch (error) {
    console.error("JWT-verificatiefout:", error.message);
    res.status(401).json({ error: "Ongeldige of verlopen token." });
  }
};

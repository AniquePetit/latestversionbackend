import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config(); // Zorgt ervoor dat de omgevingsvariabelen geladen worden
const prisma = new PrismaClient();

export const loginUser = async (req, res) => {
  try {
    const { username, password } = req.body; // Haal gebruikersnaam en wachtwoord uit body

    // 1. Check of de gebruiker bestaat op basis van de username
    const user = await prisma.user.findUnique({
      where: { username }, // Zoeken op basis van de gebruikersnaam
    });

    // Als de gebruiker niet bestaat
    if (!user) {
      return res.status(401).json({ error: "Ongeldige inloggegevens" });
    }

    // 2. Controleer of het wachtwoord correct is
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Ongeldige inloggegevens" });
    }

    // 3. Genereer een JWT-token
    const token = jwt.sign(
      { id: user.id, username: user.username }, // Payload: wat er in het token wordt opgeslagen
      process.env.JWT_SECRET, // Je geheime sleutel (zorg ervoor dat deze in je .env-bestand staat)
      { expiresIn: "1h" } // Token verloopt na 1 uur
    );

    // 4. Stuur alleen veilige gebruikersinformatie terug (geen wachtwoord!)
    res.json({
      message: "Succesvol ingelogd!",
      token, // Stuur het JWT-token terug
      user: { id: user.id, username: user.username, email: user.email }, // Stuur alleen veilige gegevens
    });
  } catch (error) {
    console.error("Login error:", error); // Foutmelding loggen voor debugging
    res.status(500).json({ error: "Er is iets misgegaan bij het inloggen. Probeer het later opnieuw." });
  }
};

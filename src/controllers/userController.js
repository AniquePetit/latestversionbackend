import prisma from "../../prisma/prismaclient.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export const getAllUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: { id: true, username: true, email: true },
    });
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch users" });
  }
};

export const getUser = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.params.id }, // UUID, dus GEEN parseInt()
      select: { id: true, username: true, email: true },
    });
    user ? res.json(user) : res.status(404).json({ error: "User not found" });
  } catch {
    res.status(500).json({ error: "Failed to fetch user" });
  }
};

export const createUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: { username, email, password: hashedPassword },
    });

    res.status(201).json({ id: user.id, username: user.username, email: user.email });
  } catch {
    res.status(500).json({ error: "Failed to create user" });
  }
};

export const updateUser = async (req, res) => {
  try {
    const { username, email } = req.body;
    
    // Controleer of gebruiker zijn eigen profiel bewerkt
    if (req.user.id !== req.params.id) {
      return res.status(403).json({ error: "Niet geautoriseerd" });
    }

    const updatedUser = await prisma.user.update({
      where: { id: req.params.id },
      data: { username, email },
    });

    res.json(updatedUser);
  } catch {
    res.status(500).json({ error: "Failed to update user" });
  }
};

export const deleteUser = async (req, res) => {
  try {
    // Controleer of gebruiker zijn eigen account verwijdert
    if (req.user.id !== req.params.id) {
      return res.status(403).json({ error: "Niet geautoriseerd" });
    }

    await prisma.user.delete({ where: { id: req.params.id } });
    res.json({ message: "User deleted" });
  } catch {
    res.status(500).json({ error: "Failed to delete user" });
  }
};

// ✅ LOGIN FUNCTIE TOEVOEGEN
export const login = async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await prisma.user.findUnique({
      where: { username },
    });

    if (!user) {
      return res.status(404).json({ error: "Gebruiker niet gevonden" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Ongeldig wachtwoord" });
    }

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.json({ message: "Login succesvol!", token });
  } catch {
    res.status(500).json({ error: "Fout bij inloggen" });
  }
};

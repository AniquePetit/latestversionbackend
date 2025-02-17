import prisma from "../prismaClient.js";

export const getAllHosts = async (req, res) => {
  try {
    const hosts = await prisma.host.findMany();
    res.json(hosts);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch hosts" });
  }
};

export const getHost = async (req, res) => {
  try {
    const host = await prisma.host.findUnique({
      where: { id: req.params.id },
    });
    host ? res.json(host) : res.status(404).json({ error: "Host not found" });
  } catch (error) {
    res.status(500).json({ error: "Error fetching host" });
  }
};

export const createHost = async (req, res) => {
  try {
    const { name, email } = req.body;
    const newHost = await prisma.host.create({
      data: { name, email },
    });
    res.status(201).json(newHost);
  } catch (error) {
    res.status(500).json({ error: "Error creating host" });
  }
};

export const updateHost = async (req, res) => {
  try {
    const { name, email } = req.body;
    const updatedHost = await prisma.host.update({
      where: { id: req.params.id },
      data: { name, email },
    });
    res.json(updatedHost);
  } catch (error) {
    res.status(500).json({ error: "Error updating host" });
  }
};

export const deleteHost = async (req, res) => {
  try {
    await prisma.host.delete({
      where: { id: req.params.id },
    });
    res.json({ message: "Host deleted" });
  } catch (error) {
    res.status(500).json({ error: "Error deleting host" });
  }
};

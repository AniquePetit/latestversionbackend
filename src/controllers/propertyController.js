import prisma from "../prismaClient.js";

export const getAllProperties = async (req, res) => {
  try {
    const properties = await prisma.property.findMany();
    res.json(properties);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch properties" });
  }
};

export const getProperty = async (req, res) => {
  try {
    const property = await prisma.property.findUnique({
      where: { id: req.params.id },
    });
    property ? res.json(property) : res.status(404).json({ error: "Property not found" });
  } catch (error) {
    res.status(500).json({ error: "Error fetching property" });
  }
};

export const createProperty = async (req, res) => {
  try {
    const { name, location } = req.body;
    const newProperty = await prisma.property.create({
      data: { name, location },
    });
    res.status(201).json(newProperty);
  } catch (error) {
    res.status(500).json({ error: "Error creating property" });
  }
};

export const updateProperty = async (req, res) => {
  try {
    const { name, location } = req.body;
    const updatedProperty = await prisma.property.update({
      where: { id: req.params.id },
      data: { name, location },
    });
    res.json(updatedProperty);
  } catch (error) {
    res.status(500).json({ error: "Error updating property" });
  }
};

export const deleteProperty = async (req, res) => {
  try {
    await prisma.property.delete({
      where: { id: req.params.id },
    });
    res.json({ message: "Property deleted" });
  } catch (error) {
    res.status(500).json({ error: "Error deleting property" });
  }
};

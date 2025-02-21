import prisma from "../prismaClient.js";

export const getAllAmenities = async (req, res) => {
  try {
    const amenities = await prisma.amenity.findMany();
    res.json(amenities);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch amenities" });
  }
};

export const getAmenity = async (req, res) => {
  try {
    const amenity = await prisma.amenity.findUnique({
      where: { id: req.params.id },
    });
    amenity ? res.json(amenity) : res.status(404).json({ error: "Amenity not found" });
  } catch (error) {
    res.status(500).json({ error: "Error fetching amenity" });
  }
};

export const createAmenity = async (req, res) => {
  try {
    const { name } = req.body;
    const newAmenity = await prisma.amenity.create({
      data: { name },
    });
    res.status(201).json(newAmenity);
  } catch (error) {
    res.status(500).json({ error: "Error creating amenity" });
  }
};

export const updateAmenity = async (req, res) => {
  try {
    const { name } = req.body;
    const updatedAmenity = await prisma.amenity.update({
      where: { id: req.params.id },
      data: { name },
    });
    res.json(updatedAmenity);
  } catch (error) {
    res.status(500).json({ error: "Error updating amenity" });
  }
};

export const deleteAmenity = async (req, res) => {
  try {
    await prisma.amenity.delete({
      where: { id: req.params.id },
    });
    res.json({ message: "Amenity deleted" });
  } catch (error) {
    res.status(500).json({ error: "Error deleting amenity" });
  }
};

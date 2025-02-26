import prisma from "../prismaClient.js";

export const getAllProperties = async (req, res) => {
  try {
    const { location, pricePerNight, amenities } = req.query;

    let filters = {};

    // Filteren op locatie
    if (location) {
      filters.location = { contains: location, mode: "insensitive" }; // Case-insensitive
    }

    // Filteren op prijs per nacht
    if (pricePerNight) {
      filters.pricePerNight = parseFloat(pricePerNight); // Zorg ervoor dat prijs een getal is
    }

    // Filteren op voorzieningen
    if (amenities) {
      const amenitiesArray = amenities.split(","); // Converteer string naar array van voorzieningen
      filters.amenities = { hasSome: amenitiesArray }; // Zoek accommodaties die een van de opgegeven voorzieningen bevatten
    }

    const properties = await prisma.property.findMany({
      where: filters,
    });

    res.json(properties);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch properties" });
  }
};

export const getProperty = async (req, res) => {
  try {
    const property = await prisma.property.findUnique({
      where: { id: parseInt(req.params.id) },
    });
    property
      ? res.json(property)
      : res.status(404).json({ error: "Property not found" });
  } catch (error) {
    res.status(500).json({ error: "Error fetching property" });
  }
};

export const createProperty = async (req, res) => {
  try {
    const { name, location, pricePerNight, amenities } = req.body;
    const newProperty = await prisma.property.create({
      data: { name, location, pricePerNight, amenities },
    });
    res.status(201).json(newProperty);
  } catch (error) {
    res.status(500).json({ error: "Error creating property" });
  }
};

export const updateProperty = async (req, res) => {
  try {
    const { name, location, pricePerNight, amenities } = req.body;
    const updatedProperty = await prisma.property.update({
      where: { id: parseInt(req.params.id) },
      data: { name, location, pricePerNight, amenities },
    });
    res.json(updatedProperty);
  } catch (error) {
    res.status(500).json({ error: "Error updating property" });
  }
};

export const deleteProperty = async (req, res) => {
  try {
    await prisma.property.delete({
      where: { id: parseInt(req.params.id) },
    });
    res.json({ message: "Property deleted" });
  } catch (error) {
    res.status(500).json({ error: "Error deleting property" });
  }
};

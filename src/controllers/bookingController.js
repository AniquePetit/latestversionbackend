import prisma from "../prismaClient.js";

export const getAllBookings = async (req, res) => {
  try {
    const bookings = await prisma.booking.findMany();
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch bookings" });
  }
};

export const getBooking = async (req, res) => {
  try {
    const booking = await prisma.booking.findUnique({
      where: { id: parseInt(req.params.id) },
    });
    booking
      ? res.json(booking)
      : res.status(404).json({ error: "Booking not found" });
  } catch (error) {
    res.status(500).json({ error: "Error fetching booking" });
  }
};

// Nieuwe functie: boekingen filteren op userId
export const getBookingsByUserId = async (req, res) => {
  try {
    const { userId } = req.query; // Verkrijg userId uit de query parameters

    if (!userId) {
      return res.status(400).json({ error: "userId is required" });
    }

    // Zoek boekingen voor de opgegeven userId
    const bookings = await prisma.booking.findMany({
      where: { userId: userId },
    });

    if (bookings.length === 0) {
      return res.status(404).json({ error: "No bookings found for this user" });
    }

    res.json(bookings);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch bookings" });
  }
};

export const createBooking = async (req, res) => {
  try {
    const { propertyId, userId, checkInDate, checkOutDate } = req.body;
    const newBooking = await prisma.booking.create({
      data: { propertyId, userId, checkInDate, checkOutDate },
    });
    res.status(201).json(newBooking);
  } catch (error) {
    res.status(500).json({ error: "Error creating booking" });
  }
};

export const updateBooking = async (req, res) => {
  try {
    const { propertyId, userId, checkInDate, checkOutDate } = req.body;
    const updatedBooking = await prisma.booking.update({
      where: { id: parseInt(req.params.id) },
      data: { propertyId, userId, checkInDate, checkOutDate },
    });
    res.json(updatedBooking);
  } catch (error) {
    res.status(500).json({ error: "Error updating booking" });
  }
};

export const deleteBooking = async (req, res) => {
  try {
    await prisma.booking.delete({
      where: { id: parseInt(req.params.id) },
    });
    res.json({ message: "Booking deleted" });
  } catch (error) {
    res.status(500).json({ error: "Error deleting booking" });
  }
};

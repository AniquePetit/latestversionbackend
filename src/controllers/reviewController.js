import prisma from "../prismaClient.js";

export const getAllReviews = async (req, res) => {
  try {
    const reviews = await prisma.review.findMany();
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch reviews" });
  }
};

export const getReview = async (req, res) => {
  try {
    const review = await prisma.review.findUnique({
      where: { id: parseInt(req.params.id) },
    });
    review
      ? res.json(review)
      : res.status(404).json({ error: "Review not found" });
  } catch (error) {
    res.status(500).json({ error: "Error fetching review" });
  }
};

// Nieuwe functie: reviews filteren op userId en propertyId
export const getReviewsByUserIdAndPropertyId = async (req, res) => {
  try {
    const { userId, propertyId } = req.query; // Verkrijg userId en propertyId uit query parameters

    let filters = {};

    if (userId) {
      filters.userId = userId; // Filteren op userId
    }

    if (propertyId) {
      filters.propertyId = propertyId; // Filteren op propertyId
    }

    // Zoek reviews die voldoen aan de filters
    const reviews = await prisma.review.findMany({
      where: filters,
    });

    if (reviews.length === 0) {
      return res.status(404).json({ error: "No reviews found" });
    }

    res.json(reviews);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch reviews" });
  }
};

export const createReview = async (req, res) => {
  try {
    const { userId, propertyId, rating, comment } = req.body;
    const newReview = await prisma.review.create({
      data: { userId, propertyId, rating, comment },
    });
    res.status(201).json(newReview);
  } catch (error) {
    res.status(500).json({ error: "Error creating review" });
  }
};

export const updateReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const updatedReview = await prisma.review.update({
      where: { id: parseInt(req.params.id) },
      data: { rating, comment },
    });
    res.json(updatedReview);
  } catch (error) {
    res.status(500).json({ error: "Error updating review" });
  }
};

export const deleteReview = async (req, res) => {
  try {
    await prisma.review.delete({
      where: { id: parseInt(req.params.id) },
    });
    res.json({ message: "Review deleted" });
  } catch (error) {
    res.status(500).json({ error: "Error deleting review" });
  }
};

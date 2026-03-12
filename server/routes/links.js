import express from "express";
import Link from "../models/Link.js";

const router = express.Router();

// POST /api/links - Create a new link
router.post("/", async (req, res) => {
  try {
    const { url, description } = req.body;

    // Validation
    if (!url || !description) {
      return res.status(400).json({
        success: false,
        message: "Please provide both URL and description",
      });
    }

    // Create and save the link
    const newLink = new Link({
      url,
      description,
    });

    const savedLink = await newLink.save();

    res.status(201).json({
      success: true,
      data: savedLink,
      message: "Link saved successfully",
    });
  } catch (error) {
    console.error("Error creating link:", error);
    res.status(500).json({
      success: false,
      message: "Error saving link",
      error: error.message,
    });
  }
});

// GET /api/links - Retrieve all links with optional search
router.get("/", async (req, res) => {
  try {
    const { search } = req.query;
    let query = {};

    // If search parameter is provided, filter by description or URL
    if (search) {
      query = {
        $or: [
          { description: { $regex: search, $options: "i" } }, // Case-insensitive search in description
          { url: { $regex: search, $options: "i" } }, // Case-insensitive search in URL
        ],
      };
    }

    // Fetch all links matching the query, sorted by newest first
    const links = await Link.find(query).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: links,
      count: links.length,
    });
  } catch (error) {
    console.error("Error fetching links:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching links",
      error: error.message,
    });
  }
});

// DELETE /api/links/:id - Delete a link by ID
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    // Validate MongoDB ObjectId
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        success: false,
        message: "Invalid link ID format",
      });
    }

    // Find and delete the link
    const deletedLink = await Link.findByIdAndDelete(id);

    if (!deletedLink) {
      return res.status(404).json({
        success: false,
        message: "Link not found",
      });
    }

    res.status(200).json({
      success: true,
      data: deletedLink,
      message: "Link deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting link:", error);
    res.status(500).json({
      success: false,
      message: "Error deleting link",
      error: error.message,
    });
  }
});

export default router;

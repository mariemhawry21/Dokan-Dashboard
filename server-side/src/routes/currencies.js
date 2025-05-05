const express = require("express");
const router = express.Router();
const Currency = require("../models/Currency");

// Helper function for pagination
const getPagination = (page, size) => {
  const limit = size ? +size : 10;
  const offset = page ? (page - 1) * limit : 0;

  return { limit, offset };
};

// GET /currencies with pagination
router.get("/", async (req, res) => {
  try {
    const { page = 1, size = 10 } = req.query;
    const { limit, offset } = getPagination(page, size);

    const [currencies, total] = await Promise.all([
      Currency.find({ is_deleted: false }).skip(offset).limit(limit),
      Currency.countDocuments({ is_deleted: false }),
    ]);

    res.json({
      data: currencies,
      meta: {
        total,
        page: +page,
        limit: +limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST /currencies (unchanged)
router.post("/", async (req, res) => {
  const { code, name, symbol, exchange_rate } = req.body;

  if (!code || !name || !symbol || !exchange_rate) {
    return res.status(400).json({ message: "All fields are required!" });
  }

  try {
    const existingCurrency = await Currency.findOne({ code });
    if (existingCurrency) {
      return res.status(400).json({
        message: `Currency with code ${code} already exists`,
      });
    }

    const newCurrency = new Currency({ code, name, symbol, exchange_rate });
    await newCurrency.save();
    res.status(201).json(newCurrency);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// PUT /currencies/:id (unchanged)
router.put("/:id", async (req, res) => {
  try {
    const updatedCurrency = await Currency.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedCurrency) {
      return res.status(404).json({ message: "Currency not found" });
    }
    res.json(updatedCurrency);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// DELETE /currencies/:id (unchanged)
router.delete("/:id", async (req, res) => {
  try {
    const deletedCurrency = await Currency.findByIdAndUpdate(
      req.params.id,
      { is_deleted: true },
      { new: true }
    );
    if (!deletedCurrency) {
      return res.status(404).json({ message: "Currency not found" });
    }
    res.json(deletedCurrency);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;

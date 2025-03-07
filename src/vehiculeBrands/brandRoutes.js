const router = require("express").Router();
const brandService = require("./brandService");

router.post("/", async (req, res) => {
  try {
    const brand = await brandService.createBrand(req.body);
    res.status(201).json(brand);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.get("/", async (req, res) => {
  try {
    res.json(await brandService.getBrands());
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    res.json(await brandService.getBrandById(req.params.id));
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.put("/:id", async (req, res) => {
  try {
    res.json(await brandService.updateBrand(req.params.id, req.body));
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    await brandService.deleteBrand(req.params.id);
    res.json({ message: "Brand deleted" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;

const router = require("express").Router();
const service = require("./service");


router.get("/statistiques", async (req, res) => {
  try {
    const response = await service.countSerivce();
    res.json(response);
  } catch (error) {
    console.log("error",error.message);
    res.status(400).json({message: error});
  }
});

router.post("/", async (req, res) => {
  try {
    const response = await service.createService(req.body);
    res.status(201).json(response);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.get("/", async (req, res) => {
  try {
    const response = await service.getAll();
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const response = await service.getById(req.params.id);
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.patch("/:id", async (req, res) => {
  try {
    const data = req.body;
    const response = await service.update(req.params.id, data);
    res.json(response);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.put("/delete/:id", async (req, res) => {
  try {
    const response = await service.deleteService(req.params.id);
    res.json(response);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});



module.exports = router;

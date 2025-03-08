const router = require("express").Router();
const modelService = require("./modelService");

router.post("/", async (req, res) => {
  try {
    const model = await modelService.createModel(req.body);
    res.status(201).json(model);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.get("/", async (req, res) => {
  try {
    const models = await modelService.getModels();
    res.status(200).json(models);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const model = await modelService.getModelById(req.params.id);
    res.status(200).json(model);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const updatedModel = await modelService.updateModel(
      req.params.id,
      req.body
    );
    res.status(200).json(updatedModel);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    await modelService.deleteModel(req.params.id);
    res.status(200).json({ message: "Model deleted" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;

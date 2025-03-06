const router = require("express").Router();
const userService = require("./userService");

router.post("/", async (req, res) => {
  try {
    const user = await userService.createUser(req.body);
    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.post("/login", async (req, res) => {
  try {
      const { email, password } = req.body;
      const result = await userService.login(email, password);
      res.status(200).json(result);
  } catch (error) {
      res.status(400).json({ error: error.message });
  }
});

module.exports = router;

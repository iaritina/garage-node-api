const router = require("express").Router();
const mileageService = require("./mileageService");

router.post("/", async (req,res) => {
    try {
        console.log("body",req.body)
        const mileage = await mileageService.create(req.body);
        res.status(201).json(mileage);
    } catch (error) {
        res.status(400).json({ error: "Error creating mileage" });
    }
});

module.exports = router;
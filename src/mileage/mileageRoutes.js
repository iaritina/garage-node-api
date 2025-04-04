const router = require("express").Router();
const mileageService = require("./mileageService");

router.post("/", async (req,res) => {
    try {
        const mileage = await mileageService.create(req.body);
        res.status(201).json(mileage);
    } catch (error) {
        res.status(400).json({ error: "Error creating mileage",error});
    }
});

router.get("/:id", async (req, res) => {
    try {
        const mileage = await mileageService.getByAppointment(req.params.id);
        res.status(200).json(mileage);    
    } catch (error) {
        res.status(400).json({error: "Error fetching data",error});
    }
    
});

module.exports = router;
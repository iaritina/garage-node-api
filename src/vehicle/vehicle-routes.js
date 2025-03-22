const router = require("express").Router();
const vehicleService = require("./vehicle-service");

router.get("/", async (req,res) => {
    try {
        const vehicles = await vehicleService.getAllVehicle();
        res.status(200).json(vehicles);
    } catch (error) {
        res.status(400).json({error: error.message});
    }
});

router.get("/:id", async (req, res) => {
    try 
    {
        const vehicle = await vehicleService.getVehicleById(req.params.id);
        res.status(200).json(vehicle);
    } 
    catch (error) {
        res.status(400).json({error: error.message});
    }
});

router.get("/user/:id", async(req, res) => {
    try {
        const vehicles = await vehicleService.getVehicleByUser(req.params.id);
        res.status(200).json(vehicles);
    } catch (error) {
        res.status(400).json({error: error.message});
    }
})

router.post("/", async(req, res) => {
    try 
    {
        const vehicle = await vehicleService.createVehicle(req.body);
        res.status(201).json(vehicle);
    } 
    catch (error) 
    {
        res.status(400).json({error: error.message});    
    }
});


router.put("/delete/:id", async (req, res) => {
    try 
    {
        const vehicle = await vehicleService.deleteVehicle(req.params.id);
        res.status(200).json(vehicle);
    } 
    catch (error) 
    {
        res.status(400).json({error: error.message});    
    }
});

router.patch("/:id", async (req, res) => {
    try 
    {
        const vehicle = await vehicleService.updateVehicle(req.params.id,req.body);
        res.status(200).json(vehicle);
    } 
    catch (error) {
        res.status(400).json({error: error.message});
    }
});

module.exports = router;
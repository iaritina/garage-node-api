const router = require("express").Router();
const productService = require("./productService");

router.get("/", async (req, res) => {
    try 
    {
        res.json(await productService.getAllProduct());
    } catch (error) {
        res.status(400).json({error: error.message});
    }
});

router.post("/", async (req,res) => {
    try {
        const product = await productService.createProduct(req.body);
        res.status(201).json(product);
    } catch (error) {
        res.status(400).json({error: error.message});
    }
});

router.put("/delete/:id", async (req,res) => {
    try {
        const product = await productService.deleteProduct(req.params.id);
        res.status(200).json(product);
    } catch (error) {
        res.status(400).json({error: error.message});
    }
});

router.patch("/:id", async(req,res) => {
    try {
        const product = await productService.updateProduct(req.params.id, req.body);
        res.status(200).json(product);
    } catch (error) {
        res.status(400).json({error: error.message});
    }
})

module.exports = router;
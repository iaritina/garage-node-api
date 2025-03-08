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

router.post("/mechanicRegistration", async(req, res) => {
  try 
  {
    const user = await userService.registrationMechanic(req.body);
    res.status(201).json(user);
  } 
  catch (error) 
  {
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


router.get("/", async (req,res) => {
  try 
  {
    res.json(await userService.getAllUser());   
  } 
  catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.get("/:id", async (req,res) => {
  try 
  {
    res.json(await userService.getUserById(req.params.id));  
  } 
  catch (error) {
    res.status(400).json({error: error.message});
  }
});



router.put("/delete/:id", async (req, res) => {
  try 
  {
    const user = await userService.deleteUser(req.params.id);
    res.status(200).json(user);  
  } 
  catch (error) {
    res.status(400).json({error: error.message});
  }
});

router.put("/:id", async (req, res) => {
  try 
  {
    console.log("id",req.params.id);
    console.log("data",req.body);
    const  user = await userService.updateUser(req.params.id,req.body);
    res.status(200).json(user);
  } 
  catch (error) 
  {
      res.status(400).json({errorr: error.message});
  }
});

module.exports = router;

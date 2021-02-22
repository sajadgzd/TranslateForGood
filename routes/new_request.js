const router = require("express").Router();
const Request = require("../models/request");

// Register new request
router.post("/new_request", async (req, res) => {
  const { languageFrom, languageTo,urgentTranslation, femaleTranslator, documentProofreading,isActive } = req.body;
  try {
    request = new Request({

        languageFrom, 
        languageTo,
        urgentTranslation, 
        femaleTranslator, 
        documentProofreading,
        isActive
    });
    await request.save();
    return res.status(201).json({ message: "New request created successfully!" });
  } catch (err) {
    // console.log(err);
    return res.status(400).json({ error: err.message });
  }
});


module.exports = router;

const router = require("express").Router();
const Request = require("../models/request");

// Register new request
router.post("/new_request", async (req, res) => {
  const { user, languageFrom, languageTo, femaleTranslatorBool, urgentTranslatorBool, documentProofReadingBool,previousTranslatorInfo, isActive } = req.body;

  try {
    let request = new Request({
      user: user,
      languageFrom: languageFrom, 
      languageTo: languageTo,
      urgentTranslation: urgentTranslatorBool, 
      femaleTranslator: femaleTranslatorBool, 
      documentProofreading: documentProofReadingBool,
      isActive: isActive
    });
    await request.save();
    return res.status(201).json({ message: "New request created successfully!" });
  } catch (err) {
    // console.log(err);
    return res.status(400).json({ error: err.message });
  }
});


// Get active requests
router.get("/", async (req, res) => {
  try {
    const requests = await Request.find({isActive: true}).exec();
    res.json(requests);
  } catch (error) {
    return res.status(400).json({ error: err.message });
  }
});

module.exports = router;
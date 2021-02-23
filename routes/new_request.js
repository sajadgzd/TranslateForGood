const router = require("express").Router();
const Request = require("../models/request");

// Register new request
router.post("/new_request", async (req, res) => {
  const { languageFrom, languageTo, urgentTranslation, femaleTranslator, documentProofreading, isActive } = req.body;
  try {
    let request = new Request({

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


// Get active requests
router.get("/", async (req, res) => {
  try {
    const requests = await Request.find({isActive: true}).exec();
    console.log(requests[0]);
    res.json(requests);
  } catch (error) {
    // console.log(err);
    return res.status(400).json({ error: err.message });
  }
});

module.exports = router;
 
// User.find({ name: 'Punit'}, function (err, docs) { 
//   if (err){ 
//       console.log(err); 
//   } 
//   else{ 
//       console.log("First function call : ", docs); 
//   } 
// }); 
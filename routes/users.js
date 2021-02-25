const router = require("express").Router();
const User = require("../models/user");

//  need help with this
///////////////////////////////////////////////////////////////////////////

// Get name by id
router.get("/:id", async (req, res) => {
  try {
    const user = await User.find({_id: req.params.userId}).exec();
    res.json(user);
  } catch (error) {
    return res.status(400).json({ error: err.message });
  }
});


module.exports = router; 
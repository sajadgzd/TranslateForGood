const User = require("../models/user");
const multer = require("multer")

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, './client/public/oploads')
  },
  filename: (req, file, callback) => {
    callback(null, file.originalname);
  }
})

const upload = multer({storage: storage});

let UserController = { 

  // get user by id
  getById: async (req, res) => {
    try {
      let found = await User.findOne({_id: req.params.id});
      res.json(found);
    } catch (error) {
      return res.status(400).json({ error: err.message });
    }
  },
 
  // get all existing users
  getAll: async (req, res) => {
    try {
      let allUsers = await User.find();
      res.json(allUsers);
    } catch (error) {
      return res.status(400).json({ error: err.message });
    }
  },

  // given user's id get all the requests they created
  // actually returns the whole user object with list of requests objects.
  // to get requests just do .request on the result of this query
  getUserRequests: async (req, res) => {
    try {
      let requests = await User.findOne({_id: req.params.id}).populate("requests"); 
      res.json(requests);
    } catch (error) {
      return res.status(400).json({ error: err.message });
    }
  },

  // upload user image 
  uploadImage: async (req, res) => (dispatch) => {
    dispatch({ type: LOADING_USER});
    const newImage = req.file.originalname;
    const user = req.body;
    try {
      User.findByIdAndUpdate({_id: user._id}, newImage)
      res.send({type: 'PUT'});

      return res.status(201).json({ message: "Image updated successfully!" });
    } catch (error) {
      return res.status(400).json({ error: err.message });
    }
  }
}

module.exports = UserController; 
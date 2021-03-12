const express = require("express");
const app = express();
const mongoose = require("mongoose");
require("dotenv").config();
const cors = require("cors");
const path = require('path')
const { requireLogin } = require("./middleware/auth");


const PORT = process.env.PORT || 5000;

// Connect DB
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  })
  .then(() => console.log("MongoDB is successfully connected"))
  .catch((err) => console.log("MongoDB Error:\t ",err));

app.use(cors());
// Body parser
app.use(express.json());

// Routes
const UserControls = require("./controllers/users");
const RequestControls = require("./controllers/requests");
const AuthControls = require("./controllers/auth");


// Order matters here (https://stackoverflow.com/questions/51806260/express-router-order-of-request-executions-state-params-vs-state-absolute)
app.post("/api/auth/register", AuthControls.register);
app.post("/api/auth/login", AuthControls.login);
app.get("/api/auth", requireLogin, AuthControls.current);

app.post("/api/requests/new", RequestControls.create);
app.post("/api/requests/onAccepted", RequestControls.onAccepted);
app.get("/api/requests/active", RequestControls.getActive);
app.get("/api/requests/all", RequestControls.getAll);
app.get("/api/requests/:id", RequestControls.getRequestById);

app.put("/api/users/edit", UserControls.updateUserInfo);
app.get("/api/users/:id/requests", UserControls.getUserRequests);
app.get("/api/users/:id/user", UserControls.getById);
app.get("/api/users/matchedTranslators", UserControls.getMatchedTranslators);
app.get("/api/users/translatorsMatchedRequests", UserControls.getTranslatorsMatchedRequests)
app.get("/api/users/all", UserControls.getAll);


// Serve static assets (build folder) if in production
if (process.env.NODE_ENV === 'production') {
  // Set static folder 
  app.use(express.static('client/build'));
// get anything, load index.html file
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });
}

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
// prod false bcz  it will not run build script if its in prod, once its done it will be in prod

// login heroku , create new app
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
const ChatroomControls = require("./controllers/chatrooms");

// Order matters here (https://stackoverflow.com/questions/51806260/express-router-order-of-request-executions-state-params-vs-state-absolute)
app.post("/api/auth/register", AuthControls.register);
app.post("/api/auth/login", AuthControls.login);
app.get("/api/auth", requireLogin, AuthControls.current);

app.post("/api/requests/new", RequestControls.create);
app.post("/api/requests/onAccepted", RequestControls.onAccepted);
app.post("/api/requests/onDeclined", RequestControls.onDeclined);
app.post("/api/requests/deleteExpired", RequestControls.deleteExpired);
app.get("/api/requests/active", RequestControls.getActive);
app.get("/api/requests/all", RequestControls.getAll);
app.get("/api/requests/:id", RequestControls.getRequestById);

app.post('/api/users/subscribe', UserControls.subscribe); 
app.get("/api/users/requests", UserControls.getUserRequests);
app.put("/api/users/edit", UserControls.updateUserInfo);
app.get("/api/users/:id/user", UserControls.getById);
app.get("/api/users/translator_accepted_requests", UserControls.getTranslatorAcceptedRequests);
app.get("/api/users/user_accepted_requests", UserControls.getUserAcceptedRequests);
app.get("/api/users/matchedTranslators", UserControls.getMatchedTranslators);
app.get("/api/users/translatorsMatchedRequests", UserControls.getTranslatorsMatchedRequests)
app.get("/api/users/all", UserControls.getAll);

app.post("/api/chatrooms/new", ChatroomControls.createChatroom);
app.get("/api/chatrooms/all", ChatroomControls.getAllChatrooms);

// Serve static assets (build folder) if in production
if (process.env.NODE_ENV === 'production') {
  // Set static folder 
  app.use(express.static('client/build'));
// get anything, load index.html file
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });
}

const server = app.listen(5000, () => {
  console.log("Server listening on port 5000");
});

const io = require('socket.io')(server);
const jwt = require("jsonwebtoken");

io.use(async (socket, next) => {
  try {
  const token = socket.handshake.query.token;
  const payload = await jwt.verify(token, process.env.JWT_SECRET);
  socket.userId = payload._id;
  next();
  } catch (err) {} 
});

io.on("connection", (socket) => {
  console.log("Connected: " + socket.userId);

  socket.on("disconect", () => {
    console.log("Disconnected: " + socket.userId);
  })
});

// login heroku , create new app
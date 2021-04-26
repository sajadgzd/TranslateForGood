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
const ChatControls = require("./controllers/chat");


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

app.post("/api/chat/new", ChatControls.create);
app.post("/api/chat/deleteExpired", ChatControls.deleteExpired);
app.get("/api/chat/filter", ChatControls.filterByRequest);

app.get("/api/chat/getChats", ChatControls.getAllChatrooms);
app.get("/api/chat/getById", ChatControls.getById);


// Serve static assets (build folder) if in production
if (process.env.NODE_ENV === 'production') {
  // Set static folder 
  app.use(express.static('client/build'));
// get anything, load index.html file
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });
}

// Bring in the models
require('./models/user');
require('./models/chatroom');
require('./models/message');

const server = app.listen(PORT, () => console.log(`Server started on port ${PORT}`));

const io = require('socket.io')(server, {
  cors: {
    origin: '*',
    methods: ["GET", "POST"]
  }
});

const jwt = require("jsonwebtoken");
const chatroom = require("./models/chatroom");

io.use((socket, next) => {
  try {
      const token = socket.handshake.query.token;
      const payload = jwt.verify(token, process.env.JWT_SECRET);
      socket.userId = payload._id;
      next();
  } catch (err) {}
})

io.on("connect", (socket) => {
  console.log("Connected: " + socket.userId);

  socket.on("disconnect", () => {
    console.log("Disconnected: " + socket.userId);
  });

  socket.on("joinRoom", ({chatroomId}) => {
    socket.join(chatroomId);
    console.log("A user joined chatroom: " + chatroomId);
  });

  socket.on("leaveRoom", ({chatroomId}) => {
    socket.leave(chatroomId);
    console.log("A user left chatroom: " + chatroomId);
  });

});

// prod false bcz  it will not run build script if its in prod, once its done it will be in prod

// login heroku , create new app
const express = require("express"); // Express

// importing the routers for each route
const userRouter = require("./routes/userRoutes");

// Define the Server
const app = express();

// MiddleWares
app.use(express.json()); //  Avoid undefined Post req.body

app.use((req, res, next) => {
  console.log("Hello from the middleware");
  next();
});

// Routes (Also a MiddleWares)
app.use("/api/users", userRouter);

//Normal Get Request
app.get("/", (req, res) => {
  res.status(200).json({ message: "For first time", app: "my firstapp" });
});

module.exports = app;

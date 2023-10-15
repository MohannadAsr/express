const express = require("express"); // Express

// importing the routers for each route
const productRouter = require("./routes/productRoutes");
const userRouter = require("./routes/userRoutes");

const AppError = require("./utils/appError");
const globalErrorController = require("./controllers/errorController");
// Define the Server
const app = express();

// MiddleWares
app.use(express.json()); //  Avoid undefined Post req.body [bodyParser]

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

//Normal Get Request
app.get("/", (req, res) => {
  res.status(200).json({ message: "For first time", app: "my firstapp" });
});

// Routes (Also a MiddleWares)
app.use("/api/products", productRouter);
app.use("/api/users", userRouter);

// All Unhandled Routes [Must be the last Route or it will be handled no matter what is the req url]
app.all("*", (req, res, next) => {
  next(new AppError(`Could Not Found ${req.originalUrl} on this server`, 404));
});

// Error Handling MiddleWare
app.use(globalErrorController);

module.exports = app;

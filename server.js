const app = require("./app");

const port = 4000; // Server Port
// Make the Server Listening in Event Loop
app.listen(process.env.PORT || 4000, () => {
  console.log(`App Running on Port ${process.env.PORT || 4000}`);
});

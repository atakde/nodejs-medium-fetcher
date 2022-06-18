const express = require("express");
const bodyParser = require("body-parser");
const errorController = require("./controllers/errorController");
const PORT = 3000;

const app = express();

// Implement body parser
app.use(bodyParser.json());

// Routes
const routes = require("./routes/mediumRoutes");
app.use("/", routes);

// Error Handler
app.use(errorController);

// Listen server
app.listen(PORT, () => {
  console.log(`Server running at ${PORT}`);
});

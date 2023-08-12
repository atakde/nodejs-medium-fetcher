const express = require("express");
const bodyParser = require("body-parser");
const errorController = require("./controllers/errorController");
const cors = require("cors");
const path = require('path');
const PORT = 3000;

const app = express();

app.use(express.static(path.join(__dirname, 'public')));

// enable cors for all origins
app.use(cors());

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

const express = require("express");
const dotenv = require("dotenv");
dotenv.config();

// const connectToDatabase = require("./config/index.js").connectToDatabase;
// connectToDatabase();

const { connectToDatabase } = require("./config/connectionDb.js");

connectToDatabase();

const app = express();

const cors = require("cors");
app.use(cors());

const PORT = process.env.PORT || 3000;

const errorHandler = require("./middlewares/errorHandler.js");

const routes = require("./routes/index.js");

app.use(express.json());
app.use(routes);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

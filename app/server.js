const express = require("express");
const dotenv = require("dotenv");
dotenv.config();

// const connectToDatabase = require("./config/index.js").connectToDatabase;
// connectToDatabase();

const { connectToDatabase } = require("./config/connectionDb.js");

connectToDatabase();

const app = express();

const PORT = process.env.PORT || 3000;

const routes = require("./routes/index.js");

app.use(routes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

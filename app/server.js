const fs = require('fs');
const express = require("express");
const dotenv = require("dotenv");
dotenv.config();
const path = require("path");
// const connectToDatabase = require("./config/index.js").connectToDatabase;
// connectToDatabase();

const { connectToDatabase } = require("./config/connectionDb.js");

connectToDatabase();

const app = express();

const cors = require("cors");
app.use(cors());

app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// console.log("Uploaded Files:", fs.readdirSync(path.join(__dirname, '../uploads')));

const PORT = process.env.PORT || 3000;

const errorHandler = require("./middlewares/errorHandler.js");

const routes = require("./routes/index.js");

app.use(express.json());
app.use(routes);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

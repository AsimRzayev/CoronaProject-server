const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

var bodyParser = require("body-parser");

const app = express();
const port = process.env.PORT || 8000;

app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));

app.use(cors());
app.use(express.json());

const uri = process.env.ATLAS_URI;
mongoose.connect(uri, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
});
const connection = mongoose.connection;
connection.once("open", () => {
    console.log("MongoDB database connection established successfully");
});

const MemoryRouter = require("./routes/memories");
const AuthRouter = require("./routes/auth");
app.use("/memories", MemoryRouter);
app.use("/auth", AuthRouter);
app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
});

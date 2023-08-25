const fs = require("fs");
const path = require("path");

const express = require("express");
const bodyParses = require("body-parser");
const mongoose = require("mongoose");

const HttpError = require("./models/http-error");
const tagsRouter = require("./routes/tags-routes");
const listsRouter = require("./routes/lists-routes");
const seriesRouter = require("./routes/series-routes");
const gamesRouter = require("./routes/games-routes");
const moviesRouter = require("./routes/movies-routes");
const booksRouter = require("./routes/books-routes");
const vnsRouter = require("./routes/vns-routes");
const walksRouter = require("./routes/walks-routes");
const masRouter = require("./routes/mas-routes");
const altRouter = require("./routes/alt-routes");

const URI = 'mongodb+srv://Admin:Admin@grvenq.gtbynkr.mongodb.net/grvenq?retryWrites=true&w=majority';

const localUrl = "mongodb://127.0.0.1:27017/coll";

const app = express();

app.use(bodyParses.json({limit: '300mb', extended: true}));

app.use("/uploads/images", express.static(path.join("uploads", "images")));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PATCH,DELETE");
  next();
});

//Routes
app.use("/api/tags", tagsRouter);
app.use("/api/lists", listsRouter);
app.use("/api/series", seriesRouter);
app.use("/api/games", gamesRouter);
app.use("/api/movies", moviesRouter);
app.use("/api/books", booksRouter);
app.use("/api/vns", vnsRouter);
app.use("/api/walks", walksRouter);
app.use("/api/mas", masRouter);
app.use("/api/alt", altRouter);

app.use((req, res, next) => {
  const error = new HttpError("Not found!", 404);
  throw error;
});

app.use((error, req, res, next) => {
  if (req.file) {
    fs.unlink(req.file.path, (err) => {
      console.log(err);
    });
  }
  if (res.headerSent) {
    return next(error);
  }
  console.log(error);
  res.status(error.code || 500);
  res.json({ message: error.message || "An unknown error occurred!" });
});

mongoose
  .connect(URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    app.listen(5000);
  })
  .catch((error) => {
    console.log(error);
  });

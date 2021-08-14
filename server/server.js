const express = require("express");
const mongoose = require("mongoose");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config();
const { readdirSync } = require("fs");

//import routes
// const authRoutes = require("./routes/auth");

//app
const app = express();

//db
mongoose
  .connect(process.env.DATABASE, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then(() => console.log("DB CONNECTED"))
  .catch((error) => console.log("DB CONNECTION ERROR", error));

//middlewares
app.use(morgan("dev"));
app.use(bodyParser.json({ limit: "2mb" }));
app.use(cors());

//routes middleware
// app.use('/api', authRoutes);
readdirSync("./routes").map((r) => app.use("/api", require("./routes/" + r)));

//route
app.get("/api", (req, res) => {
  res.json({
    data: "hey you hit the right api",
  });
});

//PORT
const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`server is running on port ${port}`));

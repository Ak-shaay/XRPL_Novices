const dotenv = require("dotenv");

const mongoose = require("mongoose");

process.on("uncaughtException", (err) => {
  console.log(`Uncaught Exception ❌ Shutting Down...`);
  console.error(err.name, err.message);
  process.exit(1);
});

dotenv.config({
  path: "./config.env",
});

const DB = process.env.DATABASE.replace(
  "<PASSWORD>",
  process.env.DATABASE_PASSWORD
);
mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then(() => console.log("DB connection successfull !"));

const app = require("./app");

const port = process.env.PORT || 3000;
// NOTE START THE SERVER
const server = app.listen(port, () => {
  console.log(`Server running on port ${port}...`);
});
process.on("unhandledRejection", (err) => {
  console.log(`Unhandled Rejection ❌ Shutting Down...`);
  console.error(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});

import mongoose from "mongoose";
import dotenv from "dotenv";
import fs from "fs";
import http from "http";
import https from "https";
import app from "./app.js";

process.on("uncaughtException", (err) => {
  console.log("UNCAUGHT EXCEPTION! 💥 Shutting down...");
  console.log(err.name, err.message);
  process.exit(1);
});

dotenv.config();

mongoose
  .connect(process.env.MONGODB_URL)
  .then(() => {
    console.log("⚡ Database connected. ⚡");
  })
  .catch((error) => {
    console.log(
      "🚨 Exhausted all retries. database connection failed. exiting process. 🚨"
    );
    console.log("error:-", error);
  });

mongoose.set("debug", true);

const PORT = process.env.PORT || 8000;
let server;

if (process.env.NODE_ENV === "production") {
  server = https.createServer(
    {
      key: fs.readFileSync(process.env.SSL_KEY_PATH, "utf8"),
      cert: fs.readFileSync(process.env.SSL_CERT_PATH, "utf8"),
      ca: fs.readFileSync(process.env.SSL_CA_PATH, "utf8")
    },
    app
  );
} else {
  server = http.createServer(app);
}

server.listen(PORT, () => {
  console.log(
    `🚀 Server ${process.env.SERVER_NAME} is running at http://localhost:${PORT} 🚀`
  );
});

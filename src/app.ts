import express from "express";
import { registerStudent } from "./controllers/student/register";

const app = express();
app.use(express.json());

app.get("/teachers", (req, res) => {
  res.send("bye");
});


app.post("/api/register", registerStudent);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Server Listening on PORT:", PORT);
});

import express from "express";
import registerRoutes from "./routes/registerRoutes.ts";
import studentRoutes from"./routes/studentRoutes.ts";

const app = express();
app.use(express.json());

app.use('/api', registerRoutes);
app.use('/api', studentRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Server Listening on PORT:", PORT);
});

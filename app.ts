import express from "express";
import morgan from "morgan";
import helmet from "helmet";
import dotenv from "dotenv";
import routes from "./src/routes/index";

dotenv.config();

const app = express();

app.use(express.json());
app.use(morgan("dev"));
app.use(helmet());

app.use("/", routes);

export default app;

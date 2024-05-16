import app from "./app";
import mongoose from "mongoose";

const PORT = process.env.PORT || 8000;
const DB = process.env.DB;

mongoose
    .connect(DB || "")
    .then(() => console.log("Database Connected"))
    .catch((err) => {
        console.log(err);
    });

app.listen(PORT, () => {
    console.log(`Server listening to PORT ${PORT}`);
});

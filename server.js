import { app } from "./app.js";
import { config } from "dotenv";
import { connectDatabase } from "./config/database.js";
import cloudinary from "cloudinary";


config({path: './config/config.env'})

connectDatabase()
cloudinary.config({
  cloud_name: 'dbeptj8fp',
  api_key: '671723357986269',
  api_secret: 'oYz8u2Y2AqJ9SletYLmDgO6naa8',
});

app.listen(process.env.PORT, () => {
  console.log("Server is running on port " + process.env.PORT);
});
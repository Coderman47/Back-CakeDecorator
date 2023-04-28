require("dotenv").config();
const cloudinary = require("cloudinary").v2;
const { CLOUD_NAME, API_KEY_CLOUD, API_SECRET_CLOUD } = require("../../envCloudinary");

cloudinary.config({
  cloud_name: CLOUD_NAME,
  api_key: API_KEY_CLOUD,
  api_secret: API_SECRET_CLOUD,
  secure: true,
});
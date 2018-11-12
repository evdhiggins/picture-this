import addItemsToAirtable from "./airtable/addItemsToAirtable.js";
import deleteAirtableRow from "./airtable/deleteAirtableRow.js";
import deleteImage from "./deleteImage.js";
import downloadImage from "./downloadImage.js";
import getImage from "./nightmare/getImage.js";
import getItem from "./nightmare/getItem.js";
import getItemsToUpload from "./airtable/getItemsToUpload.js";
import getKnownUrls from "./airtable/getKnownUrls.js";
import getUrls from "./nightmare/getUrls.js";
import loadConfig from "./config/loadConfig.js";
import login from "./nightmare/login.js";
import uploadImage from "./nightmare/uploadImage.js";

export default {
  addItemsToAirtable,
  deleteAirtableRow,
  deleteImage,
  downloadImage,
  getImage,
  getItem,
  getItemsToUpload,
  getKnownUrls,
  getUrls,
  loadConfig,
  login,
  uploadImage
};

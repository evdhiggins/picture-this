import addItemsToAirtable from "./airtable/addItemsToAirtable.js";
import deleteAirtableRow from "./airtable/deleteAirtableRow.js";
import downloadImage from "./downloadImage.js";
import getItemsToUpload from "./airtable/getItemsToUpload.js";
import getImage from "./nightmare/getImage.js";
import getItem from "./nightmare/getItem.js";
import getKnownUrls from "./airtable/getKnownUrls.js";
import getUrls from "./nightmare/getUrls.js";
import login from "./nightmare/login.js";
import uploadImage from "./nightmare/uploadImage.js";
import loadConfig from "./config/loadConfig.js";

export default {
  deleteAirtableRow,
  addItemsToAirtable,
  downloadImage,
  getItemsToUpload,
  getImage,
  getItem,
  getKnownUrls,
  getUrls,
  loadConfig,
  login,
  uploadImage
};

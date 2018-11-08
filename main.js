require('dotenv').config();
const confirmMode = require('./built/confirmMode.js');
const autoMode = require('./built/autoMode.js');

if (process.env.SCRIPT_MODE === 'CONFIRM' || process.env.SCRIPT_MODE === 'CONFIRMATION') {
  if (!process.env.AIRTABLE_API_KEY || !process.env.AIRTABLE_BASE_ID || !process.env.AIRTABLE_TABLE_ID) {
    throw new Error('Confirmation mode requires Airtable configuration variables. Please review your .env file ');
  }
  confirmMode();
} else {
  autoMode();
}

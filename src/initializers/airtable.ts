import Airtable = require("Airtable");
const table = new Airtable().base(process.env.AIRTABLE_BASE_ID)(process.env.AIRTABLE_TABLE_ID);

export default table;

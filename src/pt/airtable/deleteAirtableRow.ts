import table from "../../initializers/airtable";
import * as Airtable from "Airtable";

import { Item } from "../../types";

/**
 * Removes an item's row from the table
 */
const deleteAirtableRow = async (item: Item): Promise<void> => {
  table.destroy(item.id);
};

export default deleteAirtableRow;

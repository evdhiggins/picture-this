import table from "../../initializers/airtable";
import * as Airtable from "Airtable";

/**
 * A function used to wait for a given number of seconds.
 * @param seconds The number of seconds for which to wait
 */
const wait = (seconds: number): Promise<void> => {
  return new Promise(res => {
    setTimeout(() => res(), seconds * 1000);
  });
};

import { Item } from "../../types";

/**
 * Check to see if an ISBN already exists in the table
 */
const hasItem = async (item: Item): Promise<boolean> => {
  const records: Airtable.Record[] = await table
    .select({
      maxRecords: 1,
      filterByFormula: `ISBN = '${item.isbn}'`
    })
    .firstPage();

  if (records[0]) {
    return true;
  } else {
    return false;
  }
};

/**
 * Add an item to the table
 */
const addItem = async (item: Item): Promise<void> => {
  await table.create({
    ISBN: item.isbn,
    Title: item.title,
    Author: item.author,
    Picture: [item.picture],
    "Edit URL": item.editUrl,
    "Item URL": item.url
  });
};

/**
 * Loop through an array of Items, check if each item already exists in the table, and call `addItem` for each new item.
 */
const addItemsToAirtable = async (items: Item[]): Promise<void> => {
  for (let i in items) {
    const item = items[i];
    const itemAlreadyExists: Boolean = await hasItem(item);
    if (!itemAlreadyExists) {
      await addItem(item);
    }
    await wait(4);
  }
};

export default addItemsToAirtable;

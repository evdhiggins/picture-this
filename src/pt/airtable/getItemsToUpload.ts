import { Item } from "../../types";
import table from "../../initializers/airtable";
import * as Airtable from "Airtable";

/**
 * Returns an array of all items approved for uploading. Returns an empty array if no approved items exist.
 */
const getItemsToUpload = async (): Promise<Item[]> => {
  const items: Item[] = [];
  const records: Airtable.Record[] = await table
    .select({
      maxRecords: 100,
      filterByFormula: `Approved = 1`
    })
    .all();

  records.forEach((record: Airtable.Record) => {
    const id: string = record.getId();
    let filename: string = record.fields["Picture"][0].filename;
    filename = filename.substring(filename.length - 20);
    filename = /\.(png|jpg|jpeg|gif)/.test(filename) ? filename : `${filename}.jpg`;
    items.push({
      editUrl: record.fields["Edit URL"],
      imageUrl: record.fields["Picture"][0].url,
      filename,
      id
    });
  });
  return items;
};

export default getItemsToUpload;

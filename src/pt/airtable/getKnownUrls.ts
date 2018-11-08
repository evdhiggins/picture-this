import table from "../../initializers/airtable";
import * as Airtable from "Airtable";

/**
 * Returns an array of all item URLs already found.
 */
const getKnownUrls = async (): Promise<string[]> => {
  const records: Airtable.Record[] = await table
    .select({
      fields: ["Item URL"],
      maxRecords: 100
    })
    .all();
  return records.map((record: Airtable.Record) => {
    record.fields;
    return record.fields["Item URL"];
  });
};

export default getKnownUrls;

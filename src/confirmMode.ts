import scripts from "./pt/index";

const {
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
} = scripts;

import nightmare from "./initializers/nightmare";

import { Item, IPage } from "./types";

const main = async (): Promise<void> => {
  const config = loadConfig();
  const knownUrls: string[] = await getKnownUrls();

  const items: Item[] = [];
  for (let i in config.pages) {
    const pageUrls: string[] = await getUrls(nightmare, config.pages[i], knownUrls);
    const pageItems: Item[] = pageUrls.map(
      (url: string): Item => {
        return { url, _pageConfig: i };
      }
    );
    items.push(...pageItems);
  }

  console.log(`${items.length} new item(s) to process.`);

  for (let i in items) {
    const item: Item = await getItem(nightmare, items[i].url, config.pages[items[i]._pageConfig]);
    item.picture = await getImage(nightmare, item.isbn);
    items[i] = item;
  }
  console.log(`${items.length} item(s) to add to Airtable.`);

  await addItemsToAirtable(items);
  const itemsToUpload: Item[] = await getItemsToUpload();
  console.log(`${itemsToUpload.length} approved item(s) to upload.`);

  if (itemsToUpload.length < 1) {
    await nightmare.end();
    return;
  }

  await login(nightmare, config.login);

  for (let i in itemsToUpload) {
    const item: Item = itemsToUpload[i];
    item.picture = await downloadImage(item);
    await uploadImage(nightmare, item, config.upload);
    await deleteAirtableRow(item);
    deleteImage(itemsToUpload[i]);
  }

  await nightmare.end();
  return;
};

module.exports = main;

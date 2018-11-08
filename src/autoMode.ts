import scripts from './pt/index';
const { getImage, getItem, getUrls, login, uploadImage, downloadImage, loadConfig } = scripts;

import nightmare from './initializers/nightmare';

import { Item } from './types';

const main = async (): Promise<void> => {
  const config = loadConfig();

  const items: Item[] = [];
  for (let i in config.pages) {
    const pageUrls: string[] = await getUrls(nightmare, config.pages[i]);
    const pageItems: Item[] = pageUrls.map(
      (url: string): Item => {
        return { url, _pageConfig: i };
      },
    );
    items.push(...pageItems);
  }

  for (let i in items) {
    const item: Item = await getItem(nightmare, items[i].url, config.pages[items[i]._pageConfig]);
    item.picture = await getImage(nightmare, item.isbn);
    await downloadImage(item.picture);
    items.push(item);
  }

  await login(nightmare, config.login);

  for (let i in items) {
    await uploadImage(nightmare, items[i], config.upload);
  }

  await nightmare.end();
};

module.exports = main;

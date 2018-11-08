import { Item, IPage } from "../../types";

function browserScript(selectors: { [index: string]: any }): Item {
  const item: Item = {};
  const functions: { [index: string]: any } = [];

  // Loop through all fields in itemDetails, separating functions
  Object.entries(selectors).forEach(([key, selector]) => {
    if (!selector.funcBody) {
      try {
        item[key] = document.querySelector(selector.pattern)[selector.prop];
      } catch (e) {
        item[key] = "";
      }
    } else {
      functions[key] = selector.funcBody;
    }
  });

  // Execute all defined functions
  Object.entries(functions).forEach(([key, functionBody]) => {
    const func = new Function("item", "parentElement", functionBody);
    try {
      item[key] = func(item, document);
    } catch (e) {
      item[key] = "";
    }
  });

  return item;
}

/**
 * Parses the `itemDetails` from the page found via `url`.
 * @param nightmare
 * @param url The url to the item details
 * @param pageConfig
 */
const getItem = async (nightmare: any, url: string, pageConfig: IPage): Promise<Item> => {
  await nightmare.goto(url);
  await nightmare.wait(pageConfig.itemDetailWaitForSelector);
  const item: Item = await nightmare.evaluate(browserScript, pageConfig.itemDetails);
  item.url = url;
  return item;
};

export default getItem;

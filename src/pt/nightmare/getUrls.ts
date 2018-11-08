import { IPage } from "../../types";

function browserScript(pageConfig: IPage) {
  const itemNodes: NodeList = document.querySelectorAll(pageConfig.itemSelector);
  const missingItems: string[] = [];

  const runCustomFunction = (parent: HTMLElement, funcBody: string): any => {
    const func = new Function("item", "parentElement", funcBody);
    return func(null, parent);
  };

  // Loop on each item
  itemNodes.forEach((node: HTMLElement) => {
    try {
      // Get the image src via custom function or selector / property
      let imageSrc: string;

      if (pageConfig.itemImage.funcBody) {
        imageSrc = runCustomFunction(node, pageConfig.itemImage.funcBody);
      } else {
        imageSrc = (node.querySelector(pageConfig.itemImage.pattern) as any)[pageConfig.itemImage.prop];
      }

      if (pageConfig.missingImageUrls.includes(imageSrc)) {
        // Get the item url via custom function or selector / property
        let url: string;

        if (pageConfig.itemUrl.funcBody) {
          url = runCustomFunction(node, pageConfig.itemUrl.funcBody);
        } else {
          url = (node.querySelector(pageConfig.itemUrl.pattern) as any)[pageConfig.itemUrl.prop];
        }
        missingItems.push(url);
      }
    } catch (e) {
      // Do nothing if error occurs
    }
  });
  return missingItems;
}

/**
 * Navigate to the `pageConfig`'s `page` and identify all item's missing images. Return an array of itemUrls
 * @param nightmare
 * @param pageConfig
 * @param urlsToSkip An array of itemUrl's
 */
const getUrls = async (nightmare: any, pageConfig: IPage, urlsToSkip: string[] = []): Promise<string[]> => {
  await nightmare.goto(pageConfig.page);
  await nightmare.wait(pageConfig.itemSelector);

  // Manually wait for 5 sec, as there are often delays in dynamically loading all images
  await nightmare.wait(5000);
  const missingItems: string[] = await nightmare.evaluate(browserScript, pageConfig);

  // Exclude all urls that already exist in Airtable, if any
  return missingItems.filter(url => !urlsToSkip.includes(url));
};

export default getUrls;

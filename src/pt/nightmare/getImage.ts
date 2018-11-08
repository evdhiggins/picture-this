import getSearchUrl from "../getSearchUrl.js";
import { Attachment } from "../../types";

function browserScript(selector: string): string {
  const image = document.querySelectorAll(selector)[1] as HTMLImageElement;
  return image.src;
}

/**
 * Perform an image search, returning the url to the first result.
 */
const getImageUrl = async (nightmare: any, searchString: string): Promise<Attachment> => {
  const imageSearchResult: string = "#ires #rg img";
  const imagePreview: string = "#irc-cl .irc_mi";

  await nightmare.goto(getSearchUrl(searchString));
  await nightmare.wait(imageSearchResult);
  await nightmare.click(imageSearchResult);
  await nightmare.wait(imagePreview);
  await nightmare.wait(1000);
  const imageUrl: string = await nightmare.evaluate(browserScript, imagePreview);

  const filename: string = `${searchString}.jpg`;

  return { url: imageUrl, filename };
};

export default getImageUrl;

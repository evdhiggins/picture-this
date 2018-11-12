import { Item } from "../types";
import { unlinkSync, existsSync } from "fs";
import { has } from "lodash";

/**
 * Delete an item's downloaded image. If file doesn't exist no action is taken
 * @param item
 */
export default (item: Item): void => {
  try {
    if (has(item, "picture.filename") && existsSync(item.picture.filename)) {
      unlinkSync(item.picture.filename);
      delete item.picture;
    }
  } catch (e) {
    throw new Error(`Could not delete file: ${e.message}`);
  }
};

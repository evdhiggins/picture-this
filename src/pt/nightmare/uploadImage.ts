import { Item, IUpload } from "../../types";

/**
 * Navigate through the item's maintanance page, uploading the downloaded picture
 * @param nightmare
 * @param item
 * @param uploadConfig
 */
const uploadImage = async (nightmare: any, item: Item, uploadConfig: IUpload): Promise<void> => {
  await nightmare.goto(item.editUrl);
  await nightmare.wait(uploadConfig.waitBeforeSelector);
  await nightmare.upload(uploadConfig.uploadInputSelector, item.picture.filename);
  await nightmare.click(uploadConfig.submitButtonSelector);
  await nightmare.wait(uploadConfig.waitAfterSelector);
};

export default uploadImage;

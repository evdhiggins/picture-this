export interface Item {
  [index: string]: any;
  author?: string;
  editUrl?: string;
  filename?: string;
  id?: string;
  imageUrl?: string;
  isbn?: string;
  picture?: {
    filename: string;
  };
  productId?: string;
  title?: string;
  url?: string;
}

export interface Attachment {
  filename: string;
  url: string;
}

export interface Field {
  ISBN: string;
  Title: string;
  Author: string;
  Picture: Attachment[];
  Approved: boolean;
  'Edit URL': string;
  'Item URL': string;
  'Date added': string;
}

export interface Record {
  fields: Field[];
  getId: () => string;
}

export interface ISelector {
  pattern?: string;
  prop?: string;
  funcBody?: string;
}

export interface IPage {
  page?: string;
  pages?: string[] | IPage[];
  missingImageUrls?: string[];
  itemSelector?: string;
  itemImage?: ISelector;
  itemUrl?: ISelector;
  itemDetailWaitForSelector?: string;
  itemDetails?: {
    [index: string]: string | ISelector;
  };
}

export interface IUpload {
  /**
   * A CSS selector string for the upload input
   **/
  uploadInputSelector?: string;

  /**
   * A CSS selector string for the submit / save button
   */
  submitButtonSelector?: string;

  /**
   * The CSS selector used to signal the page as rendered. If no selector string is given, the `uploadInputSelector` is used.
   **/
  waitBeforeSelector?: string;

  /**
   * The CSS selector used to confirm the upload submission as finished. Often this will be an element on the item's detail page (assuming a redirect after saving)
   */
  waitAfterSelector?: string;
}

export interface ILoginConfig {
  /**
   * The url for the login interface.
   **/
  loginUrl?: string;

  /**
   * The CSS selector used to signal the page as rendered. If no selector string is given, the `usernameInputSelector` is used.
   **/
  waitBeforeSelector?: string;

  /**
   * The CSS selector string for the username input
   */
  usernameInputSelector?: string;

  /**
   * The CSS selector string for the password input
   */
  passwordInputSelector?: string;

  /**
   * A CSS selector string for the login / submit button
   */
  loginButtonSelector?: string;

  /**
   * The CSS selector used to confirm the upload submission as finished. Often this will be an element on the item's detail page (assuming a redirect after saving)
   */
  waitAfterSelector?: string;
}

export interface IConfig {
  upload: IUpload;
  login: ILoginConfig;
  pages: IPage[];
}

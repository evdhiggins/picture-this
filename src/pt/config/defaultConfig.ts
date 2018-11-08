import { IPage, IUpload, ILoginConfig } from 'src/types';

export const page: IPage = {
  page: process.env.WEBSITE_ADDRESS,
  missingImageUrls: [
    `https://${process.env.WEBSITE_ADDRESS}/sites/${
      process.env.WEBSITE_ADDRESS
    }/files/imagecache/product_list/imagefield_default_images/INA_0.jpg`,
  ],
  itemSelector: 'div > div.views-field-nothing > span.field-content',
  itemImage: {
    pattern: 'a > div.field-image > img.imagecache',
    prop: 'src',
  },
  itemUrl: {
    pattern: 'a',
    prop: 'href',
  },
  itemDetailWaitForSelector: '.node',
  itemDetails: {
    author: {
      pattern: '.field-product-ovr\\.lib-author .field-items',
      prop: 'innerText',
    },
    isbn: {
      pattern: '.field-field-in-isbn .field-items',
      prop: 'innerText',
    },
    title: {
      pattern: '#page-title',
      prop: 'innerText',
    },

    productId: {
      pattern: '.node',
      prop: 'id',
    },
    editUrl: {
      funcBody: `const id = item.productId.replace(/[^0-9]/g,""); return \`https://${
        process.env.WEBSITE_ADDRESS
      }/node/\${id}/timber\``,
    },
  },
};

export const loginConfig: ILoginConfig = {
  loginUrl: `https://${process.env.WEBSITE_ADDRESS}/user`,
  usernameInputSelector: '#edit-name',
  passwordInputSelector: '#edit-pass',
  loginButtonSelector: '#edit-submit',
  waitAfterSelector: '#main',
};

export const upload: IUpload = {
  uploadInputSelector: '#edit-image-upload',
  submitButtonSelector: '#edit-submit',
  waitBeforeSelector: '#edit-submit',
  waitAfterSelector: '.node',
};

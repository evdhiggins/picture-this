import { existsSync, PathLike } from 'fs';
import { resolve } from 'path';
import * as defaultConfig from './defaultConfig';
import { IPage, IUpload, IConfig, ILoginConfig } from 'src/types';
import _ = require('lodash');

const makeUrl = (str: string): string => {
  return /^https?:\/\//i.test(str) ? str : `https://${str}`;
};

/**
 *
 * @param parentConfig
 * @param customConfig
 * @param pages
 */
const makePageConfig = (parentConfig: IPage, customConfig: IPage = {}, pageConfigArray: IPage[] = []): IPage[] => {
  const pageConfig: IPage = {
    missingImageUrls: customConfig.missingImageUrls || parentConfig.missingImageUrls,
    itemSelector: customConfig.itemSelector || parentConfig.itemSelector,
    itemImage: {
      pattern: _.get(customConfig, ['itemImage', 'pattern'], parentConfig.itemImage.pattern),
      prop: _.get(customConfig, ['itemImage', 'prop'], parentConfig.itemImage.prop),
    },
    itemUrl: {
      pattern: _.get(customConfig, ['itemUrl', 'pattern'], parentConfig.itemUrl.pattern),
      prop: _.get(customConfig, ['itemUrl', 'prop'], parentConfig.itemUrl.prop),
    },
    itemDetailWaitForSelector: customConfig.itemDetailWaitForSelector || parentConfig.itemDetailWaitForSelector,
    itemDetails: customConfig.itemDetails || parentConfig.itemDetails,
  };

  if (typeof customConfig.page === 'string') {
    pageConfig.page = makeUrl(customConfig.page);
    pageConfigArray.push(pageConfig);
  } else if (Array.isArray(customConfig.pages)) {
    (customConfig.pages as any[]).forEach((page: any) => {
      if (typeof page === 'string') {
        const newPage: IPage = _.cloneDeep<IPage>(pageConfig);
        newPage.page = page;
        pageConfigArray.push(newPage);
      } else {
        makePageConfig(pageConfig, page, pageConfigArray);
      }
    });
  } else {
    pageConfig.page = makeUrl(parentConfig.page);
    pageConfigArray.push(pageConfig);
  }
  return pageConfigArray;
};

const makeLoginConfig = (defaultConfig: ILoginConfig, customConfig: ILoginConfig = {}): ILoginConfig => {
  return {
    loginUrl: customConfig.loginUrl || defaultConfig.loginUrl,
    waitBeforeSelector:
      customConfig.waitBeforeSelector || customConfig.usernameInputSelector || defaultConfig.usernameInputSelector,
    usernameInputSelector: customConfig.usernameInputSelector || defaultConfig.usernameInputSelector,
    passwordInputSelector: customConfig.passwordInputSelector || defaultConfig.passwordInputSelector,
    loginButtonSelector: customConfig.loginButtonSelector || defaultConfig.loginButtonSelector,
    waitAfterSelector: customConfig.waitAfterSelector || defaultConfig.waitAfterSelector,
  };
};

const makeUploadConfig = (defaultConfig: IUpload, customConfig: IUpload = {}): IUpload => {
  return {
    uploadInputSelector: customConfig.uploadInputSelector || defaultConfig.uploadInputSelector,
    submitButtonSelector: customConfig.submitButtonSelector || defaultConfig.submitButtonSelector,
    waitBeforeSelector:
      customConfig.waitBeforeSelector || customConfig.uploadInputSelector || customConfig.waitBeforeSelector,
    waitAfterSelector: customConfig.waitAfterSelector || defaultConfig.waitAfterSelector,
  };
};

export default (): IConfig => {
  let customConfig: any;
  const customConfigPath: PathLike = resolve(__dirname, '../../..', process.env.SCRIPT_CONFIG || '');
  console.log(`Looking for custom config at ${customConfigPath}`);
  if (process.env.SCRIPT_CONFIG && existsSync(customConfigPath)) {
    console.log('Custom config found. Loading...');
    customConfig = require(customConfigPath);
  } else {
    console.log('No custom config found.');
    customConfig = {};
  }

  return {
    pages: makePageConfig(defaultConfig.page, customConfig.pageConfig),
    login: makeLoginConfig(defaultConfig.loginConfig, customConfig.loginConfig),
    upload: makeUploadConfig(defaultConfig.upload, customConfig.uploadConfig),
  };
};

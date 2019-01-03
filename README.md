# Picture This

"Picture This" is a NodeJS script powered by [NightmareJS](https://github.com/segmentio/nightmare) used to automate image uploading for a website. The script offers an `AUTO` mode that uploads all found images without any user confirmation and a `CONFIRM` mode which leverages an [Airtable](https://airtable.com/) table as the confirmation interface, only uploading approved images.

Currently the script verbiage is tightly coupled to a book-based implementation. Future edits and creative use may expand the possible use-cases.

## How it works

_Picture This_ performs the following steps (the \[bracketed\] text only applies if using `CONFIRM` mode):

- \[ Obtain a list of all known items missing images from previous executions \]
- Identify items \[not already known\] that are missing images, and obtain item details
- Perform a google image search for each item (using the `ISBN` value). Obtain the URL for the _first_ result
- \[ Upload item details & images into Airable for approval \]
- Sign-in to the website using the provided user credentials
- Upload \[confirmed\] item photos into item records by navigating through each item's maintenance page

Each of these steps is specifically tuned for a default page layout (i.e. my primary use-case), but much of these steps can be configured to match additional situations. For more information on configuration visit [the corresponding section](#Configuration).

## Setup

Install the npm packages:

`npm install`
or
`yarn install`

A `.env` file is automatically generated in the root. Fill out the necessary fields, using the guidelines below:

#### Website Settings

Required. Specify the website address and credentials. The credentials are used when signing into the website to upload photos.

```env
# The website address, excluding https
WEBSITE_ADDRESS=www.example.com

# The website user credentials
WEBSITE_USERNAME=Username
WEBSITE_PASSWORD=SuPeRsEcReT
```

#### Script Settings

Optional. Control script modes & add path to an optional configuration file.

```env
# The script running mode. Options are AUTO or CONFIRM. Default is AUTO
SCRIPT_MODE=AUTO
# or
SCRIPT_MODE=CONFIRM

# The relative path to a configuration file. For more information read the "Customization" section below
SCRIPT_CONFIG=./path/to/config.json
```

#### Search Settings

Optional. Configure various aspects of the image search process.

```env
# A specified domain for which to perform the Google image search (e.g. amazon.com). If left blank all domains are included
SEARCH_SPECIFIC_DOMAIN=

# Enable Google image safe search filter. Options T / F. Default T
SEARCH_ENABLE_SAFE=T

# Set license search filter. Options: REUSE / REUSE_WITH_MODIFICATION / NONCOMMERCIAL / NONCOMMERCIAL_WITH_MODIFICATION / NONE. Default: REUSE
SEARCH_LICENSE=REUSE

# File-type to include in search results. Options: JPG / GIF / PNG / BMP / SVG / WEBP / ICO / RAW / (blank or ANY for all filetypes). Default: ANY.
SEARCH_FILETYPE=
```

#### Airtable Settings

These settings are only necessary if running the script in `CONFIRM` mode

```env
AIRTABLE_API_KEY=
AIRTABLE_BASE_ID=
AIRTABLE_TABLE_ID=
```

#### MISC Settings

Optional. These settings are used for debug purposes only.

```env
# Display browser window as the script is run. Options T / F. Default F
MISC_DISPLAY_WINDOW=T
```

#### Airtable Setup<a id="Airtable_Setup"></a>

If `CONFIRM` mode is chosen, the Airtable credentials will need to point to an Airtable table with the following columns:

| Column name | Column type      | Required (Y/N) |
| ----------- | ---------------- | :------------: |
| ISBN        | Single line text | Y              |
| Title       | Single line text | Y              |
| Author      | Single line text | Y              |
| Picture     | Attachment       | Y              |
| Approved    | Checkbox         | Y              |
| Edit URL    | URL              | Y              |
| Item URL    | URL              | Y              |
| Date added  | Created time     | N              |

Create an Airtable table with the above configuration (it must be an _exact_ match) and add the Airtable api key, base id, and table id to the .env configuration file.

## Run

The program can be run by a single command:

`npm start`
or
`yarn start`

It is recommended that a CRON / scheduled task is created run the script automatically run at regular intervals.

## Configuration

Much of the script's process can be customized by a JSON or Javascript config file. The configuration file can include

- **`pageConfig`**: Configure the pages visited, the extraction of item details, and the identification of items with missing images
- **`itemSchema`** (WIP): Customize and override the default item schema
- **`loginConfig`**: Control the sign-in process, including identifying the login url and username/password fields
- **`uploadConfig`**: Configure the upload process via the upload input, _wait_ selectors, and the submit button

The configuration file's relative path must be assigned to the `SCRIPT_CONFIG` variable within the `.env` file. It is expected that these files would be located within the `config` directory, but this is entirely up to you.

Only the root-level configuration objects will be loaded from the config file. All configurations are optional &mdash; an entirely empty configuration would be accepted, so long as it could be parsed successfully.

#### Available JSON Root-level config

```json
{
  "pageConfig": {},
  "itemSchema": {},
  "loginConfig": {},
  "uploadConfig": {}
}
```

#### Available Javascript Config Exports

```js
exports.pageConfig = {};
exports.itemSchema = {};
exports.loginConfig = {};
exports.uploadConfig = {};
```

While a Javascript configuration file offers more powerful possibilities, all script that is executed in the Nightmare.js browser will be parsed as JSON, so any data that is not JSON-compatible will be lost (e.g. functions).

WIP: "If you would like to entirely overwrite the function executed in the browser you can supply a `browserFunction` property within the `pageConfig` and `uploadConfig` config objects that will be called instead of the default function."

WIP: "If you, for whatever reason, basically want to rewrite parts of this application without touching the source code, you can pass a function to the configuration under the `overrideFunction` property. "

### Selectors

Many of the configuration objects use **_selector_** interfaces, which can contain 1 - 3 properties:

- **`pattern`**: A CSS selector string used to locate the corresponding item field element.
- **`prop`**: The HTML element property from which text is obtained. The element found by the `pattern` string is queried for the presence of this property:
- **`funcBody`**: A string containing **only the body of a function**. The function must contain the `return` keyword. This function body is passed two parameters:
  1. `item`: The item currently being processed, if exists.
  2. `parentElement`: The parent element of the current focus.

The function from `funcBody` is created via the function constructor (`new Function(item, parentElement, obj.function)`), and will have full access to all DOM methods and properties.

If `funcBody` is defined `pattern` and `prop` will be ignored.

#### Example 1:

In this example only `pattern` and `prop` are specified; both are used.

```json
{
  "obj": {
    "pattern": "#my-div",
    "prop": "innerText"
  }
}
```

This would roughly be evaluated as the following:

```js
item[nameOfSelector] = document.querySelector(selector.pattern)[selector.prop];
```

#### Full example 2:

In this example `funcBody` is specified alongside `pattern` and `prop`. Only `funcBody` will be evaluated.

```json
{
  "selectorProperty": {
    "pattern": "#detail-div",
    "prop": "innerText",
    "funcBody": "const title = item.title; return document.querySelector(`node-${title}`).innerText;"
  }
}
```

The above example would (depending on the place of use) be evaluated similar to the following:

```js
const func = new Function('item', 'parentElement', selector.funcBody);
item[nameOfSelector] = func(item, parentElement);
```

### Page Config

Customizing the page(s) allows for you to define a custom page (or array of pages) that will be checked for missing item images. In addition, custom item selectors can be defined for identifying items and obtaining item information.

The available configuration options include:

**`page`**: The page url visited when looking for missing images. If the given url does not begin with `http`, the url will be automatically prefixed with `https://`.

```json
  "page": "https://www.example.com",
```

**`missingImageUrls`**: An array of URLs that would be counted as "missing images". This script relies on a finite number of placeholder images being used for missing images. Any item who's image source matches a url within the `missingImageUrls` will be processed.

```json
  "missingImageUrls": [
    "https://www.example.com/images/missing-image1.jpg",
    "https://www.example.com/images/missing-image1.jpg"
  ],
```

**`itemSelector`**: A CSS selector string used to locate all items on the page. The chosen element should contain both the item's image & a link to the item's detail page (if needed)

```json
  "itemSelector": ".exampleClass > .itemDiv",
```

**`itemImage`**: A [selector object](#Selectors) (see above) used to locate the item's image. Items matched by the `itemSelector` are used as the root when locating the image.

```json
  "itemImage": {
    "pattern": "a",
    "prop": "innerText"
  }
```

**`itemUrl`**: A [selector object](#Selectors) (see above) used to locate the item's detail page. Items matched by the `itemSelector` are used as the root when locating the image.

```json
  "itemUrl": {
    "pattern": "a",
    "prop": "innerText"
  },
```

**`itemDetailsWaitForSelector`**: The CSS selector string for which to wait when retrieving item details. Once the element referenced by the selector is found on the page the `itemDetails` script will be run.

**`itemDetails`**: An object containing key/value pairs where the `key` is the item parameter name and the `value` is a [selector](#Selectors). A key/value should exist for all fields within the item object. If no `itemDetails` object is specified, the default fields and selectors are used.

```json
  "itemDetails": {
    "author": { "pattern": ".author" },
    "isbn": { "pattern": ".isbn" },
    "title": { "pattern": ".title" },
    "editUrl": { "pattern": ".edit-link" }
  }
```

The `itemDetails` object can contain any number of fields that may not be needed in the broader scope. For example, if you needed an `itemId` to calculate the `editUrl` you might do something like the following:

```json
{
  "itemId": { "pattern": "#item-id" },
  "editUrl": {
    "funcBody": "return `https://www.example.com/items/${item.itemId}/edit`"
  }
}
```

All `itemDetails` selectors that utilize the `funcBody` property will be evaluated after all other fields. That is, in the following object...

```json
"itemDetails": {
  "author": { "pattern": ".author" },
  "caption": {
    "funcBody": "..."
  },
  "editUrl": { "pattern": ".edit-link" },
  "isbn": { "pattern": ".isbn" },
  "title": { "pattern": ".title" }
}
```

... `caption` would be evaluated after all other fields, allowing the function to utilize all information added to the `item` object.

Currently some of the `itemDetails` names are hardcoded and tightly coupled with book verbiage. As such, the following fields are (currently) absolutely required:

- `isbn`: Used in the image search as the search text
- `editUrl`: Visited when uploading an item's image
- `itemUrl`: The item URL is navigated to prior to parsing other `itemDetails` fields. It is also used in `CONFIRM` mode when excluding items that have been identified in previous script executions.

All other fields are _optional_, though currently only the fields noted in the [Airtable setup section](#Airtable_Setup) will be uploaded into Airtable.

**`pages`**: A page object may contain an array of page urls:

```json
{
  "pages": ["https://www.example.com", "https://www.example.com/other"]
}
```

`pages` may also be an array of nested pages:

```json
{
  "pages": [
    {
      "page": "https://www.example.com",
      "...": "..."
    },
    {
      "page": "https://www.example.com/more",
      "...": "..."
    }
  ]
}
```

Any properties that aren't found on a nested page object will be inherited from the first parent for which they are defined. If a property isn't defined on any parent the default property values are used.

### ItemSchema Customization

WIP: This will allow for the item object to be customized, controlling the structure of the data parsed from the pages as well as the items uploaded into Airtable.

### Login Customization

It is assumed that uploading photos requires a session verified by logging in. The script is able to navigate to a single log in page and enter credentials saved in the `.env` file. The script is not able to handle any more complicated log-in scenarios (e.g. captcha, 2FA, etc).

_`loginUrl`_: The URL used to log in. The script mimics the actions of signing in instead of simply sending a POST request. If not defined the default will be used.

```json
{
  "loginUrl": "https://www.example.com/login"
}
```

_`waitBeforeSelector`_: The CSS selector used to signal the page as rendered. If no selector string is given, the `usernameInputSelector` is used.

```json
{
  "waitBeforeSelector": "#login-element"
}
```

_`usernameInputSelector`_: A CSS selector string used to locate the username input on the page. The username (as specified within the `.env` file) will be entered into this field.

```json
{
  "usernameInputSelector": "#username"
}
```

_`passwordInputSelector`_: A CSS selector string used to locate the password input on the page. The password (as specified within the `.env` file) will be entered into this field.

```json
{
  "passwordInputSelector": "#password"
}
```

_`loginButtonSelector`_: A CSS selector string used to locate the login button on the page. A "click" event will be applied to this element in attempts to sign in.

```json
{
  "loginButtonSelector": "#submit-btn"
}
```

_`waitAfterSelector`_: A CSS selector string for which the script waits after _clicking_ the log-in button.

```json
{
  "waitAfterSelector": "#page"
}
```

### UploadPage Customization

The upload page customization allows for you to define various parameters used when navigating the upload interface. For the sake of simplicity, the following assumptions are made:

- All files share the same upload / maintenance page format
- All uploading occurs on a single page

The following fields are available for customization within the uploadPage object:

_`uploadInputSelector`_: A CSS selector string for the upload input

```json
{
  "uploadInputSelector": "#upload-input"
}
```

_`submitButtonSelector`_: A CSS selector string for the submit / save button

```json
{
  "submitButtonSelector": "#submit-btn"
}
```

_`waitBeforeSelector`_: The CSS selector used to signal the page as rendered. If no selector string is given, the `uploadInputSelector` is used.

```json
{
  "waitBeforeSelector": "#page-container"
}
```

_`waitAfterSelector`_: The CSS selector used to confirm the upload submission as finished. Often this will be an element on the item's detail page (assuming a redirect after saving)

```json
{
  "waitAfterSelector": "#item-container"
}
```

### Putting it all together

For full examples in both JSON and Javascript please visit the [examples directory](https://github.com/evdhiggins/picture-this/tree/master/examples).

### TODOs (needs & wants)

- Add `browserFunction` config functions where applicable
- Add `overrideFunction` config functions where applicable
- Fix 3rd party library typing integrations
- Add unit tests
- Add `itemSchema` configuration and remove book-specific verbiage
- Improve error handling & increase Nightmare error tolerance

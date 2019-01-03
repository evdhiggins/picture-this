import { existsSync, PathLike } from "fs";

const { resolve } = require("path");
const { writeFileSync } = require("fs");

const dotenvContents: string = `
############### Website  settings ###############

# The website address, excluding https
WEBSITE_ADDRESS=

# The website user credentials
WEBSITE_USERNAME=
WEBSITE_PASSWORD=

###############  Script settings  ###############

# The script running mode. Options are AUTO or CONFIRM. Default is AUTO
SCRIPT_MODE=AUTO
# or
# SCRIPT_MODE=CONFIRM

# The relative path to the JS / JSON config file. Please refer to the README for more information
SCRIPT_CONFIG=

###############  Search settings  ###############

# A specific domain for which to perform the Google image search (e.g. amazon.com). If left blank all domains are included
SEARCH_SPECIFIC_DOMAIN=

# Enable Google image safe search filter. Options T / F. Default T
SEARCH_ENABLE_SAFE=

# Set license search filter. Options: REUSE / REUSE_WITH_MODIFICATION / NONCOMMERCIAL / NONCOMMERCIAL_WITH_MODIFICATION / NONE. Default: REUSE
SEARCH_LICENSE=

# File-type to include in search results. Options: JPG / GIF / PNG / BMP / SVG / WEBP / ICO / RAW / (ANY or blank for all filetypes). Default: ANY.
SEARCH_FILETYPE=

############### Airtable settings ###############

# If running in AUTO mode, airtable credentials are needed
AIRTABLE_API_KEY=
AIRTABLE_BASE_ID=
AIRTABLE_TABLE_ID=

###############   MISC Settings   ###############

# Display browser window as the script is run. Options T / F. Default F
MISC_DISPLAY_WINDOW=
`;

const dotenvPath: PathLike = resolve(__dirname, "../../.env");

if (!existsSync(dotenvPath)) {
  console.log(`Creating .env configuration file (@ ${dotenvPath})`);
  writeFileSync(dotenvPath, dotenvContents, "UTF8");
} else {
  console.log(`.env configuration file already exists @ ${dotenvPath}`);
}

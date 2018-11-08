/**
 * Construct a google image search URL based on configurations in the `.env` file
 */
const getSearchUrl = (searchText: string): string => {
  const siteFilter: string = process.env.SEARCH_SPECIFIC_DOMAIN ? `+site%3A${process.env.SEARCH_SPECIFIC_DOMAIN}` : "";
  const safeSearch: string = process.env.SEARCH_ENABLE_SAFE === "F" ? "" : "&safe=active";
  const advancedOptions: string[] = [];

  const licenseOptions: { [index: string]: string } = {
    REUSE: "sur:fc",
    REUSE_WITH_MODIFICATION: "sur:fmc",
    NONCOMMERCIAL: "sur:f",
    NONCOMMERCIAL_WITH_MODIFICATION: "sur:fm",
    NONE: ""
  };

  const filetypeOptions: { [index: string]: string } = {
    JPG: "jpg",
    GIF: "gif",
    PNG: "png",
    BMP: "bmp",
    SVG: "svg",
    WEBP: "webp",
    ICO: "ico",
    RAW: "raw",
    ANY: ""
  };

  const selectedLicenseOption: string = licenseOptions[process.env.SEARCH_LICENSE] || licenseOptions.REUSE;
  selectedLicenseOption !== "" && advancedOptions.push(selectedLicenseOption);

  const selectedFiletypeOption: string = filetypeOptions[process.env.SEARCH_FILETYPE] || filetypeOptions.ANY;
  selectedFiletypeOption !== "" && advancedOptions.push(selectedFiletypeOption);

  const advancedFilter = advancedOptions.length > 0 ? `tbs=${advancedOptions.join(",")}` : "";

  return `https://www.google.com/search?tbm=isch&q=${searchText}${siteFilter}${safeSearch}${advancedFilter}`;
};

export default getSearchUrl;

// Type definitions for image-downloader 3.4
// Project: https://gitlab.com/demsking/image-downloader
// Definitions by: Evan Higgins <https://github.com/evdhiggins>
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped

declare namespace ImageDownloader {
  interface DownloadOptions {
    /**
     *  The URL of the image to be downloaded.
     */
    url: string;

    /**
     * The image destination. Can be a directory or a filename.
     */
    dest: string;

    /**
     * HTTP Headers. Default: `{}`
     */
    headers?: {
      [index: string]: any;
    };

    /**
     * Follow HTTP 3xx responses as redirects. Default: `true`
     */
    followRedirect?: boolean;

    /**
     * The maximum number of redirects to follow. Default: `10`
     */
    maxRedirects: number;

    /**
     * The number of milliseconds to wait for a server to send response headers (and start the response body) before aborting the request.
     */
    timeout: number;
  }

  interface DownloadedImage {
    /**
     * The full path to the saved image.
     */
    filename: string;

    /**
     * The buffer of the saved image.
     */
    image: ArrayBuffer;
  }

  /**
   * Downloads an image from a given url to a given destination. Returns a promise that resolves with an object containing the resulting filepath and arraybuffer of the image.
   * @param options The options object for the downloader. Required parameters are `url` and `dest`.
   */
  export function image(options: DownloadOptions): Promise<DownloadedImage>;
}

export = ImageDownloader;

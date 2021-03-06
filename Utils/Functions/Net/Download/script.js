include(["utils", "functions", "filesystem", "files"]);

/**
 * Downloader prototype
 * @constructor
 */
function Downloader() {
    this._downloader = Bean("downloader");
    this._algorithm = "SHA";
    this._headers = {};
}

/**
 * fetches the file name from an URL
 * @param {string} url URL
 * @returns {string} file name
 */
Downloader.prototype._fetchFileNameFromUrl = function (url) {
    return url.substring(url.lastIndexOf('/') + 1);
}

/**
 * sets wizard
 * @param {SetupWizard} wizard setup wizard
 * @returns {Downloader} Downloader object
 */
Downloader.prototype.wizard = function (wizard) {
    this._wizard = wizard;
    return this;
}

/**
 * sets URL which shall be used for the download
 * @param {string} url URL
 * @returns {Downloader} Downloader object
 */
Downloader.prototype.url = function (url) {
    this._url = url;
    return this;
}

/**
 * sets algorithm which shall be used to verify the checksum
 * @param {string} algorithm checksum algorithm (e.g. "SHA")
 * @returns {Downloader} Downloader object
 */
Downloader.prototype.algorithm = function (algorithm) {
    this._algorithm = algorithm;
    return this;
}

/**
 * sets checksum
 * @param {string} checksum checksum which shall be used to verify the download
 * @returns {Downloader} Downloader object
 */
Downloader.prototype.checksum = function (checksum) {
    this._checksum = checksum;
    return this;
}

/**
 * sets message text
 * @param {string} message download message
 * @returns {Downloader} Downloader object
 */
Downloader.prototype.message = function (message) {
    this._message = message;
    return this;
}

/**
 * sets http headers
 * @param {{}} headers headers
 * @returns {Downloader} Downloader object
 */
Downloader.prototype.headers = function (headers) {
    this._headers = headers;
    return this;
}

/**
 * sets destination
 * @param {string} localDestination destination of the download. If it is a directory, the file will be placed inside
 * @returns {Downloader} Downloader object
 */
Downloader.prototype.to = function (localDestination) {
    this._localDestination = localDestination;
    return this;
}

/**
 * specifies if the download shall be executed only if a newer version is available
 * @param {boolean} onlyIfUpdateAvailable true the download shall be executed only if a newer version is available
 * @returns {Downloader} Downloader object
 */
Downloader.prototype.onlyIfUpdateAvailable = function (onlyIfUpdateAvailable) {
    this._onlyIfUpdateAvailable = onlyIfUpdateAvailable;
    return this;
};

/**
 * returns downloaded file
 * @returns {String} content of downloaded file
 */
Downloader.prototype.get = function () {
    if (!this._message) {
        this._message = tr("Please wait while {0} is downloaded...", this._fetchFileNameFromUrl(this._url));
    }

    if (this._wizard) {
        var progressBar = this._wizard.progressBar(this._message);
    }

    if (this._onlyIfUpdateAvailable) {
        if (!this._downloader.isUpdateAvailable(this._localDestination, this._url)) {
            print(this._localDestination + " already up-to-date.");
            return;
        }
    }

    if (this._localDestination) {
        var downloadFile = this._downloader.get(this._url, this._localDestination, this._headers, function (progressEntity) {
            if (progressBar) {
                progressBar.accept(progressEntity);
            }
        });

        if (this._checksum) {
            var fileChecksum = new Checksum()
                .wizard(this._wizard)
                .of(this._localDestination)
                .method(this._algorithm)
                .get();

            if (fileChecksum != this._checksum) {
                var checksumErrorMessage = tr("Error while calculating checksum for \"{0}\". \n\nExpected = {1}\nActual = {2}",
                    this._localDestination,
                    this._checksum,
                    fileChecksum);

                this._wizard.message(checksumErrorMessage);

                throw checksumErrorMessage;
            }
        }

        return downloadFile.toString();
    } else {
        return this._downloader.get(this._url, this._headers, function (progressEntity) {
            if (progressBar) {
                progressBar.accept(progressEntity);
            }
        });
    }
}

/**
 * Gets the content and parse the JSON value
 * @returns {any} The json content
 */
Downloader.prototype.json = function () {
    return JSON.parse(this.get());
}
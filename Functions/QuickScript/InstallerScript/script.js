include(["Functions", "QuickScript", "QuickScript"]);
include(["Functions", "Net", "Download"]);
include(["Functions", "Engines", "Wine"]);
include(["Functions", "Filesystem", "Extract"]);
include(["Functions", "Shortcuts", "Wine"]);
include(["Functions", "Verbs", "luna"]);


function InstallerScript() {
    QuickScript.call(this);
};

InstallerScript.prototype = Object.create(QuickScript.prototype);

InstallerScript.prototype.constructor = InstallerScript;

InstallerScript.prototype.url = function(url) {
    this._url = url;
    return this;
};

InstallerScript.prototype.checksum = function(checksum) {
    this._checksum = checksum;
    return this;
};

InstallerScript.prototype.go = function() {
    var setupWizard = SetupWizard(this._name);

    setupWizard.presentation(this._name, this._editor, this._editorUrl, this._author);

    var tempFile = createTempFile("exe");

    new Downloader()
        .wizard(setupWizard)
        .url(this._url)
        .checksum(this._checksum)
        .to(tempFile)
        .get();

    new Wine()
        .wizard(setupWizard)
        .version(LATEST_STABLE_VERSION)
        .prefix(this._name)
        .luna()
        .run(tempFile)
        .wait();

    new WineShortcut()
        .name(this._name)
        .prefix(this._name)
        .search(this._executable)
        .arguments((this._executableArgs)
        .miniature([this._category, this._name])
        .create();

    setupWizard.close();
}

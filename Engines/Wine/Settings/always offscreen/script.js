include(["engines", "wine", "engine", "object"]);
include(["engines", "wine", "plugins", "regedit"]);

/**
 * setting to set always offscreen
*/
var settingImplementation = {
    _options: [tr("Default"), tr("Disabled"), tr("Enabled")],
    // values which are written into the registry, do not translate!
    _registryValues: ["", "disabled", "enabled"],
    getText: function () {
        return tr("Always offscreen");
    },
    getOptions: function () {
        return this._options;
    },
    getCurrentOption: function (container) {
        var currentValue = new Wine()
            .prefix(container)
            .regedit()
            .fetchValue(["HKEY_CURRENT_USER", "Software", "Wine", "Direct3D", "AlwaysOffscreen"]);
        // find matching option (use default if not found)
        var index = Math.max(this._registryValues.indexOf(currentValue), 0);
        return this._options[index];
    },
    setOption: function (container, optionIndex) {
        if (0 == optionIndex) {
            new Wine()
                .prefix(container)
                .regedit()
                .deleteValue("HKEY_CURRENT_USER\\Software\\Wine\\Direct3D", "AlwaysOffscreen");
        }
        else {
            var regeditFileContent =
            "REGEDIT4\n" +
            "\n" +
            "[HKEY_CURRENT_USER\\Software\\Wine\\Direct3D]\n" +
            "\"AlwaysOffscreen\"=\"" + this._registryValues[optionIndex] + "\"\n";
            new Wine()
                .prefix(container)
                .regedit()
                .patch(regeditFileContent);
        }
    }
};

/* exported Setting */
var Setting = Java.extend(org.phoenicis.engines.EngineSetting, settingImplementation);

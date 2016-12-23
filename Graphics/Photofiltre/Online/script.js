include(["Functions", "Net", "Download"]);
include(["Functions", "Engines", "Wine"]);
include(["Functions", "Filesystem", "Files"]);
include(["Functions", "Shortcuts", "Wine"]);

var setupWizard = SetupWizard("Photofiltre");

setupWizard.presentation("Photofiltre", "Antonio Da Cruz", "http://photofiltre.free.fr", "Quentin PÂRIS");

var tempFile = createTempFile("exe");

new Downloader()
    .wizard(setupWizard)
    .url("http://photofiltre.free.fr/utils/pf-setup-fr-652.exe")
    .checksum("dc965875d698cd3f528423846f837d0dcf39616d")
    .to(tempFile)
    .get();

new Wine()
    .wizard(setupWizard)
    .version("1.7.12")
    .prefix("photofiltre")
    .run(tempFile)
    .wait();

new WineShortcut()
    .name("Photofiltre")
    .search("PhotoFiltre.exe")
    .miniature(["Graphics", "Photofiltre"])
    .create();

setupWizard.close();
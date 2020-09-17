const fs = require("fs-extra");
const AndroidManifest = require("androidmanifest");
const iOSPList = require("plist");

module.exports = function (
  $logger,
  $platformsDataService,
  $projectData,
  hookArgs
) {
  const nsConfig = $projectData.nsConfig;
  const hookConfig = $projectData.nsConfig.nativescriptHookVersioning;

  if (!nsConfig || !nsConfig.version) {
    $logger.warn(
      "[nativescript-hook-versioning] Nativescript version is not defined. Skipping set native package version."
    );
    return;
  }

  if (!hookConfig) {
    $logger.warn(
      "[nativescript-hook-versioning] The hook config isn't defined."
    );
    return;
  }

  let versionCodeEnabled =
    hookConfig.versionCode &&
    hookConfig.versionCode.enabled &&
    hookConfig.versionCode.content;
  let versionCodeContent = hookConfig.versionCode.content;

  if (versionCodeContent.includes("+")) {
    const splitted = hookConfig.versionCode.content.split("+");
    versionCodeContent = splitted[0];

    if (!process.env[versionCodeContent]) {
      versionCodeEnabled = false;
    } else {
      versionCodeContent =
        parseInt(process.env[versionCodeContent]) + parseInt(splitted[1]);
    }
  } else if (process.env[versionCodeContent]) {
    versionCodeContent = process.env[versionCodeContent];
  } else {
    versionCodeEnabled = false;
  }

  const platform = hookArgs.prepareData.platform;
  const platformData =
    $platformsDataService.platformsDataService[platform]._platformData;

  if (platform == "android") {
    let manifest = new AndroidManifest().readFile(
      platformData.configurationFilePath
    );

    if (hookConfig.versionName) {
      manifest.$("manifest").attr("android:versionName", nsConfig.version);
    }

    if (versionCodeEnabled) {
      manifest.$("manifest").attr("android:versionCode", versionCodeContent);
    }

    manifest.writeFile(platformData.configurationFilePath);
  } else if (platform == "ios") {
    let plist = iOSPList.parse(
      fs.readFileSync(platformData.configurationFilePath, "utf8")
    );

    if (hookConfig.versionName) {
      plist.CFBundleShortVersionString = nsConfig.version;
    }

    if (versionCodeEnabled) {
      plist.CFBundleVersion = versionCodeContent;
    }

    fs.writeFileSync(platformData.configurationFilePath, iOSPList.build(plist));
  }
};

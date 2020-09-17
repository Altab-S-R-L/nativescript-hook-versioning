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

    if (
      hookConfig.versionCode &&
      hookConfig.versionCode.enabled &&
      process.env[hookConfig.versionCode.content]
    ) {
      manifest
        .$("manifest")
        .attr(
          "android:versionCode",
          process.env[hookConfig.versionCode.content]
        );
    }

    manifest.writeFile(platformData.configurationFilePath);
  } else if (platform == "ios") {
    let plist = iOSPList.parse(
      fs.readFileSync(platformData.configurationFilePath, "utf8")
    );

    if (hookConfig.versionName) {
      plist.CFBundleShortVersionString = nsConfig.version;
    }

    if (
      hookConfig.versionCode &&
      hookConfig.versionCode.enabled &&
      process.env[hookConfig.versionCode.content]
    ) {
      plist.CFBundleVersion = process.env[hookConfig.versionCode.content];
    }

    fs.writeFileSync(platformData.configurationFilePath, iOSPList.build(plist));
  }
};

# Nativescript Hook Versioning

![npm](https://img.shields.io/npm/v/nativescript-hook-versioning)

This plugin add an hook that do the followings things:

- Take your `version` from `nativescript.config.ts` and put it as `versionName` into your `AndroidManifest.xml` and as `CFBundleShortVersionString` into your `Info.plist`.
- Take an environment variable of your choice and put it as `versionCode` into your `AndroidManifest.xml` and as `CFBundleVersion` into your `Info.plist`. That allow you to use an environment variable from your CICD and auto increment your version code.

# Installation

`ns plugin add nativescript-hook-versioning`

# Usage

You can add the following configuration into your `nativescript.config.ts`

```
nativescriptHookVersioning: {
    versionName: true,
    versionCode: {
      enabled: true,
      content: 'BUNDLE_VERSION_CODE', // This can contains '+ANY_NUMBER' if you need to increment your versionCode.
    },
  },
```

to configure it to your likings.

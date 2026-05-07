# What Color Is It? - Fire TV
This is a "[What Color Is It?](https://github.com/menzerath/what-color-is-it)"-edition for the Amazon Fire TV (Stick)

## srnyx's Changes
- Adjusted the way the color is calculated
  - Now uses HSV and only modifies the hue, providing a smoother and more vibrant palette
- The time now uses a lighter/darker color of the background
- Added ability to switch between 12-hour and 24-hour display format (select/center on D-pad)
- Added more font styles (right/left on D-pad)
- Added ability to resize time (up/down on D-pad)
- Fixed screen falling asleep (maybe)
- Added configurations for Android Studio building/installing

## Building
### Prerequisites
- Cordova
- Java SDK
- Android SDK

### Steps
1. Ensure Java 17 is being used (`JAVA_HOME`)
2. Add the Android platform: `cordova platform add android`
3. Build the APK: `cordova build android`

## Installing
1. Enable **ADB Debugging** on your Fire TV (**Settings** > **My Fire TV** > **Developer Options**)
2. Connect to your Fire TV using its IP address: `adb connect <IP_ADDRESS>` (Fire TV may prompt to verify connection)
3. Install the generated APK: `adb install platforms/android/app/build/outputs/apk/debug/app-debug.apk`

# Build
echo "Building..."
cordova build android

# Install
echo -e "\n\nInstalling..."
IP=$(cat ip.txt)
adb connect $IP
adb install -r "../platforms/android/app/build/outputs/apk/debug/app-debug.apk"
adb disconnect $IP

# Keep terminal open
echo
read -n 1 -s -r -p "Press any key to exit..."

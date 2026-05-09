# 📱 Flutter Emulator Setup Guide

## Current Status: ⚠️ Flutter/Emulator Not Found

Flutter and Android emulator are not currently configured on your system. Here's how to set them up:

---

## Step 1: Install Flutter (Required)

### Option A: Windows (Direct Installation)
```powershell
# 1. Download Flutter SDK from:
# https://flutter.dev/docs/get-started/install/windows
# Or use git:
git clone https://github.com/flutter/flutter.git

# 2. Add Flutter to PATH
# On Windows:
# - Right-click "This PC" or "My Computer" → Properties
# - Click "Advanced system settings"
# - Click "Environment Variables"
# - Under "User variables", click "New"
# - Variable name: FLUTTER_HOME
# - Variable value: C:\path\to\flutter
# - Add to PATH: C:\path\to\flutter\bin

# 3. Verify installation
flutter --version
```

### Option B: Using Chocolatey
```powershell
choco install flutter
```

---

## Step 2: Install Android SDK

```powershell
# 1. Download Android Studio from:
# https://developer.android.com/studio

# 2. After installing Android Studio:
# - Open Android Studio
# - Go to: Tools → SDK Manager
# - Install:
#   - Android SDK Platform-Tools
#   - Android SDK Build-Tools
#   - Android SDK (API Level 30+)
#   - Android Emulator

# 3. Create Android Virtual Device (AVD):
# - Tools → Device Manager
# - Create Virtual Device
# - Select: Pixel 4 or similar
# - Choose API 30+ (Android 11 or higher)
# - Name it: android-emulator
# - Finish
```

---

## Step 3: Configure Flutter for Android

```powershell
# Run Flutter setup doctor
flutter doctor

# You should see:
# ✓ Flutter
# ✓ Android toolchain
# ✓ Android Studio
# ✓ Connected devices (including your emulator)

# If there are issues, run:
flutter doctor --android-licenses
# Type 'y' to accept all licenses
```

---

## Step 4: Run the Mobile App in Emulator

Once everything is installed:

```powershell
# 1. Navigate to mobile directory
cd mobile

# 2. Get dependencies
flutter pub get

# 3. Start emulator (if not already running)
emulator -avd android-emulator &

# 4. List connected devices
flutter devices

# 5. Run the app
flutter run

# Or specify a device:
flutter run -d <device-id>
```

---

## Quick Commands

```powershell
# Check if emulator is running
flutter devices

# Start Android emulator
emulator -avd android-emulator

# Build and run app
flutter run

# Run with debug info
flutter run -v

# Run in debug mode with verbose logging
flutter run --verbose

# Stop current app
# Press Ctrl+C in terminal

# Rebuild app
flutter run --no-fast-start
```

---

## Troubleshooting

### "Flutter command not found"
- Add Flutter bin directory to PATH
- Restart terminal/PowerShell
- Verify: `flutter --version`

### "Emulator not recognized"
- Install Android Studio
- Create a virtual device via Android Studio
- Ensure API level is 30 or higher

### "App build fails"
```powershell
flutter clean
flutter pub get
flutter run
```

### "Emulator too slow"
- Use hardware acceleration if available
- Allocate more RAM to emulator (Android Studio settings)
- Use Pixel 3 or 4 AVD (better performance)

---

## Minimum Requirements

```
System Requirements:
- Windows 10 or higher
- 8GB RAM (16GB recommended)
- 5GB free disk space
- Internet connection

Software:
- Flutter SDK (latest stable)
- Android SDK (API 30+)
- Java Development Kit (JDK 11+)
- Android Studio (optional but recommended)
```

---

## Next Steps Once Installed

1. Run: `flutter doctor`
2. Confirm all checks pass (✓ symbols)
3. Create Android Virtual Device
4. Navigate to `mobile/` folder
5. Run: `flutter run`
6. App should open in emulator in ~30-60 seconds

---

## Useful Links

- Flutter Installation: https://flutter.dev/docs/get-started/install
- Android Studio Setup: https://developer.android.com/studio/install
- Creating Emulator: https://developer.android.com/studio/run/managing-avds
- Flutter Run Docs: https://flutter.dev/docs/development/tools/flutter-cli

---

**Status:** Setup Required ⚠️  
**Estimated Setup Time:** 30-45 minutes (including downloads)

Follow these steps and let me know once you have Flutter and emulator installed, and I'll help you run the app!

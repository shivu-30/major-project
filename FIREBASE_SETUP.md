# Firebase Setup Guide - Step by Step

## 🔥 Part 1: Create Firebase Project

### Step 1: Go to Firebase Console
1. Open your browser and go to: **https://console.firebase.google.com/**
2. Sign in with your Google account
3. Click **"Add project"** or **"Create a project"**

### Step 2: Configure Your Project
1. **Project name:** Enter `smart-service-finder` (or any name you prefer)
2. Click **Continue**
3. **Google Analytics:** You can enable or disable (optional for development)
4. Click **Continue** (if Analytics enabled, select account or create new)
5. Click **Create project**
6. Wait for project creation (takes ~30 seconds)
7. Click **Continue** when ready

---

## 📱 Part 2: Set Up Android App

### Step 1: Add Android App
1. In your Firebase project dashboard, click the **Android icon** (robot icon)
2. **Android package name:** Enter `com.example.smart_service_finder`
3. **App nickname (optional):** Enter `Smart Service Finder`
4. **Debug signing certificate SHA-1 (optional):** Leave blank for now
5. Click **Register app**

### Step 2: Download Configuration File
1. Click **Download google-services.json**
2. Save this file - you'll need it later
3. Click **Next** → **Next** → **Continue to console**

### Step 3: Place the File
Copy `google-services.json` to:
```
c:\Users\shivu\Desktop\major project shivu\mobile\android\app\
```

---

## 🔐 Part 3: Enable Authentication

### Step 1: Enable Email/Password
1. In Firebase Console, click **Authentication** in left sidebar
2. Click **Get started**
3. Click **Sign-in method** tab
4. Click **Email/Password**
5. Toggle **Enable** switch ON
6. Click **Save**

### Step 2: Enable Google Sign-In (Optional)
1. Still in **Sign-in method** tab
2. Click **Google**
3. Toggle **Enable** switch ON
4. Select your support email
5. Click **Save**

---

## 💾 Part 4: Set Up Firestore Database

### Step 1: Create Database
1. Click **Firestore Database** in left sidebar
2. Click **Create database**
3. **Start in test mode** (for development)
   - This allows read/write access for 30 days
4. Click **Next**

### Step 2: Choose Location
1. Select location closest to you (e.g., `asia-south1` for India)
2. Click **Enable**
3. Wait for database creation

### Step 3: Create Collections (Optional - for testing)
You can create these collections manually:
- `users`
- `providers`
- `bookings`
- `reviews`
- `categories`

---

## 📦 Part 5: Set Up Storage

1. Click **Storage** in left sidebar
2. Click **Get started**
3. **Start in test mode**
4. Click **Next**
5. Use same location as Firestore
6. Click **Done**

---

## 🔑 Part 6: Get Backend Credentials

### Step 1: Generate Service Account Key
1. Click the **⚙️ gear icon** (Settings) → **Project settings**
2. Click **Service accounts** tab
3. Click **Generate new private key**
4. Click **Generate key** in the popup
5. A JSON file will download - **SAVE THIS SECURELY!**

### Step 2: Extract Credentials
Open the downloaded JSON file and find these values:

```json
{
  "project_id": "smart-service-finder-xxxxx",
  "private_key": "-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n",
  "client_email": "firebase-adminsdk-xxxxx@smart-service-finder-xxxxx.iam.gserviceaccount.com"
}
```

You'll need these for the `.env` file!

---

## 🗺️ Part 7: Get Google Maps API Key

### Step 1: Go to Google Cloud Console
1. Open: **https://console.cloud.google.com/**
2. Make sure your Firebase project is selected (top dropdown)

### Step 2: Enable APIs
1. Click **☰ Menu** → **APIs & Services** → **Library**
2. Search and enable these APIs (click each, then click **Enable**):
   - **Maps SDK for Android**
   - **Places API**
   - **Distance Matrix API**
   - **Geocoding API**

### Step 3: Create API Key
1. Go to **APIs & Services** → **Credentials**
2. Click **+ CREATE CREDENTIALS** → **API key**
3. Copy the API key that appears
4. Click **Restrict Key** (recommended)
5. **Application restrictions:** Select **Android apps**
6. Click **+ Add an item**
7. **Package name:** `com.example.smart_service_finder`
8. **SHA-1 certificate fingerprint:** Leave blank for development
9. Click **Done** → **Save**

---

## 📝 Part 8: Configure Your Project

### Step 1: Create Backend .env File

Create/edit: `c:\Users\shivu\Desktop\major project shivu\backend\.env`

```env
# Firebase Configuration
FIREBASE_PROJECT_ID=smart-service-finder-xxxxx
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYOUR_PRIVATE_KEY_HERE\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@smart-service-finder-xxxxx.iam.gserviceaccount.com
FIREBASE_STORAGE_BUCKET=smart-service-finder-xxxxx.appspot.com

# Google Maps
GOOGLE_MAPS_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX

# JWT Secret (generate a random 32+ character string)
JWT_SECRET=your-super-secret-jwt-key-min-32-chars-long-random-string
JWT_EXPIRES_IN=7d

# Server
PORT=3000
NODE_ENV=development

# ML API
ML_API_URL=http://localhost:5000
```

**Important Notes:**
- Replace `smart-service-finder-xxxxx` with your actual project ID
- The `FIREBASE_PRIVATE_KEY` must keep the `\n` characters
- Generate a strong random string for `JWT_SECRET`

### Step 2: Configure Flutter AndroidManifest.xml

Edit: `c:\Users\shivu\Desktop\major project shivu\mobile\android\app\src\main\AndroidManifest.xml`

Add inside `<application>` tag:

```xml
<meta-data
    android:name="com.google.android.geo.API_KEY"
    android:value="YOUR_GOOGLE_MAPS_API_KEY"/>
```

---

## ✅ Verification Checklist

Before running the project, verify:

- [ ] Firebase project created
- [ ] `google-services.json` downloaded and placed in `mobile/android/app/`
- [ ] Email/Password authentication enabled
- [ ] Firestore Database created in test mode
- [ ] Storage enabled
- [ ] Service account JSON downloaded
- [ ] Backend `.env` file created with all credentials
- [ ] Google Maps API key obtained
- [ ] Maps APIs enabled (Maps SDK, Places, Distance Matrix, Geocoding)
- [ ] AndroidManifest.xml updated with Maps API key

---

## 🚀 Next Steps

Once you've completed all the above steps, you can run:

1. **Backend:**
   ```bash
   cd backend
   npm install
   npm run dev
   ```

2. **ML API:**
   ```bash
   cd ml-models
   pip install -r requirements.txt
   python model_api.py
   ```

3. **Flutter App:**
   ```bash
   cd mobile
   flutter pub get
   flutter run
   ```

---

## 🆘 Need Help?

If you get stuck at any step:
1. Take a screenshot of the issue
2. Check the error message
3. Common issues are usually:
   - Wrong file paths
   - Missing API key
   - Incorrect package name
   - Firebase rules too restrictive

---

**You're all set! Follow these steps and you'll have Firebase configured in about 15-20 minutes.** 🎉

# Smart Local Service Finder - Setup & Run Guide

## 📋 Prerequisites

Before running the project, ensure you have the following installed:

- **Node.js** (v16 or higher) - [Download](https://nodejs.org/)
- **Python** (v3.8 or higher) - [Download](https://www.python.org/)
- **Flutter** (v3.0 or higher) - [Install Guide](https://flutter.dev/docs/get-started/install)
- **Git** - [Download](https://git-scm.com/)
- **Android Studio** (for mobile development) - [Download](https://developer.android.com/studio)

---

## 🔧 Step 1: Firebase Setup

### 1.1 Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add Project"
3. Enter project name: `smart-service-finder`
4. Enable Google Analytics (optional)
5. Create project

### 1.2 Enable Firebase Services

**Authentication:**
- Go to Authentication → Get Started
- Enable Email/Password
- Enable Google Sign-In

**Firestore Database:**
- Go to Firestore Database → Create Database
- Start in **test mode** (for development)
- Choose location closest to you

**Storage:**
- Go to Storage → Get Started
- Start in **test mode**

**Cloud Functions:**
- Go to Functions → Get Started
- Upgrade to Blaze plan (pay-as-you-go, free tier available)

### 1.3 Get Firebase Credentials

**For Backend (Node.js):**
1. Go to Project Settings → Service Accounts
2. Click "Generate New Private Key"
3. Save the JSON file securely
4. Extract these values for `.env`:
   - `project_id`
   - `private_key`
   - `client_email`

**For Mobile (Flutter):**
1. Go to Project Settings → General
2. Add Android App
3. Package name: `com.example.smart_service_finder`
4. Download `google-services.json`
5. Place in `mobile/android/app/`

### 1.4 Get Google Maps API Key

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your Firebase project
3. Go to APIs & Services → Credentials
4. Create Credentials → API Key
5. Enable these APIs:
   - Maps SDK for Android
   - Places API
   - Distance Matrix API
   - Geocoding API

---

## 🚀 Step 2: Backend Setup & Run

### 2.1 Install Dependencies

```bash
cd backend
npm install
```

### 2.2 Configure Environment Variables

```bash
# Copy the example file
cp .env.example .env

# Edit .env file with your credentials
notepad .env  # or use your preferred editor
```

**Required `.env` configuration:**
```env
# Firebase
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-project.iam.gserviceaccount.com
FIREBASE_STORAGE_BUCKET=your-project.appspot.com

# JWT
JWT_SECRET=your-super-secret-key-min-32-characters-long
JWT_EXPIRES_IN=7d

# Server
PORT=3000
NODE_ENV=development

# ML API
ML_API_URL=http://localhost:5000

# Google Maps
GOOGLE_MAPS_API_KEY=your-google-maps-api-key

# Payment (choose one)
RAZORPAY_KEY_ID=your-razorpay-key-id
RAZORPAY_KEY_SECRET=your-razorpay-secret
```

### 2.3 Run Backend Server

```bash
# Development mode (with auto-reload)
npm run dev

# Production mode
npm start
```

**Expected Output:**
```
🚀 Server running on port 3000 in development mode
📍 Health check: http://localhost:3000/health
✅ Firebase Admin SDK initialized successfully
```

**Test the server:**
```bash
# Open browser or use curl
curl http://localhost:3000/health
```

---

## 🤖 Step 3: ML Models Setup & Run

### 3.1 Install Python Dependencies

```bash
cd ml-models
pip install -r requirements.txt
```

**Note:** If you encounter issues, use a virtual environment:
```bash
# Create virtual environment
python -m venv venv

# Activate it
# Windows:
venv\Scripts\activate
# Mac/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

### 3.2 Configure ML API

Create `.env` file in `ml-models/` directory:
```env
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-project.iam.gserviceaccount.com
ML_API_PORT=5000
```

### 3.3 Run ML API Server

```bash
python model_api.py
```

**Expected Output:**
```
 * Running on http://0.0.0.0:5000
 * Debug mode: on
```

**Test the ML API:**
```bash
curl http://localhost:5000/health
```

---

## 📱 Step 4: Flutter Mobile App Setup & Run

### 4.1 Install Flutter Dependencies

```bash
cd mobile
flutter pub get
```

### 4.2 Configure Firebase for Android

1. Place `google-services.json` in `mobile/android/app/`
2. Edit `mobile/android/app/build.gradle`:

```gradle
// Add at the bottom of the file
apply plugin: 'com.google.gms.google-services'
```

3. Edit `mobile/android/build.gradle`:

```gradle
buildscript {
    dependencies {
        // Add this line
        classpath 'com.google.gms:google-services:4.3.15'
    }
}
```

### 4.3 Configure Google Maps

Edit `mobile/android/app/src/main/AndroidManifest.xml`:

```xml
<manifest>
    <application>
        <!-- Add this inside <application> tag -->
        <meta-data
            android:name="com.google.android.geo.API_KEY"
            android:value="YOUR_GOOGLE_MAPS_API_KEY"/>
    </application>
</manifest>
```

### 4.4 Run Flutter App

**Connect Android device or start emulator, then:**

```bash
# Check connected devices
flutter devices

# Run the app
flutter run

# Or run in release mode
flutter run --release
```

**Expected Output:**
```
Launching lib/main.dart on Android SDK built for x86 in debug mode...
✓ Built build/app/outputs/flutter-apk/app-debug.apk
Installing build/app/outputs/flutter-apk/app-debug.apk...
```

---

## 🧪 Step 5: Testing the Complete System

### 5.1 Test Backend API

**Using Postman or curl:**

```bash
# 1. Health Check
curl http://localhost:3000/health

# 2. Create User
curl -X POST http://localhost:3000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "fullName": "Test User",
    "phone": "+919876543210",
    "role": "customer"
  }'

# 3. Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

### 5.2 Test ML API

```bash
# Test Recommendations
curl -X POST http://localhost:5000/api/recommendations \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "user123",
    "location": {"latitude": 28.6139, "longitude": 77.2090},
    "preferences": {},
    "category": "electrician",
    "topN": 5
  }'

# Test Fake Review Detection
curl -X POST http://localhost:5000/api/detect-fake-review \
  -H "Content-Type: application/json" \
  -d '{
    "reviewText": "Great service! Highly recommend.",
    "reviewData": {
      "overall_rating": 5,
      "verified": true
    }
  }'
```

### 5.3 Test Mobile App

1. Launch the app on your device/emulator
2. You should see the splash screen
3. Navigate to login screen
4. Try creating an account
5. Explore the home screen

---

## 🔍 Troubleshooting

### Backend Issues

**Port already in use:**
```bash
# Change PORT in .env file
PORT=3001
```

**Firebase connection error:**
- Verify credentials in `.env`
- Check if private key has `\n` properly escaped
- Ensure Firebase project is active

### ML API Issues

**Module not found:**
```bash
# Reinstall dependencies
pip install -r requirements.txt --force-reinstall
```

**NLTK data missing:**
```python
# Run Python and download NLTK data
python
>>> import nltk
>>> nltk.download('punkt')
>>> nltk.download('stopwords')
```

### Flutter Issues

**Build failed:**
```bash
# Clean and rebuild
flutter clean
flutter pub get
flutter run
```

**Google Maps not showing:**
- Verify API key in AndroidManifest.xml
- Enable Maps SDK in Google Cloud Console
- Check billing is enabled

**Firebase error:**
- Verify `google-services.json` is in correct location
- Check package name matches Firebase console
- Rebuild the app

---

## 📊 Running All Services Together

**Recommended Order:**

1. **Terminal 1 - Backend:**
   ```bash
   cd backend
   npm run dev
   ```

2. **Terminal 2 - ML API:**
   ```bash
   cd ml-models
   python model_api.py
   ```

3. **Terminal 3 - Flutter:**
   ```bash
   cd mobile
   flutter run
   ```

---

## 🎯 Quick Start (Development)

For quick development testing without full Firebase setup:

1. **Backend Only:**
   ```bash
   cd backend
   npm install
   # Use mock data instead of Firebase
   npm run dev
   ```

2. **Mobile Only (UI Testing):**
   ```bash
   cd mobile
   flutter pub get
   flutter run
   # Comment out Firebase initialization in main.dart temporarily
   ```

---

## 📝 Next Steps After Setup

1. **Populate Test Data** - Add sample providers and categories to Firestore
2. **Test User Flows** - Create accounts, search services, make bookings
3. **Configure Payment Gateway** - Set up Razorpay/Stripe test mode
4. **Enable Push Notifications** - Configure FCM for notifications
5. **Deploy** - Follow deployment guide for production

---

## 🆘 Need Help?

- **Backend logs:** Check `backend/logs/` directory
- **Flutter logs:** Run `flutter logs` in separate terminal
- **Firebase Console:** Check Firestore, Auth, and Functions logs
- **API Documentation:** See `docs/API_DOCUMENTATION.md`

---

**Happy Coding! 🚀**

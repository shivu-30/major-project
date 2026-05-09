# Firebase Setup Guide for Smart Service Finder

## Step 1: Get Firebase Credentials

### 1.1 Create Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click **"Add Project"**
3. Project name: `smart-service-finder`
4. Enable Google Analytics (optional)
5. Click **"Create Project"**

### 1.2 Create Service Account Key (for Backend)
1. In Firebase Console, go to **Project Settings** (⚙️ icon)
2. Click **"Service Accounts"** tab
3. Click **"Generate New Private Key"** button
4. A JSON file will download - **keep this secure**
5. Open the JSON file and copy these values:
   - `project_id`
   - `private_key`
   - `client_email`

### 1.3 Set Up .env File

1. Navigate to the backend folder:
   ```bash
   cd backend
   ```

2. The `.env` file is already created. Update it with your Firebase credentials:
   ```env
   FIREBASE_PROJECT_ID=your-project-id-from-json
   FIREBASE_PRIVATE_KEY="copy-the-entire-private_key-value-including-BEGIN-and-END"
   FIREBASE_CLIENT_EMAIL=copy-client_email-from-json
   FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
   JWT_SECRET=create-a-random-string-min-32-chars
   ```

## Step 2: Enable Firebase Services

### 2.1 Enable Authentication
1. In Firebase Console, go to **Authentication**
2. Click **"Get Started"**
3. Enable **Email/Password**
4. Enable **Google Sign-In** (optional but recommended)

### 2.2 Create Firestore Database
1. Go to **Firestore Database**
2. Click **"Create Database"**
3. Start in **Test Mode** (for development)
4. Select location closest to you
5. Click **"Enable"**

### 2.3 Enable Cloud Storage
1. Go to **Storage**
2. Click **"Get Started"**
3. Start in **Test Mode**
4. Click **"Done"**

## Step 3: Initialize Firestore Collections

Run the initialization script to set up collections:

```bash
cd backend
npm run init-firebase
```

This will create:
- ✅ `categories` - Service categories (Plumbing, Electrical, etc.)
- ✅ `users` - Customer profiles
- ✅ `providers` - Service provider profiles
- ✅ `bookings` - Service bookings
- ✅ `reviews` - User reviews and ratings
- ✅ `transactions` - Payment records
- ✅ `chats` - Messaging data
- ✅ `notifications` - User notifications
- ✅ `settings` - App configuration

## Step 4: Set Up Additional Services (Optional)

### Payment Gateway - Razorpay (India)
1. Sign up at [Razorpay](https://razorpay.com)
2. Get your API Key and Secret
3. Update .env:
   ```env
   RAZORPAY_KEY_ID=your-key-id
   RAZORPAY_SECRET_KEY=your-secret-key
   ```

### Payment Gateway - Stripe (International)
1. Sign up at [Stripe](https://stripe.com)
2. Get your API keys
3. Update .env:
   ```env
   STRIPE_SECRET_KEY=sk_test_...
   STRIPE_PUBLIC_KEY=pk_test_...
   ```

### Google Maps API (for Location Services)
1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project or select existing
3. Enable **Maps SDK for Android**, **Places API**, **Distance Matrix API**, **Geocoding API**
4. Create an API Key in Credentials
5. Update .env:
   ```env
   GOOGLE_MAPS_API_KEY=your-api-key
   ```

## Step 5: Start the Server

```bash
cd backend
npm install  # Install dependencies if not already done
npm run dev  # Start in development mode with auto-reload
```

Expected output:
```
✅ Firebase Admin SDK initialized successfully
🚀 Server running on port 3000 in development mode
```

## Firestore Security Rules (for Production)

Replace the default security rules with:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow authenticated users to read/write their own user document
    match /users/{uid} {
      allow read, write: if request.auth.uid == uid;
    }

    // Allow anyone to read categories
    match /categories/{doc=**} {
      allow read: if true;
    }

    // Allow authenticated users to read providers
    match /providers/{doc=**} {
      allow read: if request.auth != null;
      allow create, update: if request.auth.uid == resource.data.uid;
    }

    // Allow authenticated users to access bookings
    match /bookings/{booking} {
      allow read, write: if request.auth != null && (request.auth.uid == resource.data.customerId || request.auth.uid == resource.data.providerId);
      allow create: if request.auth != null;
    }

    // Allow reading reviews
    match /reviews/{doc=**} {
      allow read: if true;
      allow create: if request.auth != null;
    }

    // Prevent direct access to transactions
    match /transactions/{doc=**} {
      allow read, write: if false;
    }
  }
}
```

## Troubleshooting

### "Invalid private key"
- Make sure the FIREBASE_PRIVATE_KEY is wrapped in quotes
- Ensure newlines are escaped with `\n`

### "Project ID not found"
- Verify FIREBASE_PROJECT_ID matches exactly from your JSON file
- Check for leading/trailing spaces

### "Storage bucket not found"
- Verify bucket name format: `project-id.appspot.com`
- Ensure Storage is enabled in Firebase Console

### "Too many requests"
- You've hit rate limits in Test Mode
- For production, upgrade to Blaze plan or optimize queries

## Security Checklist

- [ ] Update JWT_SECRET to a secure random string
- [ ] Never commit .env file with real credentials
- [ ] Enable Security Rules in Firestore for production
- [ ] Use OAuth for authentication (not email/password alone)
- [ ] Enable reCAPTCHA for login forms
- [ ] Set up Cloud Functions for sensitive operations
- [ ] Enable Firebase Analytics for monitoring

## Next Steps

1. ✅ Firebase setup complete
2. Run `npm run dev` to start the backend
3. Start implementing backend controllers
4. Set up Flutter mobile app Firebase connection
5. Deploy to production when ready

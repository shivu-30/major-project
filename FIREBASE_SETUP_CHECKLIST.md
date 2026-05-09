# Firebase Setup Checklist ✅

## Quick Start (5 minutes)

### Phase 1: Get Credentials
- [ ] Create Firebase project at https://console.firebase.google.com
- [ ] Go to Project Settings → Service Accounts
- [ ] Click "Generate New Private Key" and save JSON file
- [ ] Copy: `project_id`, `private_key`, `client_email`
- [ ] Note storage bucket: `{project-id}.appspot.com`

### Phase 2: Update .env
- [ ] Open `backend/.env`
- [ ] Paste FIREBASE_PROJECT_ID
- [ ] Paste FIREBASE_PRIVATE_KEY (entire key including BEGIN/END)
- [ ] Paste FIREBASE_CLIENT_EMAIL
- [ ] Paste FIREBASE_STORAGE_BUCKET
- [ ] Generate random JWT_SECRET (min 32 characters)

### Phase 3: Enable Firebase Services
- [ ] Go to Authentication → Enable Email/Password
- [ ] Go to Firestore Database → Create Database (Test Mode)
- [ ] Go to Storage → Get Started (Test Mode)

### Phase 4: Initialize Collections
```bash
cd backend
npm install
npm run init-firebase
```

Expected output:
```
✅ Categories collection created
✅ Users collection initialized
✅ Providers collection initialized
... (all 8 collections)
🎉 All collections initialized successfully!
```

### Phase 5: Start Server
```bash
npm run dev
```

Expected output:
```
✅ Firebase Admin SDK initialized successfully
🚀 Server running on port 3000 in development mode
```

---

## Common Issues & Fixes

| Issue | Solution |
|-------|----------|
| `Invalid private key` | Make sure entire key is in quotes, newlines as `\n` |
| `Project ID not found` | Check for exact match, no spaces |
| `ENOENT: no such file or directory` | Create `backend/scripts/` folder manually |
| `Cannot find module 'dotenv'` | Run `npm install` first |
| `Firebase initialization error` | Check .env values match JSON file exactly |

---

## Files Created

```
backend/
├── .env                          ← Your credentials (DO NOT COMMIT)
├── .env.example                  ← Template (safe to commit)
├── package.json                  ← Updated with init-firebase script
├── scripts/
│   └── init-firebase.js          ← Collection initialization script
```

---

## What's Been Set Up

✅ Backend server structure (Express, Firebase, Security)
✅ Authentication system (JWT + Firebase Auth)
✅ Database schema (Firestore collections ready)
✅ Environment variables template
✅ Initialization script

## Next Steps

1. ✅ Firebase setup complete
2. → Implement remaining backend controllers
3. → Build Flutter mobile app screens
4. → Integrate ML models
5. → Test all features
6. → Deploy to production

---

**Status:** Firebase setup phase complete  
**Date:** March 12, 2026  
**Time to Complete:** ~5-10 minutes

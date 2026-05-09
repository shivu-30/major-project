# 🚀 Quick Start - Production Deployment

**⏱️ Time to Deploy: ~2 hours with all prerequisites**

---

## Prerequisites Checklist

Before starting, ensure you have:
- [x] Google account for Firebase
- [x] GitHub account with repository access
- [x] Google Play Developer account (for mobile)
- [x] Payment gateway accounts (Razorpay/Stripe)
- [x] Domain name (optional)
- [x] SSL certificate (or use Let's Encrypt)

---

## 5-Minute Setup Quick Start

### Step 1: Firebase Project (5 minutes)
```bash
# 1. Go to Firebase Console
https://console.firebase.google.com/

# 2. Create new project
Click "Add Project" → Name: "smart-service-finder-prod" → Create

# 3. Get Service Account Key
Settings (⚙️) → Service Accounts → Generate New Private Key
# Keep this JSON file safe!
```

### Step 2: Backend Environment (5 minutes)
```bash
# 1. Copy environment template
cd backend
cp .env.example .env

# 2. Edit .env with Firebase credentials from Step 1
nano .env
# Fill in:
# - FIREBASE_PROJECT_ID
# - FIREBASE_PRIVATE_KEY
# - FIREBASE_CLIENT_EMAIL
# - FIREBASE_STORAGE_BUCKET
# - JWT_SECRET (generate random 32+ char string)

# 3. Initialize Firebase collections
npm install
npm run init-firebase
```

### Step 3: Backend Deployment (5 minutes)
```bash
# Option A: Google Cloud Run (Recommended)
gcloud auth login
gcloud config set project YOUR_PROJECT_ID
gcloud run deploy smart-service-finder \
  --source . \
  --platform managed \
  --region us-central1
# Note the deployed URL!

# Option B: Heroku
heroku login
heroku create smart-service-finder
npm install -g @heroku/buildpacks
git push heroku main

# Verify:
curl https://YOUR_DEPLOYED_URL/api/health
```

### Step 4: Mobile App (5 minutes)
```bash
# 1. Add Android app to Firebase
Firebase Console → Add Android app
Package name: com.example.smart_service_finder

# 2. Download google-services.json
# Place in: mobile/android/app/google-services.json

# 3. Update API URL
Edit: mobile/lib/main.dart
Change: const String API_URL = 'https://YOUR_DEPLOYED_URL';

# 4. Build APK
cd mobile
flutter pub get
flutter build apk --release

# 5. Publish to Play Store
Play Console → Create app → Upload APK
```

### Step 5: ML Models (5 minutes)
```bash
# Deploy to Heroku
cd ml-models
heroku login
heroku create smart-service-ml
git push heroku main

# Update backend
Edit: backend/.env
ML_API_URL=https://YOUR_ML_API_URL
```

---

## 10-Minute Check: Is It Working?

### Test Backend
```bash
# 1. Health check
curl https://YOUR_API_URL/api/health

# 2. Test authentication
curl -X POST https://YOUR_API_URL/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test","fullName":"Test","phone":"+919999999999","role":"customer"}'

# 3. Test providers endpoint
curl https://YOUR_API_URL/api/providers
```

### Test Mobile App
```bash
# Install on device
flutter install

# Verify:
- [ ] Splash screen loads
- [ ] Login works
- [ ] Can see home screen
- [ ] Search works
- [ ] Can view providers
```

### Test Database
```bash
# In Firebase Console:
- [ ] users collection has 1 record
- [ ] providers collection populated
- [ ] categories collection populated
```

---

## 30-Minute Full Deployment

Follow `PRODUCTION_DEPLOYMENT_GUIDE.md` for complete steps including:
1. Firestore security rules
2. Storage configuration
3. Payment gateway setup
4. Email configuration
5. Monitoring setup

---

## Troubleshooting

### "Firebase credentials not working"
```bash
# Verify credentials in .env
cat backend/.env

# Check project ID in Firebase Console
# Credentials tab
```

### "API returning 401"
```bash
# Verify JWT_SECRET
# Generate new: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### "Mobile app can't connect to API"
```bash
# Check network URL
# Verify CORS in backend
# Check firewall/security groups
```

### "Payment processing not working"
```bash
# Verify API keys are for production (not test)
# Test with provided test credit cards
```

---

## Post-Deployment Checklist

- [ ] Backend health check passing
- [ ] Mobile app connects to backend
- [ ] Authentication working (test login)
- [ ] Database queries working
- [ ] Search functionality working
- [ ] Payments processing
- [ ] ML recommendations working
- [ ] Push notifications configured
- [ ] Analytics enabled
- [ ] Error tracking enabled
- [ ] SSL/HTTPS working
- [ ] CORS properly configured
- [ ] Rate limiting active
- [ ] Backups scheduled
- [ ] Monitoring alerts set

---

## Important URLs After Deployment

```
Backend API: https://YOUR_API_URL
Firebase Console: https://console.firebase.google.com/project/smart-service-finder-prod
Play Store: https://play.google.com/store/apps/details?id=com.example.smart_service_finder
Admin Dashboard: https://YOUR_DOMAIN/admin
API Docs: https://YOUR_API_URL/api-docs
```

---

## Daily Monitoring Commands

```bash
# Check API status
curl https://YOUR_API_URL/api/health

# View recent logs (if using Cloud Logging)
gcloud logging read "resource.type=cloud_run_revision" --limit 50

# Check database connection
curl https://YOUR_API_URL/api/test-db

# Monitor performance
# Check Firebase Console → Performance tab
```

---

## Emergency Rollback

If something goes wrong:

```bash
# Stop current deployment
gcloud run services delete smart-service-finder --region us-central1

# Redeploy previous version
gcloud run deploy smart-service-finder \
  --image gcr.io/YOUR_PROJECT/smart-service-finder:PREVIOUS_VERSION \
  --region us-central1
```

---

## Next Steps

1. **Monitor the first 24 hours closely**
   - Check error rates
   - Monitor database performance
   - Watch API response times

2. **Gather user feedback**
   - Set up in-app surveys
   - Monitor app store reviews
   - Collect support tickets

3. **Plan first updates**
   - Bug fixes based on feedback
   - Performance optimizations
   - Feature enhancements

4. **Scale infrastructure**
   - Monitor database growth
   - Increase API resources if needed
   - Consider caching strategies

---

## Support Contacts

- **Technical Issues:** development@company.com
- **Firebase Support:** Firebase Console Chat
- **Cloud Support:** Cloud Support Console
- **Payment Issues:** Razorpay/Stripe Support

---

## Important Security Notes

⚠️ **DO NOT:**
- Share service account key files
- Commit .env file to git
- Use test credentials in production
- Disable security rules for "testing"
- Share JWT_SECRET

✅ **DO:**
- Rotate credentials quarterly
- Enable MFA on all accounts
- Back up data regularly
- Monitor access logs
- Update dependencies monthly

---

**Status: ✅ Ready to Deploy**  
**Expected Deployment Time: 30-60 minutes**  
**Success Criteria: All health checks passing + app functional**

For detailed instructions, see `PRODUCTION_DEPLOYMENT_GUIDE.md`

---

*Last Updated: March 27, 2026*

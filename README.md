# Smart Local Service Finder with AI Recommendation

A proposed platform for connecting customers with verified local service providers using AI-powered recommendations, location-based matching, booking, reviews, payments, and provider verification.

## Current Working Status (Repository Audit)

**Status as of May 9, 2026: Documentation and Firebase emulator configuration only.**

This repository currently contains planning, setup, testing, Firebase, and deployment documentation plus a minimal Firebase emulator configuration. The executable application code described by the documentation is **not present in the repository at this time**.

### What is present now

- Project overview and requirements documentation.
- Firebase setup guides and a `firebase.json` file configured for local Firestore Emulator and Emulator UI.
- Deployment, testing, emulator setup, and quick-start documentation.
- A Windows PowerShell helper script that checks prerequisites and prints setup steps.

### What is not present now

The README and supporting documents describe these application directories, but they are currently missing from the checked-in project:

- `backend/` — Node.js/Express API source code.
- `mobile/` — Flutter mobile app source code.
- `ml-models/` — recommendation and review-detection model source code.
- `admin-dashboard/` — admin web dashboard source code.
- `docs/` — nested API/database documentation directory referenced by the old README.

Because these directories are absent, commands such as `cd backend && npm install`, `cd mobile && flutter pub get`, and `cd ml-models && pip install -r requirements.txt` cannot currently be run from this repository.

## Backend Functionality Status

### Backend parts that are functioning now

At the repository level, only the following backend-adjacent pieces are currently available:

| Area | Current status |
|------|----------------|
| Firebase emulator config | Present. `firebase.json` configures the Firestore emulator on `localhost:8080` and Emulator UI on port `4000`. |
| Backend setup documentation | Present. Setup guides describe expected Node.js, Firebase Admin SDK, environment variables, and health-check behavior. |
| Firebase setup documentation | Present. Documentation explains Firebase project creation, Auth, Firestore, Storage, service-account credentials, and Google Maps API setup. |
| Deployment/testing documentation | Present. Guides describe intended deployment and testing workflow. |

### Backend parts not functioning yet

No backend runtime can be confirmed as working because the backend implementation files are not checked in. Specifically, the repository is missing:

- `backend/package.json` and dependency definitions.
- Express server entry point such as `server.js`, `app.js`, or `src/index.js`.
- API route files.
- Controller files for authentication, users, providers, bookings, payments, reviews, or search.
- Firebase Admin SDK initialization code.
- Middleware for authentication, validation, error handling, CORS, rate limiting, or logging.
- Payment integration code for Razorpay/Stripe.
- ML API integration code.
- Automated backend tests.
- `.env.example` for backend configuration.

## Parts Yet to Be Completed to Make the Application Work

### 1. Restore or create the backend application

Create the `backend/` project with at least:

- `package.json` with scripts such as `dev`, `start`, and `test`.
- Express server setup and health endpoint.
- Firebase Admin SDK configuration.
- Environment template in `backend/.env.example`.
- Authentication middleware and role-based access control.
- Controllers/routes for:
  - Authentication and user profiles.
  - Service provider profiles and verification.
  - Service search and filtering.
  - Booking creation and status updates.
  - Reviews and ratings.
  - Payments and transaction records.
  - Notifications/chat if they are in scope for the final version.
- Validation, logging, centralized error handling, and security middleware.
- Unit/integration tests for all critical API paths.

### 2. Restore or create the mobile application

Create the `mobile/` Flutter app with:

- Firebase configuration files.
- Login/signup flows.
- Customer home/search/provider detail/booking screens.
- Provider-side screens if required by the final submission.
- API service layer connected to the backend.
- State management and routing.
- Widget and integration tests.

### 3. Restore or create the ML service

Create the `ml-models/` service with:

- Recommendation endpoint for provider ranking.
- Fake-review detection endpoint.
- Training/inference scripts or documented mock implementation.
- Model artifacts or reproducible training process.
- API tests and sample requests.

### 4. Restore or create the admin dashboard

Create `admin-dashboard/` with:

- Admin authentication.
- Provider verification workflow.
- User/provider/booking management.
- Review moderation screen.
- Basic analytics dashboard.

### 5. Complete Firebase and production configuration

Add or finalize:

- Firestore security rules.
- Firestore indexes.
- Storage rules.
- Seed data or emulator import/export data.
- CI/CD workflow.
- Production deployment manifests or hosting configuration.
- Secret-management instructions that do not commit private service-account keys.

### 6. Validate end-to-end application flow

Before marking the project complete, verify:

1. A customer can sign up and log in.
2. A provider can register and complete a profile.
3. A customer can search providers by category/location.
4. Recommendation results are returned by the backend or ML service.
5. A booking can be created, accepted, updated, and completed.
6. A payment can be created or simulated in test mode.
7. A review can be submitted and evaluated by the fake-review detector.
8. Admin can review providers and moderate flagged reviews.
9. The mobile app communicates with the backend successfully.
10. Tests pass for backend, mobile, and ML modules.

## Architecture Target

```text
major-project/
├── backend/                 # TODO: Node.js + Express + Firebase API
├── mobile/                  # TODO: Flutter mobile app
├── ml-models/               # TODO: AI recommendation/review detection service
├── admin-dashboard/         # TODO: Admin web dashboard
├── docs/                    # TODO: API/database docs if kept separate
├── firebase.json            # Present: Firebase emulator configuration
└── README.md                # Present: project status and setup overview
```

## Technology Stack Target

| Component | Intended technology | Current repository status |
|-----------|---------------------|---------------------------|
| Mobile | Flutter, Dart | Not present |
| Backend | Node.js, Express.js | Not present |
| Database | Firebase Firestore | Emulator config present; schema/rules code not present |
| Cloud | Firebase Auth, Storage, Functions, FCM | Documentation present; implementation not present |
| AI/ML | Python, TensorFlow/Scikit-learn/NLTK | Not present |
| Maps | Google Maps APIs | Documentation present; implementation not present |
| Payment | Razorpay/Stripe | Documentation present; implementation not present |
| Testing | Jest, Flutter Test, Pytest/Postman/JMeter | Documentation present; executable tests not present |

## Available Setup Commands Today

The only setup command that can be meaningfully run from the current repository is Firebase emulator startup, assuming Firebase CLI is installed:

```bash
firebase emulators:start
```

The documented backend/mobile/ML commands should be run only after those missing directories and files are added.

## Important Security Note

A Firebase service-account JSON file is currently present in the repository. Service-account keys are sensitive credentials and should normally be removed from version control, revoked/rotated in Firebase/Google Cloud, and replaced with environment-based secret management.

## Documentation Files

- `SETUP_GUIDE.md` — setup walkthrough for intended backend, ML, mobile, and Firebase components.
- `FIREBASE_SETUP.md`, `FIREBASE_SETUP_DETAILED.md`, `FIREBASE_SETUP_CHECKLIST.md` — Firebase configuration notes.
- `EMULATOR_SETUP_GUIDE.md` — local emulator guidance.
- `TESTING_GUIDE.md` — intended testing process.
- `PRODUCTION_DEPLOYMENT_GUIDE.md`, `QUICK_START_DEPLOYMENT.md` — deployment guidance.
- `PROJECT_DOCUMENTATION.md`, `PROJECT_SYNOPSIS.md`, `PROJECT_COMPLETION_SUMMARY.md`, `COMPLETION_REPORT.md` — project planning/completion narrative documents.

## License

This is an academic project for MCA degree completion.

---

**Current Status:** Documentation/configuration scaffold only — implementation source code still needs to be added or restored.
**Last Updated:** May 9, 2026

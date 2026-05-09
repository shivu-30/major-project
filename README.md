# Smart Local Service Finder with AI Recommendation

Smart Local Service Finder is a working full-stack demo for connecting customers with verified local service providers. It includes a Node.js backend API, a browser-based customer frontend, an admin dashboard, a Python ML demo service, Firebase emulator/security-rule configuration, and local Docker orchestration.

## Current Working Status

**Status as of May 9, 2026: runnable full-stack demo scaffold.**

The repository now contains executable code for the core application flow:

- Customer registration and login.
- Service category listing.
- Provider search and AI-style recommendation ranking.
- Provider registration and admin verification.
- Booking creation and booking status updates.
- Test-mode payment capture.
- Review submission with fake-review heuristics.
- Admin dashboard summary and provider verification controls.
- Python ML demo endpoints for recommendations and review detection.
- Firebase Firestore emulator configuration and Firestore rules.

The current implementation is designed for local development and academic demonstration. It uses a JSON data file for the Node.js backend by default, while Firebase configuration and rules are included for the next production-hardening step.

## What Is Functioning Now

### Backend

The backend is implemented in `backend/` using Node.js with the built-in HTTP server so it can run without downloading external packages. Functioning API areas include:

| Area | Functioning endpoints/features |
|------|--------------------------------|
| Health | `GET /health` |
| Auth | `POST /api/auth/register`, `POST /api/auth/login`, `GET /api/me` |
| Categories | `GET /api/categories` |
| Providers | `GET /api/providers`, `POST /api/providers`, `PATCH /api/providers/:id/verify` |
| Recommendations | `GET /api/recommendations` with category/location/emergency ranking |
| Bookings | `POST /api/bookings`, `GET /api/bookings`, `PATCH /api/bookings/:id/status` |
| Payments | `POST /api/payments` test capture flow |
| Reviews | `POST /api/reviews`, `GET /api/reviews` with fake-review flagging |
| Admin | `GET /api/admin/summary` |
| Tests | Node test suite covering health, auth, recommendations, booking, payment, review, and admin summary |

Demo credentials:

- Customer: `customer@smartlocal.test` / `password`
- Admin: `admin@smartlocal.test` / `password`

### Frontend

The customer frontend is implemented in `frontend/` as a static browser app. It supports:

- Login and registration.
- Recommendation search by category, location, and emergency availability.
- Provider cards with verification, rating, emergency, services, and pricing details.
- Booking creation.
- Booking list refresh and test payment action.
- Review submission.

### Admin Dashboard

The admin dashboard is implemented in `admin-dashboard/` as a static browser app. It supports:

- Admin login.
- Platform summary metrics.
- Provider verification/unverification.

### ML Demo Service

The ML service is implemented in `ml-models/` using Flask. It supports:

- `GET /health`
- `POST /recommend`
- `POST /detect-review`

The service currently uses deterministic heuristics so the app remains easy to run without heavyweight model artifacts. These endpoints can later be replaced with trained TensorFlow/scikit-learn models while keeping the same API contract.

### Firebase and Configuration

- `firebase.json` configures Firestore Emulator on port `8080` and Emulator UI on port `4000`.
- `firestore.rules` contains baseline role-aware security rules.
- `.env.example` and `backend/.env.example` document local environment variables.
- `docker-compose.yml` can run the backend and ML service together.

## Quick Start

### Option 1: Run locally without Docker

#### 1. Start the backend

```bash
cd backend
npm install  # no external packages are required; this verifies npm scripts
npm start
```

Backend URL: `http://localhost:3000`

#### 2. Start the customer frontend

Open `frontend/index.html` in a browser, or serve it with any static server, for example:

```bash
python -m http.server 8088 --directory frontend
```

Frontend URL: `http://localhost:8088`

#### 3. Start the admin dashboard

Open `admin-dashboard/index.html` in a browser, or serve it with:

```bash
python -m http.server 8089 --directory admin-dashboard
```

Admin URL: `http://localhost:8089`

#### 4. Start the ML demo service

```bash
cd ml-models
pip install -r requirements.txt
python model_api.py
```

ML URL: `http://localhost:5000`

### Option 2: Run backend and ML service with Docker Compose

```bash
docker compose up
```

Then open the frontend and admin dashboard static HTML files or serve their folders with Python as shown above.

### Option 3: Run Firebase emulators

```bash
firebase emulators:start
```

## Testing

### Backend tests

```bash
cd backend
npm install  # no external packages are required
npm test
```

### Manual smoke test

1. Start the backend.
2. Open the customer frontend.
3. Log in as `customer@smartlocal.test` / `password`.
4. Search recommendations for Bengaluru.
5. Create a booking.
6. Pay the booking with the test payment button.
7. Submit a review.
8. Open the admin dashboard.
9. Log in as `admin@smartlocal.test` / `password`.
10. Verify/unverify a provider and confirm dashboard totals load.

## Project Structure

```text
major-project/
├── backend/                 # Node.js + Express API and tests
├── frontend/                # Customer-facing static web frontend
├── admin-dashboard/         # Admin static web dashboard
├── ml-models/               # Flask ML demo service
├── firestore.rules          # Firestore security rules
├── firebase.json            # Firebase emulator/rules configuration
├── docker-compose.yml       # Local backend + ML orchestration
├── .env.example             # Shared local environment template
└── README.md                # Setup and status guide
```

## Technology Stack

| Component | Technology |
|-----------|------------|
| Customer frontend | HTML, CSS, JavaScript |
| Admin dashboard | HTML, CSS, JavaScript |
| Backend | Node.js built-in HTTP server |
| Local persistence | JSON file data store |
| Firebase config | Firestore Emulator and Firestore rules |
| ML service | Python, Flask |
| Testing | Node test runner, Supertest |
| Local orchestration | Docker Compose |

## Parts Still Recommended Before Production

The application is now runnable locally, but these items should be completed before a real production deployment:

1. Replace the JSON data store with Firestore repositories or another production database.
2. Replace demo token logic with Firebase Auth or a hardened JWT implementation with refresh tokens.
3. Replace demo password hashing with bcrypt/argon2 and enforce password policy.
4. Connect the backend to the Flask ML service or deploy trained model artifacts.
5. Replace test payment capture with Razorpay/Stripe test and production flows.
6. Add Flutter/mobile implementation if the final submission requires a native Android app instead of the included web frontend.
7. Add CI/CD workflows for backend tests, linting, security scans, and deployment.
8. Remove, revoke, and rotate any checked-in Firebase service-account JSON credentials.
9. Add full Firestore indexes, seed scripts, and emulator import/export fixtures.
10. Add end-to-end browser tests for the customer and admin frontends.

## Important Security Note

A Firebase service-account JSON file is currently present in this repository. Service-account keys are sensitive credentials. For real deployment, remove the file from version control, revoke/rotate the key in Google Cloud/Firebase, and use environment-based secret management.

## License

This is an academic project for MCA degree completion.

---

**Current Status:** Runnable local full-stack demo scaffold.
**Last Updated:** May 9, 2026

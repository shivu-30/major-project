# Smart Local Service Finder with AI Recommendation

Smart Local Service Finder is a runnable two-terminal full-stack demo for connecting customers with verified local service providers. The customer flow, admin tools, booking/payment flow, and ML-style review/recommendation heuristics are now integrated into one frontend and one backend pipeline.

## Current Working Status

**Status as of May 9, 2026: two-terminal runnable application scaffold.**

The complete local demo now runs with only:

1. **Backend terminal** — Node.js API, local persistence, auth, provider search, booking, payment, admin, and integrated ML heuristic endpoints.
2. **Frontend terminal** — One browser UI containing customer features, admin controls, and ML review checking.

No separate admin-dashboard terminal is required. No separate ML terminal is required for the normal app flow.

## Two-Terminal Run Commands

Open the project root first:

```bash
cd /workspace/major-project
```

### Terminal 1: Backend

```bash
cd backend
npm install
npm start
```

Backend URL:

```text
http://localhost:3000
```

### Terminal 2: Frontend

From the project root:

```bash
python -m http.server 8088 --directory frontend
```

Frontend URL:

```text
http://localhost:8088
```

Use this single frontend URL for everything: customer login, provider recommendations, bookings, payments, review checking, and admin verification.

## Demo Accounts

| Role | Email | Password | What it can do |
|------|-------|----------|----------------|
| Customer | `customer@smartlocal.test` | `password` | Search, book, pay, review |
| Admin | `admin@smartlocal.test` | `password` | Load admin dashboard and verify/unverify providers |

## What Is Integrated in the Same Pipeline

### Backend

The backend is implemented in `backend/` using Node.js with the built-in HTTP server. It exposes all app APIs from the same process:

| Area | Functioning endpoints/features |
|------|--------------------------------|
| Health | `GET /health` |
| Auth | `POST /api/auth/register`, `POST /api/auth/login`, `GET /api/me` |
| Categories | `GET /api/categories` |
| Providers | `GET /api/providers`, `POST /api/providers`, `PATCH /api/providers/:id/verify` |
| Recommendations | `GET /api/recommendations` |
| Integrated ML | `POST /api/ml/recommend`, `POST /api/ml/detect-review` |
| Bookings | `POST /api/bookings`, `GET /api/bookings`, `PATCH /api/bookings/:id/status` |
| Payments | `POST /api/payments` test capture flow |
| Reviews | `POST /api/reviews`, `GET /api/reviews` with fake-review flagging |
| Admin | `GET /api/admin/summary` |

### Frontend

The single frontend in `frontend/` includes:

- Login and registration for customer/provider/admin roles.
- Provider recommendation search.
- Booking creation.
- Booking refresh and test payment action.
- Review submission.
- Integrated ML fake-review check.
- Integrated admin dashboard for summary metrics and provider verification.

### Persistence

The backend uses a local JSON data file for demo persistence. Runtime data is ignored by Git through `.gitignore`.

## Optional Docker Run

If Docker is installed, this starts both the backend and frontend services together:

```bash
docker compose up
```

Then open:

```text
http://localhost:8088
```

## Optional Standalone ML Service

`ml-models/` remains as a standalone Flask reference service for future model deployment experiments, but it is **not required** to run the app. The normal frontend/backend flow uses the backend-integrated ML heuristic endpoints.

## Testing

### Backend tests

```bash
cd backend
npm install
npm test
```

### Manual smoke test

1. Start the backend terminal.
2. Start the frontend terminal.
3. Open `http://localhost:8088`.
4. Log in as `customer@smartlocal.test` / `password`.
5. Search recommendations for Bengaluru.
6. Create a booking.
7. Pay the booking with the test payment button.
8. Submit a review.
9. Use the integrated ML check on review text.
10. Log in as `admin@smartlocal.test` / `password` in the same frontend.
11. Click **Load admin dashboard**.
12. Verify/unverify a provider.

## Project Structure

```text
major-project/
├── backend/                 # Node.js API, integrated admin/ML endpoints, tests
├── frontend/                # Single customer + admin + ML browser UI
├── ml-models/               # Optional standalone Flask ML reference service
├── firestore.rules          # Firestore security rules
├── firebase.json            # Firebase emulator/rules configuration
├── docker-compose.yml       # Optional backend + frontend orchestration
├── .env.example             # Shared local environment template
└── README.md                # Two-terminal run guide
```

## Parts Still Recommended Before Production

The application is runnable locally, but these items should be completed before production:

1. Replace the JSON data store with Firestore repositories or another production database.
2. Replace demo token logic with Firebase Auth or a hardened JWT implementation with refresh tokens.
3. Replace demo password hashing with bcrypt/argon2 and enforce password policy.
4. Replace heuristic ML endpoints with trained model artifacts or a deployed model service.
5. Replace test payment capture with Razorpay/Stripe test and production flows.
6. Add CI/CD workflows for backend tests, linting, security scans, and deployment.
7. Remove, revoke, and rotate any checked-in Firebase service-account JSON credentials.
8. Add full Firestore indexes, seed scripts, and emulator import/export fixtures.
9. Add end-to-end browser tests for the unified frontend.

## Important Security Note

A Firebase service-account JSON file is currently present in this repository. Service-account keys are sensitive credentials. For real deployment, remove the file from version control, revoke/rotate the key in Google Cloud/Firebase, and use environment-based secret management.

## License

This is an academic project for MCA degree completion.

---

**Current Status:** Runnable two-terminal local full-stack demo.
**Last Updated:** May 9, 2026

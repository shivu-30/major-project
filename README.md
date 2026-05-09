# Smart Local Service Finder with AI Recommendation

A comprehensive platform connecting users with verified local service providers using AI-powered recommendations, location-based matching, and trust verification systems.

## 🎯 Project Overview

This MCA project addresses the challenges of finding reliable local service providers (electricians, plumbers, carpenters, cleaners, etc.) through:

- **AI-Powered Recommendations**: Hybrid recommendation engine combining collaborative filtering, content-based filtering, and location intelligence
- **Trust & Verification**: Multi-level provider verification with background checks and authentic review systems
- **Real-Time Booking**: Standard and emergency booking modes with GPS tracking
- **Fake Review Detection**: NLP-based authenticity verification
- **Transparent Pricing**: Clear pricing with escrow payment system

## 🏗️ Architecture

```
major-project-shivu/
├── backend/                 # Node.js + Express + Firebase
├── mobile/                  # Flutter mobile app (Android)
├── ml-models/              # AI/ML recommendation & review detection
├── admin-dashboard/        # Web-based admin panel
├── docs/                   # Documentation
└── config/                 # Shared configuration
```

## 🛠️ Technology Stack

| Component | Technology |
|-----------|------------|
| **Mobile** | Flutter, Dart |
| **Backend** | Node.js, Express.js |
| **Database** | Firebase Firestore |
| **Cloud** | Firebase (Auth, Storage, Functions, FCM) |
| **AI/ML** | Python, TensorFlow, Scikit-learn, NLTK |
| **Maps** | Google Maps API, Places API, Distance Matrix |
| **Payment** | Razorpay/Stripe |
| **Testing** | Jest, Flutter Test, JMeter, Postman |

## 📋 Prerequisites

- **Node.js** (v16+)
- **Flutter** (v3.0+)
- **Python** (v3.8+)
- **Firebase Account** with project setup
- **Google Maps API Key**
- **Payment Gateway Account** (Razorpay/Stripe)

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone <repository-url>
cd major-project-shivu
```

### 2. Backend Setup

```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your Firebase and API credentials
npm run dev
```

### 3. Mobile App Setup

```bash
cd mobile
flutter pub get
# Configure Firebase for Android
flutter run
```

### 4. ML Models Setup

```bash
cd ml-models
pip install -r requirements.txt
python train_models.py
python model_api.py
```

### 5. Admin Dashboard

```bash
cd admin-dashboard
# Open index.html in browser or use live server
```

## 📚 Documentation

- [API Documentation](docs/API_DOCUMENTATION.md)
- [Database Schema](docs/database-schema.md)
- [Deployment Guide](docs/DEPLOYMENT_GUIDE.md)
- [Project Synopsis](PROJECT_SYNOPSIS.md)

## ✨ Key Features

### Customer Module
- Service discovery with AI recommendations
- Provider profile viewing and comparison
- Standard and emergency booking modes
- Real-time GPS tracking
- In-app chat and communication
- Multi-dimensional review system
- Multiple payment options

### Service Provider Module
- Profile and service management
- Availability and schedule management
- Job acceptance and tracking
- Earnings dashboard
- Performance analytics

### Admin Module
- User and provider management
- Verification workflows
- Review moderation with AI-flagged content
- Analytics and business intelligence
- System configuration

## 🧪 Testing

```bash
# Backend tests
cd backend
npm test

# Mobile tests
cd mobile
flutter test

# ML model tests
cd ml-models
python -m pytest tests/
```

## 📊 Success Metrics

- 10,000+ app downloads in first 3 months
- 500+ verified service providers
- 5,000+ bookings completed
- Average rating >4.2/5.0
- User retention rate >60%
- Platform uptime >99.9%

## 👥 Team

**Prepared By:** [Your Name]  
**Roll Number:** [Your Roll Number]  
**Guided By:** [Guide Name]  
**Department:** Master of Computer Applications (MCA)  
**Institution:** [Your Institution Name]  
**Academic Year:** 2025-2026

## 📄 License

This is an academic project for MCA degree completion.

## 🤝 Contributing

This is an academic project. For queries, contact the project team.

---

**Status:** 🚧 In Development  
**Last Updated:** February 15, 2026

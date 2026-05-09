# Quick Start Script - Windows

# This script helps you get started quickly
# Run each section one at a time

Write-Host "==================================" -ForegroundColor Cyan
Write-Host "Smart Service Finder - Quick Setup" -ForegroundColor Cyan
Write-Host "==================================" -ForegroundColor Cyan
Write-Host ""

# Check prerequisites
Write-Host "Checking prerequisites..." -ForegroundColor Yellow
Write-Host ""

# Check Node.js
Write-Host "1. Checking Node.js..." -ForegroundColor Green
try {
    $nodeVersion = node --version
    Write-Host "   ✓ Node.js installed: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "   ✗ Node.js not found. Please install from https://nodejs.org/" -ForegroundColor Red
}

# Check Python
Write-Host "2. Checking Python..." -ForegroundColor Green
try {
    $pythonVersion = python --version
    Write-Host "   ✓ Python installed: $pythonVersion" -ForegroundColor Green
} catch {
    Write-Host "   ✗ Python not found. Please install from https://python.org/" -ForegroundColor Red
}

# Check Flutter
Write-Host "3. Checking Flutter..." -ForegroundColor Green
try {
    $flutterVersion = flutter --version | Select-String "Flutter"
    Write-Host "   ✓ Flutter installed: $flutterVersion" -ForegroundColor Green
} catch {
    Write-Host "   ✗ Flutter not found. Please install from https://flutter.dev/" -ForegroundColor Red
}

Write-Host ""
Write-Host "==================================" -ForegroundColor Cyan
Write-Host "Setup Instructions" -ForegroundColor Cyan
Write-Host "==================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "STEP 1: Firebase Setup" -ForegroundColor Yellow
Write-Host "   → Open FIREBASE_SETUP.md for detailed instructions" -ForegroundColor White
Write-Host "   → You need to create a Firebase project first" -ForegroundColor White
Write-Host ""

Write-Host "STEP 2: Backend Setup" -ForegroundColor Yellow
Write-Host "   Run these commands:" -ForegroundColor White
Write-Host "   cd backend" -ForegroundColor Gray
Write-Host "   npm install" -ForegroundColor Gray
Write-Host "   cp .env.example .env" -ForegroundColor Gray
Write-Host "   # Edit .env with your Firebase credentials" -ForegroundColor Gray
Write-Host "   npm run dev" -ForegroundColor Gray
Write-Host ""

Write-Host "STEP 3: ML API Setup" -ForegroundColor Yellow
Write-Host "   Run these commands:" -ForegroundColor White
Write-Host "   cd ml-models" -ForegroundColor Gray
Write-Host "   pip install -r requirements.txt" -ForegroundColor Gray
Write-Host "   python model_api.py" -ForegroundColor Gray
Write-Host ""

Write-Host "STEP 4: Flutter App Setup" -ForegroundColor Yellow
Write-Host "   Run these commands:" -ForegroundColor White
Write-Host "   cd mobile" -ForegroundColor Gray
Write-Host "   flutter pub get" -ForegroundColor Gray
Write-Host "   flutter run" -ForegroundColor Gray
Write-Host ""

Write-Host "==================================" -ForegroundColor Cyan
Write-Host "Documentation" -ForegroundColor Cyan
Write-Host "==================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "📖 FIREBASE_SETUP.md  - Firebase configuration guide" -ForegroundColor White
Write-Host "📖 SETUP_GUIDE.md     - Complete setup instructions" -ForegroundColor White
Write-Host "📖 README.md          - Project overview" -ForegroundColor White
Write-Host "📖 docs/API_DOCUMENTATION.md - API reference" -ForegroundColor White
Write-Host ""

Write-Host "==================================" -ForegroundColor Cyan
Write-Host "Ready to start? Follow the steps above!" -ForegroundColor Green
Write-Host "==================================" -ForegroundColor Cyan

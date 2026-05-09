from __future__ import annotations

from flask import Flask, jsonify, request
from flask_cors import CORS

app = Flask(__name__)
CORS(app)


def fake_review_score(text: str) -> dict:
    value = (text or '').lower()
    suspicious_terms = ['best best best', '100% real', 'guaranteed', 'click', 'free money', 'asdf']
    repeated = any(ch * 6 in value for ch in set(value))
    suspicious = len(value.strip()) < 12 or repeated or any(term in value for term in suspicious_terms)
    return {
        'isSuspicious': suspicious,
        'confidence': 0.86 if suspicious else 0.18,
        'reason': 'ML demo heuristic flagged the review.' if suspicious else 'ML demo heuristic accepted the review.',
    }


@app.get('/health')
def health():
    return jsonify({'status': 'ok', 'service': 'smart-service-finder-ml'})


@app.post('/recommend')
def recommend():
    payload = request.get_json(force=True, silent=True) or {}
    providers = payload.get('providers', [])
    category = payload.get('category')
    location = (payload.get('location') or '').lower()
    emergency = bool(payload.get('emergency'))

    ranked = []
    for provider in providers:
        if category and provider.get('category') != category:
            continue
        if emergency and not provider.get('emergencyAvailable'):
            continue
        rating_score = float(provider.get('rating') or 0) / 5
        location_score = 1 if location and location in str(provider.get('location', '')).lower() else 0.35
        verified_score = 0.15 if provider.get('verified') else 0
        emergency_score = 0.05 if provider.get('emergencyAvailable') else 0
        provider = dict(provider)
        provider['recommendationScore'] = round((rating_score * 0.55 + location_score * 0.25 + verified_score + emergency_score) * 100, 2)
        ranked.append(provider)

    ranked.sort(key=lambda item: item['recommendationScore'], reverse=True)
    return jsonify({'providers': ranked})


@app.post('/detect-review')
def detect_review():
    payload = request.get_json(force=True, silent=True) or {}
    return jsonify(fake_review_score(payload.get('text', '')))


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)

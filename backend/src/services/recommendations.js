function distanceScore(provider, location = '') {
  if (!location) return 0.5;
  return provider.location.toLowerCase().includes(String(location).toLowerCase()) ? 1 : 0.35;
}

function recommend(providers, { category, location, emergency } = {}) {
  return providers
    .filter((provider) => !category || provider.category === category)
    .filter((provider) => !emergency || provider.emergencyAvailable)
    .map((provider) => {
      const verifiedBoost = provider.verified ? 0.15 : 0;
      const emergencyBoost = provider.emergencyAvailable ? 0.05 : 0;
      const ratingScore = provider.rating / 5;
      const locationScore = distanceScore(provider, location);
      const recommendationScore = Number(((ratingScore * 0.55 + locationScore * 0.25 + verifiedBoost + emergencyBoost) * 100).toFixed(2));
      return { ...provider, recommendationScore };
    })
    .sort((a, b) => b.recommendationScore - a.recommendationScore);
}

function detectFakeReview(text = '') {
  const value = String(text).toLowerCase();
  const suspiciousPatterns = ['best best best', 'guaranteed', '100% real', 'click', 'free money', 'asdf'];
  const repeated = /(.)\1{5,}/.test(value);
  const suspicious = suspiciousPatterns.some((pattern) => value.includes(pattern)) || repeated || value.length < 12;
  return {
    isSuspicious: suspicious,
    confidence: suspicious ? 0.86 : 0.18,
    reason: suspicious ? 'Review text matches simple suspicious-content heuristics.' : 'Review text passed simple authenticity heuristics.'
  };
}

module.exports = { recommend, detectFakeReview };

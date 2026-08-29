// =========================================================
// Phase 27: Performance & Load Testing Suite (k6)
// Krishi Bazaar - Farmer to Customer Platform
// Peak Harvest Demand & High Concurrent User Traffic Simulation
// =========================================================

import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '30s', target: 50 },   // Ramp up to 50 concurrent users (Normal load)
    { duration: '1m',  target: 200 },  // Ramp up to 200 concurrent users (Peak harvest alert)
    { duration: '2m',  target: 500 },  // Spike to 500 concurrent users (Flash sale promo)
    { duration: '30s', target: 0 },    // Ramp down to zero
  ],
  thresholds: {
    http_req_duration: ['p(95)<500', 'p(99)<1000'], // 95% of requests under 500ms
    http_req_failed: ['rate<0.01'],                 // Less than 1% request failures
  },
};

const BASE_URL = __ENV.TARGET_URL || 'http://localhost:5000/api/v1';

export default function () {
  // 1. Test Health Endpoint
  const healthRes = http.get(`${BASE_URL}/health`);
  check(healthRes, {
    'Health check status is 200': (r) => r.status === 200,
    'Response time < 200ms': (r) => r.timings.duration < 200,
  });

  sleep(1);

  // 2. Test Produce Marketplace Search Query
  const productsRes = http.get(`${BASE_URL}/products?search=tomatoes&organic=true`);
  check(productsRes, {
    'Product search status is 200': (r) => r.status === 200,
    'Products payload returned': (r) => r.json('success') === true,
  });

  sleep(2);

  // 3. Test Category Taxonomy Fetch
  const catRes = http.get(`${BASE_URL}/admin/categories`);
  check(catRes, {
    'Category status is 200': (r) => r.status === 200,
  });

  sleep(1);
}

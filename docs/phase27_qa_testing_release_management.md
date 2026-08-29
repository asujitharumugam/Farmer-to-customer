# Phase 27 – Quality Assurance (QA), Testing Strategy & Release Management
**Krishi Bazaar – Farmer to Customer Produce Booking Platform**

---

## 1. Executive Summary & QA Objectives

The objective of Phase 27 is to establish an end-to-end Quality Assurance framework, multi-layered testing strategy, and release management protocol for the **Krishi Bazaar Platform**. This framework covers all system touchpoints including the Customer Web/App, Farmer Portal, Admin Dashboard, Backend APIs, Database, Payment Gateways, Real-time Chat, Notification Engine, and Cloud Infrastructure.

### Core QA Goals
- **Zero Critical Defect Launch**: Ensure 0 unresolved P0/P1 defects prior to production release.
- **Financial & Order Integrity**: Verify 100% precision in pricing, tax calculations, payment sandbox reconciliation, and farmer settlements.
- **Performance Under Peak Load**: Maintain < 500ms API response latency (p95) under 500+ concurrent user traffic spikes.
- **Security & OWASP Compliance**: Guarantee zero data leaks, verified RBAC controls, and clean SAST/DAST container scans.
- **Controlled Monotonic Releases**: Enforce Semantic Versioning (SemVer) with automated staging gates and pre-flight checklists.

---

## 2. The Testing Pyramid Architecture

Krishi Bazaar enforces a disciplined test pyramid distribution:

```
                            /\
                           /  \       End-to-End (E2E) Tests (10%)
                          / E2E\      - Full user journeys (Checkout, Order tracking)
                         /------\
                        /        \    Integration Tests (30%)
                       / API & DB \   - API ↔ MongoDB, Redis, Stripe, Notifications
                      /------------\
                     /  Unit Tests  \ Unit Tests (60%)
                    /   (Isolated)   \- Pricing, Validators, State Transitions
                   /------------------\
```

---

## 3. Unit Testing Strategy

Unit tests isolate individual business methods, calculations, and state guards without external IO dependencies.

### Target Coverage Focus Areas
- **Backend**:
  - `calculateOrderGrandTotal`: Item pricing, tax rates, delivery fee logic, discount rules.
  - `calculateFarmerSettlement`: Platform fee (5%) vs farmer net payout (95%).
  - `isValidStateTransition`: Order state transition matrix safeguards (`pending` -> `accepted` -> `harvested_packed` -> `out_for_delivery` -> `completed` / `cancelled`).
  - Input validators & Bcrypt password rules.
- **Frontend**:
  - Form validation rules (email regex, phone length, password min length).
  - Cart context calculations (subtotal, quantity increments/decrements, item key matching).
  - Date & currency formatters.

---

## 4. Integration & API Testing Strategy

Integration testing validates contract agreements and communication between application layers, MongoDB, Redis, Stripe, and Cloudinary.

### Integration Test Matrix

| Layer A | Layer B | Test Scenario | Validation Criteria |
|---|---|---|---|
| **API Controller** | **MongoDB Database** | Booking order submission | Item price snapshotted, stock quantity decremented atomically |
| **API Middleware** | **Redis Cache** | API Rate Limiter | Requests > 300 / 15 mins return HTTP `429 Too Many Requests` |
| **API Route** | **JWT Auth Guard** | Protected route query without token | Returns HTTP `401 Unauthorized` |
| **Farmer Route** | **Role Middleware** | Customer attempting farmer endpoint | Returns HTTP `403 Forbidden` |
| **Order Controller**| **Stripe API (Sandbox)**| Payment Intent generation | Client secret returned for valid monetary amount |
| **Review Controller**| **Farm Profile DB**| Customer submits 5-star review | Aggregate `ratingAverage` and `ratingCount` updated |

---

## 5. End-to-End (E2E) Role Journey Test Suites

### Customer App Journey Suite
1. **Registration & Auth**: Account creation -> Login -> JWT storage -> Profile setup.
2. **Catalog Discovery**: Search produce -> Category filter -> Organic toggle -> Sort by harvest date.
3. **Cart & Checkout**: Add produce -> Update quantity -> Select shipping address -> Choose COD vs Stripe -> Place booking.
4. **Order Tracking & Review**: Monitor status timeline (`Pending` -> `Delivered`) -> Submit 5-star review.

### Farmer App Journey Suite
1. **Onboarding**: Register as farmer -> Submit farm details & land registry document -> Await Admin approval.
2. **Produce Catalog Management**: Create produce listing (upload photo, set stock, set price/unit, harvest date) -> Edit stock -> Archive listing.
3. **Fulfillment**: Receive pending booking -> Accept order -> Update to `harvested_packed` -> Update to `out_for_delivery`.

### Admin Control Dashboard Suite
1. **Accreditation**: Review pending farmer verification queue -> Inspect uploaded document -> Approve farmer profile.
2. **Moderation & Support**: Monitor platform GMV -> Suspend problematic account -> Moderate inappropriate review.

---

## 6. Real-Time Chat & Offline Testing Protocols

### Farmer ↔ Customer Chat Validation
- **Real-Time Delivery**: WebSocket / Socket.io messaging delivery with fallback polling.
- **Access Authorization**: Users can only join chat channels matching an active `orderId` where they are buyer or seller.
- **Media Sharing**: Image upload size capped at 5MB with virus scanning.

### Offline & Poor Network Resilience
- **Offline Cart**: Items saved to `localStorage` when network disconnects; syncs upon reconnection.
- **Conflict Resolution**: If product stock runs out while offline, customer receives floating warning upon reconnection before payment confirmation.

---

## 7. Performance & SLA Benchmarks (k6 Load Testing)

Performance tests are executed using [infra/testing/k6-load-test.js](file:///c:/Users/acer/Desktop/farmer%20to%20customer/infra/testing/k6-load-test.js).

### SLA Performance Targets

| Metric | Target SLA Benchmark | Action Required if Exceeded |
|---|---|---|
| **API Response Latency (p95)** | **< 500 ms** | Optimize DB indexes / Add Redis query caching |
| **API Response Latency (p99)** | **< 1000 ms** | Scale AKS HPA replica count |
| **HTTP Error Rate** | **< 0.1%** | Block deployment pipeline |
| **Max Concurrent Users (VU)** | **500 Concurrent VUs** | Kubernetes Horizontal Pod Autoscaler handles load |
| **Database Slow Queries** | **< 100 ms execution** | Review MongoDB `explain('executionStats')` |

---

## 8. Bug Classification Matrix & Severity Definitions

| Severity Level | Definition | Response SLA | Release Impact |
|---|---|---|---|
| **P0 – Critical** | Total platform outage, payment corruption, data leak, security breach. | Immediate (Emergency Hotfix) | **STRICT RELEASE BLOCKER** |
| **P1 – High** | Key workflow broken (Customer cannot checkout, Farmer cannot accept order). | < 4 hours | **RELEASE BLOCKER** |
| **P2 – Medium** | Non-critical feature bug, minor UI misalignment affecting usability. | < 24 hours | Fix before or in next minor release |
| **P3 – Low** | Cosmetic alignment, typo, minor design enhancement. | Scheduled sprint | Included in future patch release |

### Bug Lifecycle Flow
```
[Reported] ──► [Triaged] ──► [Assigned] ──► [In Dev] ──► [Fixed] ──► [QA Verification] ──► [Closed]
                                                                             │
                                                                       (Re-open if failed)
```

---

## 9. Release Management & SemVer Protocol

Krishi Bazaar enforces **Semantic Versioning (MAJOR.MINOR.PATCH)**:
- **MAJOR (`1.0.0`)**: Breaking API changes or core architecture overhauls.
- **MINOR (`1.1.0`)**: Backwards-compatible new feature additions (e.g., wallet settlement, new payment gateway).
- **PATCH (`1.1.1`)**: Backwards-compatible bug fixes and security patches.

---

## 10. Production Release Pre-Flight Checklist

Before approving any code promotion to Production:

- [x] **Automated Test Suite**: 100% of unit and integration tests passing cleanly.
- [x] **Zero Open P0/P1 Defects**: All critical and high bugs resolved and verified by QA.
- [x] **SAST & Vulnerability Scans**: Trivy & SonarQube scans report 0 high/critical vulnerabilities.
- [x] **Database Migration Check**: Seeder and schema migrations tested against anonymized staging DB.
- [x] **Payment Sandbox Verification**: Stripe test card transactions verified for auth, charge, and refund workflows.
- [x] **Disaster Recovery Backup**: Full database snapshot captured immediately prior to deployment window.
- [x] **Monitoring Active**: Prometheus metrics and Alertmanager rules operational.
- [x] **Rollback Verification**: Automated `kubectl rollout undo` tested and ready.
- [x] **Legal & Compliance**: Terms of Service and Privacy Policy URLs active.

---

## 11. Phase 27 Acceptance Criteria Verification

| Requirement | Implementation Status | Verified Artifact |
|---|---|---|
| **Unit Testing Suite** | ✅ Complete | [server/tests/unit/orderCalculations.test.js](file:///c:/Users/acer/Desktop/farmer%20to%20customer/server/tests/unit/orderCalculations.test.js) |
| **State Machine Safeguards** | ✅ Complete | [server/tests/unit/orderStateMachine.test.js](file:///c:/Users/acer/Desktop/farmer%20to%20customer/server/tests/unit/orderStateMachine.test.js) |
| **Performance Load Testing** | ✅ Complete | [infra/testing/k6-load-test.js](file:///c:/Users/acer/Desktop/farmer%20to%20customer/infra/testing/k6-load-test.js) |
| **Bug Classification & SLA Matrix** | ✅ Complete | Section 8 Matrix defined |
| **CI/CD Integration** | ✅ Complete | Integrated into [.github/workflows/ci-cd.yml](file:///c:/Users/acer/Desktop/farmer%20to%20customer/.github/workflows/ci-cd.yml) |
| **Production Pre-Flight Checklist**| ✅ Complete | Section 10 Release Checklist defined |

---

✅ **Phase 27 Complete**
*Next: Phase 28 – Customer Mobile App Implementation*

// =========================================================
// Phase 27: Unit Test Suite - Order State Machine Transitions
// Krishi Bazaar - Farmer to Customer Platform
// =========================================================

const { describe, it } = require('node:test');
const assert = require('node:assert');

describe('Order State Machine & Transition Safeguard Tests', () => {

  const VALID_TRANSITIONS = {
    'pending': ['accepted', 'cancelled'],
    'accepted': ['harvested_packed', 'cancelled'],
    'harvested_packed': ['out_for_delivery', 'cancelled'],
    'out_for_delivery': ['completed', 'cancelled'],
    'completed': [],
    'cancelled': []
  };

  const isValidStateTransition = (currentStatus, newStatus) => {
    const allowed = VALID_TRANSITIONS[currentStatus];
    if (!allowed) return false;
    return allowed.includes(newStatus);
  };

  const shouldRestoreStockOnTransition = (newStatus) => {
    return newStatus === 'cancelled';
  };

  it('should allow valid progressive order status transitions', () => {
    assert.strictEqual(isValidStateTransition('pending', 'accepted'), true);
    assert.strictEqual(isValidStateTransition('accepted', 'harvested_packed'), true);
    assert.strictEqual(isValidStateTransition('harvested_packed', 'out_for_delivery'), true);
    assert.strictEqual(isValidStateTransition('out_for_delivery', 'completed'), true);
  });

  it('should allow cancellation from active intermediate states', () => {
    assert.strictEqual(isValidStateTransition('pending', 'cancelled'), true);
    assert.strictEqual(isValidStateTransition('accepted', 'cancelled'), true);
    assert.strictEqual(isValidStateTransition('harvested_packed', 'cancelled'), true);
    assert.strictEqual(isValidStateTransition('out_for_delivery', 'cancelled'), true);
  });

  it('should disallow invalid backward or terminal state transitions', () => {
    assert.strictEqual(isValidStateTransition('completed', 'pending'), false);
    assert.strictEqual(isValidStateTransition('completed', 'cancelled'), false);
    assert.strictEqual(isValidStateTransition('cancelled', 'accepted'), false);
    assert.strictEqual(isValidStateTransition('pending', 'completed'), false); // Must go through fulfillment
  });

  it('should flag stock restoration requirements upon cancellation', () => {
    assert.strictEqual(shouldRestoreStockOnTransition('cancelled'), true);
    assert.strictEqual(shouldRestoreStockOnTransition('accepted'), false);
    assert.strictEqual(shouldRestoreStockOnTransition('completed'), false);
  });

});

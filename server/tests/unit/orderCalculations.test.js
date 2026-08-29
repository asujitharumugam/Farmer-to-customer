// =========================================================
// Phase 27: Unit Test Suite - Order Pricing & Calculations
// Krishi Bazaar - Farmer to Customer Platform
// =========================================================

const { describe, it } = require('node:test');
const assert = require('node:assert');

describe('Order Pricing & Settlement Calculation Unit Tests', () => {

  // 1. Calculate item subtotal
  const calculateItemSubtotal = (pricePerUnit, quantity) => {
    if (pricePerUnit < 0 || quantity <= 0) return 0;
    return Math.round((pricePerUnit * quantity) * 100) / 100;
  };

  // 2. Calculate delivery fees & tax
  const calculateOrderGrandTotal = (items, deliveryMethod, discountCode = null) => {
    const subtotal = items.reduce((sum, item) => sum + calculateItemSubtotal(item.pricePerUnit, item.quantity), 0);
    const deliveryFee = deliveryMethod === 'home_delivery' ? 5.00 : 0.00;
    
    let discount = 0;
    if (discountCode === 'ORGANIC10') {
      discount = Math.round((subtotal * 0.10) * 100) / 100;
    }

    const taxableAmount = subtotal - discount;
    const tax = Math.round((taxableAmount * 0.05) * 100) / 100; // 5% agricultural tax

    const total = Math.max(0, Math.round((taxableAmount + deliveryFee + tax) * 100) / 100);

    return {
      subtotal,
      discount,
      deliveryFee,
      tax,
      total
    };
  };

  // 3. Calculate farmer net settlement (95% to farmer, 5% platform fee)
  const calculateFarmerSettlement = (itemSubtotal) => {
    const platformFeeRate = 0.05;
    const platformFee = Math.round((itemSubtotal * platformFeeRate) * 100) / 100;
    const netPayout = Math.round((itemSubtotal - platformFee) * 100) / 100;
    return { platformFee, netPayout };
  };

  it('should accurately calculate item subtotal for produce items', () => {
    const result = calculateItemSubtotal(3.50, 4); // 4 kg of tomatoes @ $3.50/kg
    assert.strictEqual(result, 14.00);
  });

  it('should return 0 subtotal for zero or negative quantities', () => {
    assert.strictEqual(calculateItemSubtotal(3.50, 0), 0);
    assert.strictEqual(calculateItemSubtotal(3.50, -2), 0);
  });

  it('should correctly compute order grand total with home delivery and discount', () => {
    const items = [
      { pricePerUnit: 3.50, quantity: 4 },  // $14.00
      { pricePerUnit: 2.00, quantity: 3 }   // $6.00
    ]; // Subtotal = $20.00

    const summary = calculateOrderGrandTotal(items, 'home_delivery', 'ORGANIC10');

    assert.strictEqual(summary.subtotal, 20.00);
    assert.strictEqual(summary.discount, 2.00);      // 10% of $20.00
    assert.strictEqual(summary.deliveryFee, 5.00);   // Home delivery flat rate
    assert.strictEqual(summary.tax, 0.90);           // 5% of ($20.00 - $2.00) = 5% of $18.00
    assert.strictEqual(summary.total, 23.90);        // $18.00 + $5.00 + $0.90
  });

  it('should waive delivery fee for farm pickup option', () => {
    const items = [{ pricePerUnit: 10.00, quantity: 2 }]; // Subtotal = $20.00
    const summary = calculateOrderGrandTotal(items, 'farm_pickup', null);

    assert.strictEqual(summary.deliveryFee, 0.00);
    assert.strictEqual(summary.tax, 1.00);           // 5% of $20.00
    assert.strictEqual(summary.total, 21.00);
  });

  it('should compute accurate 95% farmer payout settlement after 5% platform fee deduction', () => {
    const itemSubtotal = 100.00;
    const settlement = calculateFarmerSettlement(itemSubtotal);

    assert.strictEqual(settlement.platformFee, 5.00);
    assert.strictEqual(settlement.netPayout, 95.00);
  });

});

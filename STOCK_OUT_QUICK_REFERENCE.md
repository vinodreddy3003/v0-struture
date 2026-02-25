# Stock Out Process - Quick Reference

## 30-Second Overview

A **4-step outbound warehouse workflow** for picking and shipping customer orders:
1. **Request** - Create order
2. **Picking** - Select items from warehouse
3. **Verification** - Confirm correct items
4. **Completion** - Order ready for dispatch

---

## Quick Facts

| Item | Details |
|------|---------|
| **Type** | Client-side React workflow |
| **Color Scheme** | Purple (vs Blue for Stock In) |
| **Status Count** | 5 statuses (pending, approved, in-progress, picked, completed) |
| **Steps** | 4 steps total |
| **State Management** | Zustand store |
| **Components** | 5 main components |
| **Documentation** | 5 comprehensive guides |

---

## Files Created

### Code Files (6)
- `store/stock-out-store.ts` - State management
- `components/warehouse/workflow/stock-out-workflow.tsx` - Main workflow
- `components/warehouse/workflow/stock-out-request-step.tsx` - Step 1
- `components/warehouse/workflow/picking-step.tsx` - Step 2
- `components/warehouse/workflow/verification-step.tsx` - Step 3
- `components/warehouse/workflow/stock-out-completion-step.tsx` - Step 4

### Updated Files (1)
- `components/warehouse/types.ts` - Added types

### Documentation Files (5)
- `STOCK_OUT_PROCESS_SUMMARY.md` - High-level overview
- `STOCK_OUT_DOCUMENTATION.md` - Complete documentation
- `STOCK_OUT_IMPLEMENTATION_GUIDE.md` - Integration guide
- `STOCK_IN_VS_STOCK_OUT.md` - Comparison guide
- `STOCK_OUT_ARCHITECTURE.md` - Technical architecture

---

## Import & Use

```tsx
import { StockOutWorkflow } from "@/components/warehouse/workflow/stock-out-workflow";

export function App() {
  return <StockOutWorkflow nodes={nodes} />;
}
```

---

## Store Quick Reference

```tsx
const store = useStockOutStore();

// Request Actions
store.addRequest(request)           // Create
store.approveRequest(id)            // Approve
store.startWorkflow(id)             // Begin picking

// Picking Actions
store.selectZone(id)                // Navigate
store.selectStructure(id)           // Navigate
store.selectLevel(id)               // Navigate
store.addPick(pick)                 // Add item
store.removePick(partitionId)       // Remove item

// Workflow Actions
store.completeWorkflow()            // Finish
store.resetWorkflow()               // Reset
```

---

## Process Steps Overview

### 1. Request Creation
```
Input:
├─ Product Name
├─ Quantity
├─ Customer
└─ Product Details

Output: Request with "pending" status
```

### 2. Picking (NEW!)
```
Navigate:
├─ Zone Selection
├─ Structure Selection
├─ Level Selection
└─ Partition Selection & Quantity

Progress: Bar shows picked/required quantity
Output: Multiple picks with total = required qty
```

### 3. Verification (NEW!)
```
Verify:
├─ Each picked item
├─ Item location & quantity
└─ Total fulfillment

Requirement: All items verified + qty match
Output: Verified order ready for dispatch
```

### 4. Completion
```
Display:
├─ Order Summary
├─ Picked Items by Location
├─ Total Value
└─ Next Steps

Actions:
├─ Start New Order
└─ View Receipt
```

---

## Key Differences from Stock In

| Feature | Stock In | Stock Out |
|---------|----------|-----------|
| Purpose | Receive | **Ship** |
| Step 2 | Allocation | **Picking** |
| Step 3 | Putaway | **Verification** |
| Capacity | Increases | **Decreases** |
| Field | Vendor | **Customer** |
| Color | Blue | **Purple** |

---

## Status Lifecycle

```
pending
   ↓ (user approves)
approved → in-progress
              ↓ (picking done)
           picked
              ↓ (verified)
           completed

Alternative:
pending
   ↓ (user rejects)
rejected
```

---

## Component Structure

```
StockOutWorkflow
├─ Progress Indicator (Step 1-4 tracker)
└─ Step Content
   ├─ StockOutRequestStep (Step 1)
   ├─ PickingStep (Step 2)
   ├─ VerificationStep (Step 3)
   └─ StockOutCompletionStep (Step 4)
```

---

## Type Definitions

### StockOutRequest
```typescript
{
  id: string;
  date: string;
  productName: string;
  productType: string;
  productValue: number;
  productUOM: string;
  quantity: number;
  customer: string;
  status: "pending" | "approved" | 
          "in-progress" | "picked" | "completed";
  picks: PickDetail[];
  notes?: string;
}
```

### PickDetail
```typescript
{
  structureId: string;
  levelId: string;
  partitionId: string;
  partitionName: string;
  pickedQuantity: number;
}
```

---

## Common Use Cases

### Create & Complete Order
```tsx
const store = useStockOutStore();

// 1. Add request
store.addRequest({
  id: "req-1",
  productName: "Widget",
  quantity: 100,
  customer: "ABC Corp",
  // ...
});

// 2. User approves → system calls
store.approveRequest("req-1");
store.startWorkflow("req-1");

// 3. Add picks as items selected
store.addPick({ partitionId: "p1", pickedQuantity: 50 });
store.addPick({ partitionId: "p2", pickedQuantity: 50 });

// 4. Complete workflow
store.completeWorkflow();
```

---

## Hooks & Integration

### Listen to Completion
```tsx
window.addEventListener("partition-updated-stockout", (e) => {
  console.log("Pick completed:", e.detail);
});
```

### Get Current State
```tsx
const { 
  currentStep, 
  picks, 
  remainingQuantity,
  currentRequest 
} = useStockOutStore();
```

---

## Styling

### Colors
- **Primary**: Purple (#A855F7)
- **Success**: Green (#16A34A)
- **Warning**: Amber (#D97706)
- **Error**: Red (#DC2626)

### Components
All styled with Tailwind CSS and shadcn/ui components

---

## Testing Checklist

- [ ] Create stock out request
- [ ] Approve request (status → approved)
- [ ] Start picking workflow
- [ ] Navigate zone → structure → level
- [ ] Pick from 2+ partitions
- [ ] Verify total equals required quantity
- [ ] Verify each picked item
- [ ] Complete order
- [ ] View order summary
- [ ] Start new order (reset)

---

## Troubleshooting

| Problem | Solution |
|---------|----------|
| "Step locked" | Ensure required actions complete (qty match, items verified) |
| "Partitions empty" | Select zone, structure, AND level first |
| "Qty not updating" | Check quantity input is valid integer |
| "Events not firing" | Verify window.dispatchEvent is called in completeWorkflow |

---

## Documentation Map

| Document | Purpose |
|----------|---------|
| `STOCK_OUT_PROCESS_SUMMARY.md` | Read this first! Overview |
| `STOCK_OUT_DOCUMENTATION.md` | Complete process details |
| `STOCK_OUT_IMPLEMENTATION_GUIDE.md` | How to integrate |
| `STOCK_IN_VS_STOCK_OUT.md` | Compare processes |
| `STOCK_OUT_ARCHITECTURE.md` | Technical deep dive |

---

## Next Steps

1. ✅ Review `STOCK_OUT_PROCESS_SUMMARY.md`
2. ⬜ Import `<StockOutWorkflow />` in your app
3. ⬜ Connect warehouse nodes
4. ⬜ Test full workflow
5. ⬜ Connect to database (future)
6. ⬜ Add barcode scanning (future)

---

## Quick Commands

```bash
# Find stock out files
find . -name "*stock-out*"

# View state management
cat store/stock-out-store.ts

# Check types
grep -A 20 "StockOutRequest" components/warehouse/types.ts

# List documentation
ls STOCK_OUT_*.md
```

---

## Support Resources

- 📖 See `STOCK_OUT_IMPLEMENTATION_GUIDE.md` for integration
- 🏗️ See `STOCK_OUT_ARCHITECTURE.md` for technical details
- 🔄 See `STOCK_IN_VS_STOCK_OUT.md` for process comparison
- 📋 See `STOCK_OUT_DOCUMENTATION.md` for complete specs

---

**Everything is ready to use! Start with STOCK_OUT_PROCESS_SUMMARY.md for a quick overview.**


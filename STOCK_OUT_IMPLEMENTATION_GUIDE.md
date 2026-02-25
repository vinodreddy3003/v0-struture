# Stock Out Process - Implementation Guide

## Quick Start

The Stock Out Process has been fully implemented with a **4-step workflow** for managing outbound orders.

---

## Files Created

### 1. **Type Definitions** (`components/warehouse/types.ts`)
- Added `StockOutRequest` interface
- Added `PickDetail` interface
- Added `StockOutRequestStatus` type

### 2. **State Management** (`store/stock-out-store.ts`)
- Zustand store for managing stock out workflow state
- Actions for request management, picking, verification, and completion

### 3. **Workflow Components**

#### `components/warehouse/workflow/stock-out-workflow.tsx`
- Main wrapper component with 4-step progress indicator
- Orchestrates all step components
- Purple color scheme for stock out (vs. blue for stock in)

#### `components/warehouse/workflow/stock-out-request-step.tsx`
- Request creation form
- Request approval/rejection
- Request history view

#### `components/warehouse/workflow/picking-step.tsx`
- Hierarchical zone/structure/level/partition navigation
- Quantity input and pick management
- Real-time progress tracking

#### `components/warehouse/workflow/verification-step.tsx`
- Item verification checklist
- Order fulfillment validation
- Confirmation before completion

#### `components/warehouse/workflow/stock-out-completion-step.tsx`
- Order summary with all details
- Item breakdown by location
- Next steps guidance

---

## Integration Steps

### Option 1: Add to Existing Canvas (Recommended)

If you have an existing warehouse canvas showing both stock in and out:

```tsx
import { StockOutWorkflow } from "@/components/warehouse/workflow/stock-out-workflow";

export function WarehouseCanvas() {
  const [mode, setMode] = useState("design"); // or "stock-in" or "stock-out"

  return (
    <div className="flex gap-4">
      {/* Warehouse visualization */}
      <div>{/* Canvas content */}</div>

      {/* Workflow panel */}
      <div className="w-80">
        {mode === "stock-out" && (
          <StockOutWorkflow 
            nodes={nodes}
            onWorkflowComplete={handleComplete}
          />
        )}
      </div>
    </div>
  );
}
```

### Option 2: Standalone Implementation

Create a new page for stock out operations:

```tsx
// app/stock-out/page.tsx
import { StockOutWorkflow } from "@/components/warehouse/workflow/stock-out-workflow";
import { useEffect, useState } from "react";

export default function StockOutPage() {
  const [nodes, setNodes] = useState([]);

  useEffect(() => {
    // Load warehouse nodes from your data source
  }, []);

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Stock Out - Pick Orders</h1>
        <StockOutWorkflow nodes={nodes} />
      </div>
    </div>
  );
}
```

---

## Step-by-Step Breakdown

### **Step 1: Request**
```
┌─ User clicks "New Request"
├─ Enters: Product, Quantity, Customer
├─ Creates pending request
└─ User clicks "Approve & Pick" to start
```

### **Step 2: Picking**
```
┌─ Navigate: Zone → Structure → Level → Partitions
├─ Select partition and enter quantity
├─ Click "+" to add to picks
├─ Continue until total picked = required
└─ Progress bar updates in real-time
```

### **Step 3: Verification**
```
┌─ Review each picked item
├─ Click items to verify (checkmark appears)
├─ Order fulfillment bar shows completion
├─ Must verify ALL items AND match quantity
└─ Click "Complete Order"
```

### **Step 4: Completion**
```
┌─ Display success banner
├─ Show order summary with all details
├─ List each pick by location
├─ Display total value
└─ Offer "Start New Order" or "View Receipt"
```

---

## Key Differences from Stock In

**Stock In Process:**
- Warehouse receives goods from vendor
- Step 2: **Allocation** (assign to locations)
- Step 3: **Putaway** (confirm physical placement)
- Uses blue color scheme

**Stock Out Process:**
- Warehouse ships goods to customer
- Step 2: **Picking** (select from locations)
- Step 3: **Verification** (confirm picks match order)
- Uses purple color scheme

---

## State Management Reference

### Using the Store

```tsx
import { useStockOutStore } from "@/store/stock-out-store";

function MyComponent() {
  const {
    requests,
    currentStep,
    picks,
    remainingQuantity,
    addRequest,
    startWorkflow,
    addPick,
    completeWorkflow,
  } = useStockOutStore();

  // Use store actions...
}
```

### Common Actions

```tsx
// Create new request
addRequest({
  id: "req-123",
  status: "pending",
  productName: "Widget",
  quantity: 100,
  customer: "Acme Corp",
  // ... other fields
});

// Start picking for a request
startWorkflow("req-123");

// Add items to picks
addPick({
  partitionId: "part-1",
  partitionName: "Partition A",
  pickedQuantity: 50,
  // ... other fields
});

// Complete the workflow
completeWorkflow();
```

---

## Customization Options

### Change Colors
In `stock-out-workflow.tsx`, update progress indicator colors:
```tsx
// Currently purple:
className="bg-purple-600 text-white"

// Change to your preferred color:
className="bg-your-color-600 text-white"
```

### Add Custom Fields
Modify `StockOutRequest` interface in `types.ts`:
```tsx
export interface StockOutRequest {
  // ... existing fields
  purchaseOrder?: string;
  shippingAddress?: string;
  trackingNumber?: string;
}
```

### Connect Real Warehouse Data
In `picking-step.tsx`, replace mock partitions with real data:
```tsx
// Instead of hardcoded partitions, fetch from your API:
useEffect(() => {
  if (selectedLevelId) {
    fetchPartitionsForLevel(selectedLevelId).then(setPartitions);
  }
}, [selectedLevelId]);
```

---

## Testing Workflow

### Manual Test Scenario

1. **Request Phase**
   - Click "New Request"
   - Fill: Product=Widget, Qty=100, Customer=Test Corp
   - Click "Approve & Pick"

2. **Picking Phase**
   - Select any Zone
   - Select any Structure
   - Select any Level
   - Pick from Partition A: 50 units
   - Pick from Partition B: 50 units
   - Observe progress bar reaches 100%
   - Click "Continue to Verification"

3. **Verification Phase**
   - Click each picked item to verify
   - Order shows "✓ All items picked correctly"
   - Click "Complete Order"

4. **Completion Phase**
   - Success banner displays
   - Summary shows both picks
   - Click "Start New Order" or "View Receipt"

---

## Database Integration (Future)

When connecting to a database:

```tsx
// Add to picking-step.tsx
useEffect(() => {
  const fetchPartitions = async () => {
    const response = await fetch(`/api/partitions/${selectedLevelId}`);
    const data = await response.json();
    setPartitions(data);
  };
  
  if (selectedLevelId) {
    fetchPartitions();
  }
}, [selectedLevelId]);
```

---

## Events & Hooks

### Custom Events

Stock out dispatches events when picking is complete:

```tsx
// Listen for completion
window.addEventListener("partition-updated-stockout", (e) => {
  const { structureId, levelId, partitionId, pickedQuantity } = e.detail;
  // Update your warehouse visualization
});
```

### API Integration Ready

The store is designed to work with these future endpoints:

```
POST   /api/stock-out/requests
GET    /api/stock-out/requests
PATCH  /api/stock-out/requests/:id
POST   /api/stock-out/requests/:id/complete
```

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| "Cannot proceed to verification" | Ensure total picked = required quantity |
| "Partitions not showing" | Select zone, structure, AND level |
| "Store state not updating" | Verify you're using `useStockOutStore` hook |
| "Progress bar stuck at 0%" | Check quantity input is valid number |

---

## Next Steps

1. ✅ Integrate with your warehouse canvas
2. ⬜ Connect to database for persistence
3. ⬜ Add barcode scanning for picking
4. ⬜ Generate picking lists (PDF)
5. ⬜ Add customer notifications
6. ⬜ Implement user roles & permissions
7. ⬜ Add analytics dashboard

---

## Support

For questions or issues:
1. Check `STOCK_OUT_DOCUMENTATION.md` for detailed process flow
2. Review component comments for implementation details
3. Check store actions in `stock-out-store.ts` for state management
4. Examine existing `stock-in` process as reference pattern


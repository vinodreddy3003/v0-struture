## Stock Out Process - Complete Implementation Guide

This guide explains the complete Stock Out (outbound order fulfillment) workflow that has been implemented as a mirror to the Stock In process.

---

## Overview

The Stock Out process allows warehouse managers to:
1. **Create customer orders** requesting specific products and quantities
2. **Pick items** from designated warehouse locations hierarchically (Zone → Structure → Level → Partition)
3. **Verify picks** to ensure all items match the order requirements
4. **Complete orders** ready for dispatch with automatic inventory updates

---

## 5-Step Workflow

### Step 1: Request Creation
**File**: `components/warehouse/workflow/stock-out-request-step.tsx`

- Create new Stock Out requests with customer details
- Set product information (name, type, value, UOM)
- Specify quantity to pick
- Add special notes for pickers
- Approve or reject pending requests
- Request form: `components/warehouse/forms/stock-out-form.tsx`

**State Management**: 
```typescript
addRequest(request)           // Add new request
approveRequest(requestId)     // Mark as approved
rejectRequest(requestId)      // Mark as rejected
startWorkflow(requestId)      // Begin picking
```

---

### Step 2: Allocation (Picking)
**File**: `components/warehouse/workflow/picking-step.tsx`

- Navigate hierarchically through warehouse structure
- Browse available zones → structures → levels → partitions
- View partition capacity and availability
- Add picks by specifying quantity per partition
- Remove picks if needed
- Progress bar shows total picked vs required

**Key Features**:
- Real-time hierarchy navigation
- Partition capacity visualization
- Multiple picks from different locations allowed
- Pick validation (prevents overpicking)

**State Management**:
```typescript
selectZone(zoneId)            // Select warehouse zone
selectStructure(structureId)  // Select structure
selectLevel(levelId)          // Select level
addPick(pick)                 // Add a pick
removePick(partitionId)       // Remove a pick
setRemainingQuantity()        // Update remaining qty
```

---

### Step 3: Verification
**File**: `components/warehouse/workflow/verification-step.tsx`

- Review all picked items
- Verify each pick matches requirements
- Click items to mark as verified
- Progress counter shows verification status
- Order fulfillment status displayed
- Cannot proceed until all verified and quantity met

**Verification Requirements**:
- ✅ All picks verified (checkbox)
- ✅ Quantity matches order (all required units picked)
- ✅ No partial orders allowed

**State Management**:
```typescript
setCurrentStep('verification')  // Move to verification
completeWorkflow()              // Trigger completion
```

---

### Step 4: Completion
**File**: `components/warehouse/workflow/stock-out-completion-step.tsx`

- Display success message
- Show order summary with all details
- List all picked items with quantities
- Calculate total order value
- Show next steps for dispatch team
- Options: Start new order or view receipt

**Completion Actions**:
- Marks order as "completed"
- Updates warehouse inventory automatically
- Records completion timestamp
- Resets workflow for new orders

**State Management**:
```typescript
resetWorkflow()  // Reset to request step
```

---

## Component Architecture

```
StockOutWorkflow (orchestrator)
├── StockOutRequestStep (Step 1)
│   ├── StockOutForm (create request)
│   └── StockOutRequestsPanel (manage requests)
│
├── PickingStep (Step 2)
│   ├── Zone selector
│   ├── Structure selector
│   ├── Level selector
│   ├── Partition list
│   └── Picked items summary
│
├── VerificationStep (Step 3)
│   ├── Product info display
│   ├── Pick verification list
│   ├── Status indicators
│   └── Completion buttons
│
└── StockOutCompletionStep (Step 4)
    ├── Success banner
    ├── Order summary
    ├── Picked items details
    └── Action buttons
```

---

## Data Model

### StockOutRequest
```typescript
interface StockOutRequest {
  id: string;                    // Unique request ID
  date: string;                  // Request creation date
  productName: string;           // Product being ordered
  productType: string;           // Product category
  productValue: number;          // Unit cost
  productUOM: string;            // Unit of measurement
  quantity: number;              // Total quantity required
  customer: string;              // Customer name
  status: StockOutRequestStatus; // pending|approved|in-progress|picked|completed
  picks: PickDetail[];           // Array of picked items
  notes?: string;                // Special instructions
}
```

### PickDetail
```typescript
interface PickDetail {
  structureId: string;          // Which structure
  levelId: string;              // Which level
  partitionId: string;          // Which partition
  partitionName: string;        // Display name
  pickedQuantity: number;       // Quantity picked
  partitionUsedCapacity?: number;
  partitionMaxCapacity?: number;
}
```

---

## State Management (Zustand Store)

**File**: `store/stock-out-store.ts`

### Store State
```typescript
const stockOutStore = {
  // Workflow state
  currentStep: "request" | "allocate" | "remove" | "pickup" | "completion",
  currentRequestId: string | null,
  requests: StockOutRequest[],
  
  // Selection state
  selectedZoneId: string | null,
  selectedStructureId: string | null,
  selectedLevelId: string | null,
  picks: PickState[],
  remainingQuantity: number,
  
  // Confirmation states
  removeConfirmed: boolean,
  pickupConfirmed: boolean,
  
  // UI state
  highlightedZoneId: string | null,
  expandedRequestId: string | null,
}
```

### Key Actions
```typescript
// Request management
addRequest(request)        // Create new request
approveRequest(requestId)  // Approve request and prep for picking
rejectRequest(requestId)   // Reject request
startWorkflow(requestId)   // Begin picking workflow
resetWorkflow()            // Reset to initial state

// Picking actions
selectZone(zoneId)         // Select warehouse zone
selectStructure(structId)  // Select structure
selectLevel(levelId)       // Select level
addPick(pick)              // Add items from partition
removePick(partitionId)    // Remove previously added pick
setRemainingQuantity(qty)  // Update remaining quantity

// Completion
completeWorkflow()         // Complete order and update inventory
```

---

## Integration with Warehouse Canvas

### Mode Switching
The warehouse canvas supports three modes:
- **Design** (Blue): Create/edit warehouse layout
- **Stock In** (Green): Inbound inventory management  
- **Stock Out** (Purple): Outbound order fulfillment

**File**: `components/warehouse/warehouse-canvas.tsx`

```tsx
<button onClick={() => handleModeSwitch("stock-out")}>
  <Download size={14} /> Stock Out
</button>
```

### Side Panel Integration
**File**: `components/warehouse/side-panel.tsx`

```tsx
{mode === "stock-out" && (
  <StockOutWorkflow 
    nodes={nodes}
    onAddRequest={handleRequest}
    onWorkflowComplete={handleCompletion}
  />
)}
```

---

## Color Scheme & Visual Design

| Element | Color | Usage |
|---------|-------|-------|
| Step Circle (Active) | Purple (#7c3aed) | Current workflow step |
| Step Circle (Inactive) | Gray | Completed/pending steps |
| Pick Button | Blue (#2563eb) | Add pick action |
| Verified Item | Green (#10b981) | Confirmed pick |
| Success Banner | Green (#10b981) | Order complete |
| Warning | Amber (#f59e0b) | Partial fulfillment |
| Error | Red (#ef4444) | Issues/failures |

---

## Workflow Flow Diagram

```
┌─────────────────┐
│  REQUEST STEP   │
│  (Create Order) │
└────────┬────────┘
         │
    [APPROVE]
         │
         ▼
┌─────────────────┐
│  PICKING STEP   │
│  (Select Items) │
└────────┬────────┘
         │
  [PICKED ALL]
         │
         ▼
┌──────────────────┐
│ VERIFICATION STEP│
│  (Verify Items)  │
└────────┬─────────┘
         │
   [ALL VERIFIED]
         │
         ▼
┌──────────────────┐
│ COMPLETION STEP  │
│(Ready for Ship)  │
└──────────────────┘
```

---

## Key Differences from Stock In

| Aspect | Stock In | Stock Out |
|--------|----------|-----------|
| **Direction** | Inbound | Outbound |
| **Source** | Vendor | Customer |
| **Action** | Place items in warehouse | Pick items from warehouse |
| **Step 2** | Allocation (assign to locations) | Picking (select from locations) |
| **Step 3** | Putaway (confirm placement) | Verification (confirm selection) |
| **Inventory Impact** | Increases partition capacity | Decreases partition capacity |
| **Color Theme** | Emerald/Green | Purple/Violet |
| **Icon** | Package/Upload | Download |
| **Validation** | Can allocate excess | Can only pick what exists |

---

## File Structure

```
components/warehouse/
├── forms/
│   └── stock-out-form.tsx           (Request creation form)
├── panels/
│   └── stock-out-requests-panel.tsx (Requests list & management)
├── workflow/
│   ├── stock-out-workflow.tsx       (Main orchestrator)
│   ├── stock-out-request-step.tsx   (Step 1)
│   ├── picking-step.tsx             (Step 2)
│   ├── verification-step.tsx        (Step 3)
│   └── stock-out-completion-step.tsx(Step 4)
├── side-panel.tsx                   (Updated with stock-out mode)
└── warehouse-canvas.tsx             (Updated with stock-out button)

store/
├── stock-in-store.ts                (Updated with "stock-out" mode)
└── stock-out-store.ts               (Stock out state management)

types.ts                             (Updated with stock-out types)
```

---

## Usage Example

```typescript
// In your component
import { useStockOutStore } from "@/store/stock-out-store";

export function MyComponent() {
  const { 
    currentStep, 
    addRequest, 
    approveRequest, 
    startWorkflow 
  } = useStockOutStore();

  const handleCreateOrder = () => {
    const order = {
      id: "STO-001",
      date: new Date().toISOString(),
      productName: "Widget A",
      productType: "Electronics",
      productValue: 50,
      productUOM: "unit",
      quantity: 100,
      customer: "Retail Corp",
      status: "pending",
      picks: [],
    };
    
    addRequest(order);
  };

  const handleApprove = (requestId: string) => {
    approveRequest(requestId);
    startWorkflow(requestId);
  };

  return (
    <div>
      {currentStep === "request" && (
        <button onClick={handleCreateOrder}>Create Order</button>
      )}
      {currentStep === "picking" && (
        <p>Navigate warehouse to pick items...</p>
      )}
    </div>
  );
}
```

---

## Error Handling

### Validation Rules

1. **Request Creation**:
   - ✓ Product name required
   - ✓ Quantity must be > 0
   - ✓ Customer name required

2. **Picking**:
   - ✓ Cannot pick more than required
   - ✓ Cannot pick from empty partitions
   - ✓ At least one pick required

3. **Verification**:
   - ✓ All picks must be verified
   - ✓ Total picked must equal required quantity
   - ✓ Cannot skip any picks

---

## Performance Considerations

- **Hierarchy Navigation**: Zone → Structure → Level → Partition is efficient
- **State Updates**: Zustand handles thousands of requests smoothly
- **Rendering**: Only active step components render
- **Memory**: Store cleans up on workflow reset

---

## Future Enhancements

Potential improvements for future versions:
- [ ] Barcode scanning for partition selection
- [ ] Batch order processing
- [ ] Shortage notifications
- [ ] Integration with shipping systems
- [ ] Real-time inventory sync
- [ ] Multi-warehouse support
- [ ] Partial fulfillment handling

---

## Troubleshooting

### Picks not appearing?
- Ensure you've selected a Level first
- Check that partitions exist in the selected level

### Cannot verify?
- Make sure total picked quantity equals required quantity
- Verify all individual picks are checked

### Warehouse not available?
- Create a warehouse in Design mode first
- Stock Out mode requires an existing warehouse

---

## References

- Stock In Process: See `STOCK_IN_VS_STOCK_OUT.md`
- Architecture Details: See `STOCK_OUT_ARCHITECTURE.md`
- Type Definitions: See `components/warehouse/types.ts`
- Store Implementation: See `store/stock-out-store.ts`


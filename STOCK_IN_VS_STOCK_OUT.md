# Stock In vs Stock Out Process Comparison

## Process Flow Diagrams

### Stock In Process (Inbound)
```
┌─────────────────────────────────────────────────────────────┐
│ STOCK IN WORKFLOW (Inbound - Receiving)                     │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  STEP 1: REQUEST        STEP 2: ALLOCATION                  │
│  ────────────────       ──────────────────                   │
│  • Create request       • Select zone                        │
│  • Enter quantity       • Select structure                   │
│  • Add vendor info      • Select level                       │
│  • Add product details  • Assign to partition               │
│  ↓                      • Allocate quantity                  │
│  Status: pending        ↓                                    │
│                         Status: in-progress                 │
│                                                               │
│                                                               │
│  STEP 3: PUTAWAY        STEP 4: COMPLETION                  │
│  ───────────────        ─────────────────                    │
│  • Confirm placement    • View receipt                       │
│  • Verify locations     • Print documentation               │
│  • Click checkmarks     • Archive request                    │
│  ↓                      ↓                                    │
│  Status: allocated      Status: completed                   │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

### Stock Out Process (Outbound - NEW!)
```
┌─────────────────────────────────────────────────────────────┐
│ STOCK OUT WORKFLOW (Outbound - Shipping) ★NEW★              │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  STEP 1: REQUEST        STEP 2: PICKING                     │
│  ────────────────       ────────────────                     │
│  • Create request       • Navigate zone                      │
│  • Enter quantity       • Select structure                   │
│  • Add customer info    • Select level                       │
│  • Add product details  • Pick from partitions              │
│  ↓                      • Enter quantities                   │
│  Status: pending        ↓                                    │
│                         Status: in-progress                 │
│                                                               │
│                                                               │
│  STEP 3: VERIFICATION   STEP 4: COMPLETION                  │
│  ─────────────────      ─────────────────                    │
│  • Verify each pick     • View order summary                │
│  • Confirm quantities   • Item breakdown                     │
│  • Check fulfillment    • Generate picking list              │
│  ↓                      ↓                                    │
│  Status: picked         Status: completed                   │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

---

## Step-by-Step Comparison

### STEP 1: REQUEST CREATION

**Stock In (Inbound)**
```
Input Fields:
├─ Product Name
├─ Product Type
├─ Quantity
├─ Vendor Name           ← Key difference
├─ Product Value
├─ Unit of Measure
└─ Notes

Status Flow: pending → approved → in-progress
```

**Stock Out (Outbound)**
```
Input Fields:
├─ Product Name
├─ Product Type
├─ Quantity
├─ Customer Name         ← Key difference
├─ Product Value
├─ Unit of Measure
└─ Notes

Status Flow: pending → approved → in-progress
```

---

### STEP 2: WAREHOUSE INTERACTION

**Stock In (ALLOCATION)**
```
Purpose: Assign incoming goods to storage locations

Flow:
1. Select Zone (receiving area, raw materials, etc.)
2. Select Structure (warehouse, section, block)
3. Select Level (floor levels 1-3)
4. Select Partitions
5. Assign Quantity to Each Partition

Outcome:
├─ Partitions get reserved
├─ Capacity increases
└─ Products awaiting putaway
```

**Stock Out (PICKING)** ← NEW PROCESS
```
Purpose: Select products from storage for shipment

Flow:
1. Select Zone (raw materials, finished goods, etc.)
2. Select Structure (warehouse, section, block)
3. Select Level (floor levels 1-3)
4. Select Partitions
5. Pick Quantity from Each Partition

Outcome:
├─ Items selected for shipment
├─ Capacity decreases
└─ Order ready for verification
```

---

### STEP 3: CONFIRMATION

**Stock In (PUTAWAY CONFIRMATION)**
```
Purpose: Physically confirm goods placed in locations

Actions:
├─ Review each allocated partition
├─ Confirm physical placement
├─ Click checkmark when item placed
└─ All partitions must be confirmed

Success: All partitions have checkmarks
Error: Cannot proceed if any unchecked
```

**Stock Out (PICK VERIFICATION)** ← NEW PROCESS
```
Purpose: Verify correct items picked for order

Actions:
├─ Review each picked item
├─ Verify against order requirement
├─ Click checkmark when verified
└─ All picks must be verified

Success: All items verified + total matches quantity
Error: Cannot proceed if:
       └─ Items not verified OR quantity mismatch
```

---

### STEP 4: COMPLETION

**Stock In (Completion)**
```
Display:
├─ Allocation receipt
├─ Items by location
├─ Total quantity received
└─ Next steps (putaway complete)

Actions:
├─ View receipt
└─ Start new request
```

**Stock Out (Completion)** ← NEW PROCESS
```
Display:
├─ Order summary
├─ Items by location
├─ Total quantity picked
├─ Order value
└─ Next steps (ready for dispatch)

Actions:
├─ View receipt
└─ Start new order
```

---

## Data Structure Comparison

### Stock In Request
```typescript
interface StockInRequest {
  id: string;
  date: string;
  productName: string;
  productType: string;
  productValue: number;
  productUOM: string;
  quantity: number;
  vendor: string;              // ← VENDOR
  status: "pending" | "approved" | 
          "in-progress" | "completed";
  allocations: AllocationDetail[];
  notes?: string;
}
```

### Stock Out Request (NEW)
```typescript
interface StockOutRequest {
  id: string;
  date: string;
  productName: string;
  productType: string;
  productValue: number;
  productUOM: string;
  quantity: number;
  customer: string;             // ← CUSTOMER
  status: "pending" | "approved" | 
          "in-progress" | "picked" | "completed";
  picks: PickDetail[];
  notes?: string;
}
```

---

## Status Lifecycle

### Stock In Status Flow
```
pending 
   ↓ (approve/start)
in-progress 
   ↓ (putaway complete)
completed

Alternative:
pending 
   ↓ (reject)
rejected
```

### Stock Out Status Flow (NEW)
```
pending 
   ↓ (approve/start)
in-progress 
   ↓ (picking complete)
picked 
   ↓ (verification complete)
completed

Alternative:
pending 
   ↓ (reject)
rejected
```

---

## User Roles

### Stock In Flow
- **Receiver**: Creates request, receives goods
- **Warehouse Manager**: Approves request
- **Warehouse Staff**: Performs allocation and putaway

### Stock Out Flow (NEW)
- **Order Manager**: Creates request
- **Warehouse Manager**: Approves request
- **Picker**: Performs picking
- **Verifier**: Confirms picks

---

## Warehouse Impact

### Stock In Process
```
Before: 
├─ Partition A: 20/100 used
├─ Partition B: 45/100 used
└─ Partition C: 30/100 used

Stock In Order: 50 units
   ↓ (allocated to A, B, C)

After:
├─ Partition A: 40/100 used   (+20)
├─ Partition B: 70/100 used   (+25)
└─ Partition C: 35/100 used   (+5)
                 ▲
            CAPACITY INCREASES
```

### Stock Out Process (NEW)
```
Before:
├─ Partition A: 40/100 used
├─ Partition B: 70/100 used
└─ Partition C: 35/100 used

Stock Out Order: 50 units picked
   ↓ (picked from A, B, C)

After:
├─ Partition A: 20/100 used   (-20)
├─ Partition B: 45/100 used   (-25)
└─ Partition C: 30/100 used   (-5)
                 ▲
            CAPACITY DECREASES
```

---

## Key Terminology

### Stock In
- **Allocation**: Assigning goods to storage locations
- **Putaway**: Physically placing goods in allocated locations
- **Vendor**: Source of incoming goods
- **Receiving**: Process of accepting incoming shipment

### Stock Out (NEW)
- **Picking**: Selecting items from storage for shipment
- **Verification**: Confirming correct items picked
- **Customer**: Destination of outgoing goods
- **Shipping**: Process of preparing outgoing shipment

---

## Color Schemes

### Stock In
- Primary: **Blue** (#3B82F6)
- State: ✓ Green, ⚠ Amber, ✗ Red

### Stock Out (NEW)
- Primary: **Purple** (#A855F7)
- State: ✓ Green, ⚠ Amber, ✗ Red

---

## Implementation Files

### Stock In (Existing)
```
✅ components/warehouse/workflow/stock-in-workflow.tsx
✅ components/warehouse/workflow/stock-in-request-step.tsx
✅ components/warehouse/workflow/allocation-step.tsx
✅ components/warehouse/workflow/putaway-step.tsx
✅ components/warehouse/workflow/completion-step.tsx
✅ store/stock-in-store.ts
```

### Stock Out (NEW)
```
✅ components/warehouse/workflow/stock-out-workflow.tsx
✅ components/warehouse/workflow/stock-out-request-step.tsx
✅ components/warehouse/workflow/picking-step.tsx
✅ components/warehouse/workflow/verification-step.tsx
✅ components/warehouse/workflow/stock-out-completion-step.tsx
✅ store/stock-out-store.ts
```

---

## Summary Table

| Aspect | Stock In | Stock Out |
|--------|----------|-----------|
| Direction | Inbound | Outbound |
| Purpose | Receive goods | Ship goods |
| Source | Vendor | Warehouse |
| Destination | Warehouse | Customer |
| Step 2 | Allocation | **Picking** |
| Step 3 | Putaway | **Verification** |
| Key Metric | Qty Received | Qty Picked |
| Capacity Impact | Increases | Decreases |
| Status | pending→approved→completed | pending→approved→picked→completed |
| Color | Blue | **Purple** |
| Main User | Receiver | Picker |
| Associated Field | Vendor | Customer |

---

**Both processes follow the same architectural pattern but are optimized for their respective purposes - receiving vs. shipping!**


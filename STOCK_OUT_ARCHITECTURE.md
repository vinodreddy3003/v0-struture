# Stock Out Process - Architecture & File Structure

## Complete File Structure

```
v0-project/
├── app/
│   ├── layout.tsx
│   └── page.tsx
│
├── components/
│   └── warehouse/
│       ├── types.ts                          ← UPDATED
│       │   ├── StockOutRequest
│       │   ├── PickDetail
│       │   ├── StockOutRequestStatus
│       │   └── (existing types)
│       │
│       ├── workflow/
│       │   ├── stock-in-workflow.tsx         (existing)
│       │   ├── stock-in-request-step.tsx     (existing)
│       │   ├── allocation-step.tsx           (existing)
│       │   ├── putaway-step.tsx              (existing)
│       │   ├── completion-step.tsx           (existing)
│       │   │
│       │   ├── stock-out-workflow.tsx        ✨ NEW
│       │   ├── stock-out-request-step.tsx    ✨ NEW
│       │   ├── picking-step.tsx              ✨ NEW
│       │   ├── verification-step.tsx         ✨ NEW
│       │   └── stock-out-completion-step.tsx ✨ NEW
│       │
│       ├── forms/
│       │   ├── stock-in-form.tsx             (existing)
│       │   └── (other forms)
│       │
│       ├── panels/
│       │   └── (existing panels)
│       │
│       ├── nodes/
│       │   └── (existing nodes)
│       │
│       └── warehouse-canvas.tsx
│
├── store/
│   ├── stock-in-store.ts                    (existing)
│   └── stock-out-store.ts                   ✨ NEW
│
├── hooks/
│   └── (existing hooks)
│
├── lib/
│   └── (existing utilities)
│
├── public/
│   └── (assets)
│
├── STOCK_OUT_PROCESS_SUMMARY.md             ✨ NEW
├── STOCK_OUT_DOCUMENTATION.md               ✨ NEW
├── STOCK_OUT_IMPLEMENTATION_GUIDE.md        ✨ NEW
├── STOCK_IN_VS_STOCK_OUT.md                 ✨ NEW
│
├── package.json
├── tsconfig.json
├── tailwind.config.ts
├── next.config.js
└── components.json
```

---

## Component Hierarchy

### Stock Out Workflow Component Tree
```
StockOutWorkflow (main component)
├── Progress Indicator (visual step tracker)
│   └── 4 steps with connector lines
│
└── Step Content Container
    ├── StockOutRequestStep (STEP 1)
    │   ├── Header with "New Request" button
    │   ├── Request Form (when expanded)
    │   │   ├── Product inputs
    │   │   ├── Customer input
    │   │   └── Action buttons
    │   │
    │   ├── Pending Requests List
    │   │   └── Request cards with approve/reject
    │   │
    │   └── Other Requests Summary (collapsed)
    │
    ├── PickingStep (STEP 2)
    │   ├── Product Info Display
    │   ├── Progress Bar
    │   ├── Warehouse Navigation
    │   │   ├── Zone Selector
    │   │   ├── Structure Selector (conditional)
    │   │   ├── Level Selector (conditional)
    │   │   └── Partition Selector (conditional)
    │   │       ├── Quantity Input
    │   │       └── Add Button
    │   │
    │   ├── Picked Items Summary
    │   │   └── Pick cards with remove button
    │   │
    │   ├── Instructions Box
    │   └── Navigation Buttons
    │
    ├── VerificationStep (STEP 3)
    │   ├── Product Info Display
    │   ├── Fulfillment Status Bar
    │   ├── Picked Items Verification
    │   │   └── Verification cards with checkboxes
    │   │
    │   ├── Status Message
    │   ├── Verification Counter
    │   └── Action Buttons
    │
    └── StockOutCompletionStep (STEP 4)
        ├── Success Banner
        ├── Order Summary
        │   ├── Product Info
        │   ├── Quantity & Value
        │   └── Customer & Date
        │
        ├── Picked Items Details
        │   └── Item list by location
        │
        ├── Next Steps Box
        └── Action Buttons
```

---

## State Management Flow

### Zustand Store: `useStockOutStore`

```
┌─────────────────────────────────────────────────┐
│         useStockOutStore (Zustand)              │
├─────────────────────────────────────────────────┤
│                                                  │
│  ┌─ Workflow State ──────────────────────┐      │
│  │ • mode: "design" | "stock-out"        │      │
│  │ • currentStep: "request" | "picking"  │      │
│  │ •              | "verification" |      │      │
│  │ •              "completion"            │      │
│  │ • currentRequestId: string | null      │      │
│  │ • requests: StockOutRequest[]          │      │
│  └───────────────────────────────────────┘      │
│                                                  │
│  ┌─ Picking State ────────────────────────┐     │
│  │ • selectedZoneId: string | null        │     │
│  │ • selectedStructureId: string | null   │     │
│  │ • selectedLevelId: string | null       │     │
│  │ • picks: PickState[]                   │     │
│  │ • remainingQuantity: number            │     │
│  └───────────────────────────────────────┘     │
│                                                  │
│  ┌─ Verification State ──────────────────┐     │
│  │ • verificationConfirmed: boolean       │     │
│  └───────────────────────────────────────┘     │
│                                                  │
│  ┌─ UI State ────────────────────────────┐     │
│  │ • highlightedZoneId: string | null     │     │
│  └───────────────────────────────────────┘     │
│                                                  │
└─────────────────────────────────────────────────┘
         ↓          ↓          ↓
    [Actions]  [Selectors]  [Derived State]
```

### Actions Flow

```
User Action              State Update           Effect
────────────────────────────────────────────────────────
Click "New Request"  →  addRequest()        →  request added
Click "Approve"      →  approveRequest()    →  status: approved
Click "Approve & Pick" → startWorkflow()    →  step: picking, 
                                               picks: []
Select Zone          →  selectZone()        →  selectedZoneId
Select Structure     →  selectStructure()   →  selectedStructureId
Select Level         →  selectLevel()       →  selectedLevelId
Click "+" to Pick    →  addPick()           →  picks: [...picks, 
                                               newPick]
                                            →  remainingQuantity--
Click "Continue"     →  setCurrentStep()    →  step: verification
Click Verify Item    →  (handled locally)   →  verifiedPicks set
Click "Complete"     →  completeWorkflow()  →  step: completion,
                                               status: completed
Click "New Order"    →  resetWorkflow()     →  back to request step
```

---

## Data Flow Diagram

```
┌─────────────────────────────────────────────────┐
│         USER INTERFACE LAYER                    │
├─────────────────────────────────────────────────┤
│                                                  │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐      │
│  │ Request  │  │ Picking  │  │Verify &  │      │
│  │ Step UI  │→ │ Step UI  │→ │Complete  │      │
│  └──────────┘  └──────────┘  └──────────┘      │
│       ↓              ↓              ↓            │
└─────────────────────────────────────────────────┘
       ↓              ↓              ↓
┌─────────────────────────────────────────────────┐
│       STATE MANAGEMENT (Zustand Store)          │
├─────────────────────────────────────────────────┤
│                                                  │
│  useStockOutStore Hook
│  ├─ state.requests[]
│  ├─ state.currentStep
│  ├─ state.picks[]
│  ├─ state.remainingQuantity
│  └─ actions: addRequest, selectZone, addPick...│
│                                                  │
└─────────────────────────────────────────────────┘
       ↓              ↓              ↓
┌─────────────────────────────────────────────────┐
│           COMPONENT LOGIC LAYER                 │
├─────────────────────────────────────────────────┤
│                                                  │
│  Request Form  → Picking Logic  → Verification │
│  Validation    → Navigation     → Confirmation │
│  Approval      → Pick Add/Remove → Completion  │
│                                                  │
└─────────────────────────────────────────────────┘
       ↓              ↓              ↓
┌─────────────────────────────────────────────────┐
│         DATA PERSISTENCE LAYER (Future)         │
├─────────────────────────────────────────────────┤
│                                                  │
│  Database (Supabase, Neon, etc.)
│  ├─ stock_out_requests table
│  ├─ stock_out_picks table
│  └─ warehouse_partitions table
│                                                  │
└─────────────────────────────────────────────────┘
```

---

## Event Flow

### Request Creation to Completion

```
User Creates Request
    ↓
addRequest() → requests state updated
    ↓
Request appears in "Pending" list
    ↓
User clicks "Approve & Pick"
    ↓
approveRequest() + startWorkflow()
    ├─ status: approved
    ├─ currentStep: picking
    ├─ picks: []
    └─ remainingQuantity = order quantity
    ↓
Picking Phase
    ├─ selectZone() → displays structures
    ├─ selectStructure() → displays levels
    ├─ selectLevel() → displays partitions
    └─ addPick() multiple times
       └─ remainingQuantity decreases
    ↓
When remainingQuantity = 0:
    ├─ "Continue to Verification" enabled
    └─ setCurrentStep(verification)
    ↓
Verification Phase
    ├─ User clicks items to verify
    ├─ verifiedPicks set updated (local state)
    └─ When all verified:
       └─ "Complete Order" enabled
    ↓
completeWorkflow()
    ├─ Dispatch "partition-updated-stockout" events
    ├─ status: completed
    └─ setCurrentStep(completion)
    ↓
Completion Phase
    ├─ Display order summary
    ├─ Show picked items by location
    └─ Offer "Start New Order" button
```

---

## Integration Points

### With Warehouse Canvas

```
┌─────────────────────────────┐
│   Warehouse Canvas          │
│   (ReactFlow Visualization) │
├─────────────────────────────┤
│                              │
│  Provides:                   │
│  ├─ nodes[] (zones, structs) │
│  └─ onWorkflowComplete()     │
│                              │
└────────────┬────────────────┘
             ↓
      Listen to events:
      └─ "partition-updated-stockout"
         ├─ structureId
         ├─ levelId
         ├─ partitionId
         └─ pickedQuantity
```

---

## File Dependencies

### Import Chain

```
App / Canvas Component
    ↓
StockOutWorkflow
├─ useStockOutStore (from store/stock-out-store.ts)
├─ StockOutRequestStep (imports store)
├─ PickingStep (imports store, Node from @xyflow/react)
├─ VerificationStep (imports store, types)
└─ StockOutCompletionStep (imports store, icons)

All steps import:
├─ types.ts (interfaces)
├─ lucide-react (icons)
├─ shadcn/ui components (Button, Card, Input, etc.)
└─ tailwind CSS classes
```

---

## Store Implementation Details

### State Getters

```typescript
// Get current request
const currentRequest = requests.find(r => r.id === currentRequestId);

// Get pending requests
const pendingRequests = requests.filter(r => r.status === "pending");

// Get remaining quantity
const totalPicked = picks.reduce((sum, p) => sum + p.pickedQuantity, 0);
const remaining = currentRequest?.quantity - totalPicked;

// Check if all verified (handled in component state)
const allVerified = picks.every(p => verifiedPicks.has(p.partitionId));
```

---

## Styling Architecture

### Tailwind CSS Classes Used

```
Layout:
├─ flex, gap-*, p-*, m-*
├─ grid, grid-cols-*
└─ border, rounded-lg

Colors:
├─ bg-purple-600 (stock out primary)
├─ bg-green-600 (success)
├─ bg-amber-600 (warning)
├─ bg-red-600 (error)
└─ bg-blue-600 (info)

Typography:
├─ text-sm, text-xs, text-lg
├─ font-bold, font-semibold, font-medium
└─ text-foreground, text-muted-foreground

States:
├─ hover:*, transition-colors
├─ disabled:*, cursor-not-allowed
└─ focus:ring-*, focus:outline-none
```

---

## Performance Considerations

### Optimizations Made

1. **Conditional Rendering**: Partitions only show when level selected
2. **Derived State**: remainingQuantity calculated in store actions
3. **Set for Verification**: verifiedPicks uses Set for O(1) lookup
4. **Event System**: Custom events instead of prop drilling
5. **Memoization Ready**: Components structured for React.memo if needed

---

## Testing Strategy

### Unit Test Coverage

```
✓ Store actions (addRequest, addPick, etc.)
✓ Status transitions (pending → approved → completed)
✓ Quantity calculations (remainingQuantity updates)
✓ Selection logic (zone → structure → level)
✓ Validation (quantity within limits)
```

### Integration Test Coverage

```
✓ Full workflow from request to completion
✓ Multiple picks from different locations
✓ Verification checkpoint enforcement
✓ Error states and edge cases
✓ Event dispatching
```

---

## Scalability Roadmap

### Phase 1: Core (✅ Completed)
- Basic 4-step workflow
- In-memory state management
- Mock warehouse data

### Phase 2: Database
- Persist requests to database
- Real warehouse partition data
- User authentication

### Phase 3: Advanced
- Barcode scanning
- Batch operations
- Real-time picking updates

### Phase 4: Enterprise
- Multi-warehouse support
- Advanced reporting
- Integration with ERP systems

---

**This architecture is modular, scalable, and ready for both immediate use and future enhancement!**


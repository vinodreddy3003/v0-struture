## Stock Out Process - Step-by-Step Flow

A detailed walkthrough of the complete Stock Out (outbound order fulfillment) process.

---

## Complete Workflow with Visual Steps

### PHASE 1: REQUEST MANAGEMENT

#### Step 1.1 - Switch to Stock Out Mode
```
Location: Top-left corner of warehouse canvas
Action: Click [Stock Out] button (purple)
Expected: Side panel changes to show Stock Out interface
```

#### Step 1.2 - Create New Request
```
Location: Stock Out Requests section, top-right
Action: Click [New Request] button
Expected: Stock Out Form appears in side panel
```

#### Step 1.3 - Fill Request Form
```
Required Fields:
  Product Name:        "Widget A" (required)
  Product Type:        "Electronics" (required)
  Product Value:       "$50.00" (optional)
  Product UOM:         "unit" or "box" (optional)
  
Customer Details:
  Customer Name:       "Retail Corp ABC" (required)
  Quantity to Pick:    "100" (required)
  
Optional:
  Notes:               "Handle with care - Fragile items"

Action: Fill all required fields
Expected: Form validates in real-time
```

#### Step 1.4 - Submit Request
```
Action: Click [Create Request] button
Expected: 
  - Form clears
  - New request appears in Requests list
  - Status shows "pending" with amber badge
```

#### Step 1.5 - Request Panel Displays
```
Request Card Shows:
  📦 Widget A [pending]
  Qty: 100 unit | 2024-02-25
  
  When Expanded:
  ├─ Type: Electronics
  ├─ Value: $50.00
  ├─ Customer: Retail Corp ABC
  ├─ Picked: 0 / 100
  ├─ Notes: (if provided)
  └─ Picks: (none yet)
```

---

### PHASE 2: REQUEST APPROVAL

#### Step 2.1 - Review Request
```
Action: Click on request card to expand
Expected: 
  - Card expands to show full details
  - Green [Approve & Start] button visible
  - Red [Reject] button visible
```

#### Step 2.2 - Approve & Start Picking
```
Action: Click [Approve & Start] button
Expected:
  - Request status changes to "approved" (green)
  - Workflow advances to Step 2: Picking
  - Picking panel appears
  - Request card collapses
```

#### Step 2.3 - OR Reject Request
```
Alternative Action: Click [Reject] button
Expected:
  - Request status changes to "rejected" (red)
  - Request remains in "Other Requests" section
  - No picking workflow starts
```

---

### PHASE 3: PICKING PROCESS

#### Step 3.1 - Picking Panel Opens
```
Display Shows:
  ✓ Product Info Card
    - Widget A (requested)
    - Electronics type
    - Customer: Retail Corp ABC
    - Total Required: 100 units
  
  ✓ Progress Bar
    - 0 / 100 units picked
    - Progress: 0%
  
  ✓ Warehouse Navigation
    - Zone selector (expandable)
    - Structure selector (appears after zone selected)
    - Level selector (appears after structure selected)
    - Partition list (appears after level selected)
```

#### Step 3.2 - Select Zone
```
Action: Click on a Zone
Expected:
  - Zone highlights in blue
  - Structures under that zone appear below
  
Example:
  Zones available:
  ├─ Finished Goods (select this)
  ├─ Raw Materials
  └─ Cold Storage
```

#### Step 3.3 - Select Structure
```
Action: Click on a Structure within selected Zone
Expected:
  - Structure highlights in amber
  - Levels under that structure appear
  
Example (if "Finished Goods" selected):
  Structures:
  ├─ Section 1 (select this)
  ├─ Section 2
  └─ Section 3
```

#### Step 3.4 - Select Level
```
Action: Click on a Level within selected Structure
Expected:
  - Level highlights in green
  - Partitions on that level appear with:
    • Partition name
    • Current capacity (used/max)
    • Input field for quantity
    • Add button
  
Example (if "Section 1" selected):
  Levels:
  ├─ Level 1 (select this)
  ├─ Level 2
  └─ Level 3
```

#### Step 3.5 - View Available Partitions
```
Display Shows:
  
  Partition A (45/100)    ✓ Partition contains Widget A
  Partition B (78/100)    ✓ Partition contains Widget A
  Partition C (32/100)    ✓ Partition contains Widget A
  
  Each partition shows:
  - Name and ID
  - Current usage (used/max capacity)
  - Quantity input field
  - Add button (+)
```

#### Step 3.6 - Add First Pick
```
Action:
  1. Enter quantity: "30"
  2. Click [+] button for Partition A
  
Expected:
  - Partition A background turns green
  - "30 units" added to Picked Items summary
  - Progress bar updates: 30 / 100 (30%)
  - Remaining quantity: 70 units
  - Quantity field resets to "0"
  - Can now pick from other partitions
```

#### Step 3.7 - Add Second Pick
```
Action:
  1. Enter quantity: "40"
  2. Click [+] button for Partition B
  
Expected:
  - Partition B background turns green
  - "40 units" added to Picked Items summary
  - Progress bar updates: 70 / 100 (70%)
  - Remaining quantity: 30 units
```

#### Step 3.8 - Add Third Pick
```
Action:
  1. Enter quantity: "30"
  2. Click [+] button for Partition C
  
Expected:
  - Partition C background turns green
  - "30 units" added to Picked Items summary
  - Progress bar updates: 100 / 100 (100%)
  - Remaining quantity: 0 units
  - [Continue to Verification] button becomes active
```

#### Step 3.9 - Picked Items Summary
```
Display Shows:

  Picked Items (3)
  ├─ Partition A: 30 units ✗ (delete button)
  ├─ Partition B: 40 units ✗ (delete button)
  └─ Partition C: 30 units ✗ (delete button)
  
  Can click ✗ to remove any pick and re-adjust
```

#### Step 3.10 - Proceed to Verification
```
Action: Click [Continue to Verification] button
  (Button is only active when remaining qty = 0)
  
Expected:
  - Workflow advances to Step 3: Verification
  - Picking panel closes
  - Verification panel opens
```

---

### PHASE 4: VERIFICATION PROCESS

#### Step 4.1 - Verification Panel Opens
```
Display Shows:
  
  ✓ Header: "Pick Verification"
  
  ✓ Product Summary Card
    - Widget A
    - Type: Electronics
    - Total Required: 100 units
    - Total Picked: 100 units
    - Customer: Retail Corp ABC
  
  ✓ Order Fulfillment Status Bar
    - Shows 100 / 100
    - Bar is fully green (100%)
  
  ✓ Pick Verification List
    - Partition A: 30 units (checkbox - unchecked)
    - Partition B: 40 units (checkbox - unchecked)
    - Partition C: 30 units (checkbox - unchecked)
  
  ✓ Verification Counter
    - 0 / 3 items verified
  
  ✓ Status Message
    - "⚠️ All items picked correctly. Ready to complete order."
```

#### Step 4.2 - Verify First Pick
```
Action: Click on "Partition A: 30 units" card
Expected:
  - Card background turns green
  - Checkbox appears and is checked ✓
  - Card becomes clickable to uncheck if needed
  - Verification counter updates: 1 / 3 items verified
```

#### Step 4.3 - Verify Second Pick
```
Action: Click on "Partition B: 40 units" card
Expected:
  - Card background turns green
  - Checkbox is checked ✓
  - Verification counter updates: 2 / 3 items verified
```

#### Step 4.4 - Verify Third Pick
```
Action: Click on "Partition C: 30 units" card
Expected:
  - Card background turns green
  - Checkbox is checked ✓
  - Verification counter updates: 3 / 3 items verified
  - Status message updates: "✓ All items picked correctly."
  - [Complete Order] button becomes active (green)
```

#### Step 4.5 - Complete Order
```
Preconditions:
  ✓ All 3 picks verified (checkboxes checked)
  ✓ Total quantity matches requirement (100 / 100)
  
Action: Click [Complete Order] button
Expected:
  - Verification panel closes
  - Workflow advances to Step 4: Completion
  - Completion panel opens with success message
```

---

### PHASE 5: ORDER COMPLETION

#### Step 5.1 - Completion Panel Opens
```
Display Shows:

  ✓ Success Banner (Green)
    "✓ Order Successfully Fulfilled"
    "All items have been picked, verified, 
     and are ready for dispatch."
  
  ✓ Order Summary Card
    Shows all order details:
    - Product: Widget A
    - Type: Electronics
    - Total Quantity: 100 units
    - Total Value: $5,000.00 (100 × $50)
    - Customer: Retail Corp ABC
    - Date: 2024-02-25
  
  ✓ Picked Items Details
    Shows breakdown:
    1. Partition A: 30 units (from Level 1, Section 1)
    2. Partition B: 40 units (from Level 1, Section 1)
    3. Partition C: 30 units (from Level 1, Section 1)
  
  ✓ Next Steps Instructions
    • Prepare items for packing
    • Generate shipping label
    • Update customer notification
    • Transfer to dispatch area
```

#### Step 5.2 - Review Completion Details
```
Information Available:
  - Order ID (auto-generated)
  - Completion timestamp
  - All pick locations
  - Total quantities per partition
  - Order value calculation
```

#### Step 5.3 - Start New Order OR View Receipt
```
Option 1: Start New Order
  Action: Click [Start New Order] button
  Expected:
    - Workflow resets to Step 1
    - Requests list shown
    - Ready for new stock-out request
    - Previous order marked as "completed" (green)

Option 2: View Receipt
  Action: Click [View Receipt] button
  Expected:
    - (Functionality can be enhanced)
    - Could show printable receipt
    - Could show order tracking number
```

---

## Alternative Flows

### Flow A: Reject Request
```
At Request Approval:
  [Reject] button
  ↓
Status → "rejected" (red badge)
Request → Moves to "Other Requests" section
Outcome: No picking workflow, request archived
```

### Flow B: Remove Picks
```
During Picking, before verification:
  Click [✗] on picked item
  ↓
Pick is removed
Progress bar decreases
Can add pick from different partition
Continue until all required quantity picked again
```

### Flow C: Unverify Pick
```
During Verification, before completion:
  Click on verified item (green card)
  ↓
Item becomes unchecked
Card background returns to normal
Verification counter decreases
Cannot complete until re-verified
```

### Flow D: Partial Fulfillment (Not Allowed)
```
During Verification:
  Total Picked (95) < Total Required (100)
  ↓
Button [Complete Order] is DISABLED
Message: "⚠️ Order partially fulfilled. 5 units still needed."
Action: Click [Back to Picking] to add more
```

---

## Decision Tree

```
START: Warehouse Canvas
  │
  ├─→ [Design Mode]? 
  │     └─→ Create warehouse layout
  │
  ├─→ [Stock In Mode]?
  │     └─→ Inbound inventory management
  │
  └─→ [Stock Out Mode] ✓ (Selected)
        │
        ├─→ New Stock Out Request?
        │     │
        │     ├─→ Create Request
        │     ├─→ Fill all required fields
        │     └─→ Click [Create Request]
        │           │
        │           └─→ Request created → appears in list
        │
        ├─→ Approve Request?
        │     │
        │     ├─→ Click [Approve & Start]
        │     │     └─→ Workflow → PICKING STEP
        │     │
        │     └─→ Reject Request?
        │           └─→ Status → "rejected"
        │
        ├─→ [PICKING STEP]
        │     │
        │     ├─→ Select Zone
        │     ├─→ Select Structure
        │     ├─→ Select Level
        │     ├─→ Add picks (multiple allowed)
        │     └─→ Click [Continue to Verification]
        │           │
        │           └─→ Workflow → VERIFICATION STEP
        │
        ├─→ [VERIFICATION STEP]
        │     │
        │     ├─→ Verify each pick (checkbox)
        │     ├─→ Confirm all picks checked
        │     ├─→ Confirm quantity matches
        │     └─→ Click [Complete Order]
        │           │
        │           └─→ Workflow → COMPLETION STEP
        │
        └─→ [COMPLETION STEP]
              │
              ├─→ Review success message
              ├─→ Review order summary
              ├─→ Review picked items details
              │
              ├─→ [Start New Order]?
              │     └─→ Workflow → REQUEST STEP (restart)
              │
              └─→ [View Receipt]?
                    └─→ Print/Download receipt
```

---

## Data Flow Summary

```
User Input
   ↓
Stock Out Store (Zustand)
   ├─ Request Management
   ├─ Selection State
   ├─ Pick Operations
   └─ Verification State
   ↓
Component Rendering
   ├─ Request Step → Show form
   ├─ Picking Step → Show hierarchy
   ├─ Verification Step → Show picks
   └─ Completion Step → Show summary
   ↓
User Action
   └─ Back to Request Step (restart)
```

---

## Quick Reference Times

| Step | Action | Typical Time |
|------|--------|--------------|
| 1.1 | Switch mode | < 1 sec |
| 1.2 | Open form | < 1 sec |
| 1.3-1.4 | Create request | 30 sec |
| 2.1-2.2 | Approve & start | 5 sec |
| 3.1-3.10 | Pick all items | 2-5 min |
| 4.1-4.5 | Verify all items | 1-2 min |
| 5.1-5.3 | Complete order | < 1 sec |
| **Total** | **Full workflow** | **4-10 min** |

---

## State Transitions

```
REQUEST STEP
  ├─ [Create Request] → New request in "pending"
  ├─ [Approve & Start] → Transition to PICKING STEP
  └─ [Reject] → Request status = "rejected"

PICKING STEP
  ├─ [Select Zone/Structure/Level] → UI updates
  ├─ [Add Pick] → remainingQuantity decreases
  ├─ [Remove Pick] → remainingQuantity increases
  └─ [Continue] → Transition to VERIFICATION STEP

VERIFICATION STEP
  ├─ [Verify Pick] → verifiedPicks increases
  ├─ [Unverify Pick] → verifiedPicks decreases
  └─ [Complete] → Transition to COMPLETION STEP

COMPLETION STEP
  ├─ [Start New Order] → Reset to REQUEST STEP
  ├─ [View Receipt] → Show receipt details
  └─ (Auto mark order as "completed")
```

---

## Validation Rules at Each Step

### Request Creation
- ✓ Product Name: required, min 3 chars
- ✓ Product Type: required, min 3 chars
- ✓ Quantity: required, must be > 0, must be ≤ 999,999
- ✓ Customer: required, min 3 chars
- ✓ Value: optional, if provided must be ≥ 0

### Picking
- ✓ Cannot pick more than remaining quantity
- ✓ Cannot pick 0 units
- ✓ Cannot pick from same partition twice
- ✓ Must pick total quantity ≥ required

### Verification
- ✓ All picks must be verified (checked)
- ✓ Total picked must equal total required
- ✓ Cannot complete with partial fulfillment

---

This completes the step-by-step Stock Out process documentation.

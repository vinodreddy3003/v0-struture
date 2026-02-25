# Stock Out Process Documentation

## Overview

The Stock Out Process is a **4-step warehouse workflow** for managing outbound orders and picking items from storage locations. It mirrors the Stock In process but for inventory removal instead of receipt.

---

## Process Steps

### **Step 1: Request** 
**Create and manage stock out requests from customers**

- **Add new stock out requests** with product details
  - Product Name
  - Product Type
  - Quantity needed
  - Customer information
  - Product Value & Unit of Measure (UOM)
  - Optional notes

- **Request Management**
  - View pending requests
  - Approve and start picking workflow
  - Reject requests
  - Track request history (completed, rejected, in-progress)

**Status**: `pending` → Waiting for approval

---

### **Step 2: Picking**
**Locate and select items from warehouse zones, structures, and levels**

The picking step provides a hierarchical warehouse navigation:

1. **Zone Selection**
   - Select the warehouse zone (e.g., Cold Storage, Raw Materials, Finished Goods)
   - Each zone contains structures for organized storage

2. **Structure Selection**
   - Choose the specific structure within the zone
   - Structures are organized storage units (warehouse, section, block)

3. **Level Selection**
   - Select the level within the structure (e.g., Level 1, 2, 3)
   - Different levels for vertical storage organization

4. **Partition Selection & Quantity Input**
   - View available partitions with current capacity
   - Enter pick quantity for each partition
   - Add multiple picks from different locations
   - Remove picks if needed

**Progress Tracking**:
- Visual progress bar shows: `Picked Quantity / Total Required`
- Can proceed to next step only when total picked equals required quantity
- Remaining quantity updates in real-time

**Status**: `in-progress` → Items being picked

---

### **Step 3: Verification**
**Confirm all picked items match order requirements**

- **Item Verification Checklist**
  - Click each picked item to verify its correctness
  - Visual confirmation with checkmarks
  - Each item shows: name, location (level/partition), and quantity

- **Order Fulfillment Verification**
  - Total picked quantity must match order requirement
  - Progress bar indicates fulfillment status:
    - ✓ Green: Order fully fulfilled
    - ⚠ Amber: Partially fulfilled (shows units still needed)

- **Verification Status**
  - Counter shows: `X / Y items verified`
  - Cannot complete until all items verified AND quantity matches

**Status**: `picked` → Items verified and ready

---

### **Step 4: Completion**
**Finalize the order and prepare for dispatch**

- **Completion Summary**
  - Order success confirmation with checkmark
  - Complete order details display
  - Item-by-item breakdown with locations
  - Total value calculation

- **Order Information**
  - Product details
  - Total quantity picked
  - Total value
  - Customer name
  - Order date

- **Next Steps Guidance**
  - Prepare items for packing
  - Generate shipping label
  - Update customer notification
  - Transfer to dispatch area

- **Actions**
  - **Start New Order**: Reset workflow for next request
  - **View Receipt**: Access detailed order receipt

**Status**: `completed` → Order fulfilled

---

## Data Flow

### Request Object Structure
```typescript
interface StockOutRequest {
  id: string;                    // Unique request ID
  date: string;                  // Request date
  productName: string;           // Product name
  productType: string;           // Product category/type
  productValue: number;          // Unit value
  productUOM: string;            // Unit of Measure (units, kg, etc.)
  quantity: number;              // Total quantity needed
  customer: string;              // Customer name
  status: StockOutRequestStatus; // pending|approved|rejected|in-progress|picked|completed
  picks: PickDetail[];           // Array of picked items
  notes?: string;                // Optional notes
}
```

### Pick Detail Structure
```typescript
interface PickDetail {
  structureId: string;           // ID of storage structure
  levelId: string;               // ID of level within structure
  partitionId: string;           // ID of partition/bin
  partitionName: string;         // Display name of partition
  pickedQuantity: number;        // Quantity picked from this location
  partitionUsedCapacity?: number;
  partitionMaxCapacity?: number;
}
```

---

## State Management

### Zustand Store: `useStockOutStore`

**Workflow State:**
- `currentStep`: Track which step user is on (request → picking → verification → completion)
- `currentRequestId`: ID of request being processed
- `requests`: Array of all stock out requests

**Picking State:**
- `selectedZoneId`: Currently selected zone
- `selectedStructureId`: Currently selected structure
- `selectedLevelId`: Currently selected level
- `picks`: Array of picked items
- `remainingQuantity`: Quantity still needed

**Verification State:**
- `verificationConfirmed`: Boolean flag for completion

**Actions:**
- `addRequest()`: Create new stock out request
- `approveRequest()`: Approve a pending request
- `rejectRequest()`: Reject a request
- `startWorkflow()`: Begin picking for approved request
- `selectZone/Structure/Level()`: Navigate warehouse hierarchy
- `addPick()`: Add item to picks
- `removePick()`: Remove item from picks
- `completeWorkflow()`: Finalize order
- `resetWorkflow()`: Reset for new request

---

## Integration Points

### 1. **Warehouse Canvas Integration**
- Nodes from ReactFlow are used to populate zone/structure dropdown
- Event system for partition updates: `partition-updated-stockout`

### 2. **Partition Updates**
When picking is completed, custom events dispatch warehouse capacity updates:
```javascript
const event = new CustomEvent("partition-updated-stockout", {
  detail: {
    structureId: string,
    levelId: string,
    partitionId: string,
    pickedQuantity: number,
    productName: string,
  }
});
window.dispatchEvent(event);
```

### 3. **UI Components Used**
- Button, Input, Card, Badge components from shadcn/ui
- Icons: CheckCircle, Package, User, Calendar, Plus, Trash2, ChevronDown (lucide-react)
- Progress bars for capacity and fulfillment tracking

---

## User Workflows

### Typical Workflow: Process a Customer Order

1. **Request Phase** (2-3 minutes)
   - Click "New Request"
   - Enter: Product name, type, quantity, customer, value, UOM
   - Click "Approve & Pick" to start workflow

2. **Picking Phase** (5-10 minutes)
   - Select Zone → Structure → Level
   - Browse available partitions
   - Enter quantity for each partition
   - Click "+" to add pick
   - Continue until total picked = required quantity
   - Click "Continue to Verification"

3. **Verification Phase** (2-5 minutes)
   - Review each picked item
   - Click items to confirm they match order
   - All items must be verified
   - Total must equal order requirement
   - Click "Complete Order"

4. **Completion Phase** (1 minute)
   - Review order summary
   - See item breakdown by location
   - Start new order or view receipt

---

## Key Features

### ✓ **Hierarchical Picking**
Navigate warehouse logically through zones → structures → levels → partitions

### ✓ **Real-time Quantity Tracking**
Progress bars show picking completion and order fulfillment status in real-time

### ✓ **Verification Checkpoint**
Ensures picked quantity matches order requirement before completion

### ✓ **Multi-location Picking**
Support picking same product from multiple storage locations

### ✓ **Remove & Edit**
Ability to remove picks and add from different locations during picking phase

### ✓ **Request History**
Track all requests (pending, approved, rejected, completed, in-progress)

### ✓ **Customer Tracking**
Associate orders with specific customers

### ✓ **Value Calculation**
Automatic calculation of total order value based on unit value and quantity

---

## Differences from Stock In

| Aspect | Stock In | Stock Out |
|--------|----------|-----------|
| **Purpose** | Receive goods from vendors | Ship goods to customers |
| **Step 2** | Allocation (assign to locations) | Picking (select from locations) |
| **Step 3** | Putaway (confirm placement) | Verification (confirm picks) |
| **Storage** | Increasing capacity used | Decreasing capacity used |
| **Key Field** | Vendor | Customer |
| **Status** | pending→approved→completed | pending→approved→picked→completed |
| **Outcome** | Products added to warehouse | Products removed from warehouse |

---

## File Structure

```
components/warehouse/
├── workflow/
│   ├── stock-out-workflow.tsx          # Main workflow component
│   ├── stock-out-request-step.tsx      # Request creation & approval
│   ├── picking-step.tsx                # Picking navigation & selection
│   ├── verification-step.tsx           # Order verification
│   └── stock-out-completion-step.tsx   # Completion & summary

store/
└── stock-out-store.ts                  # Zustand state management

components/warehouse/
└── types.ts                            # TypeScript interfaces (updated)
```

---

## Usage Example

```tsx
import { StockOutWorkflow } from "@/components/warehouse/workflow/stock-out-workflow";

export function MyComponent() {
  const handleWorkflowComplete = (callback) => {
    // Handle order completion
  };

  return (
    <StockOutWorkflow
      nodes={warehouseNodes}
      onWorkflowComplete={handleWorkflowComplete}
    />
  );
}
```

---

## Next Steps for Enhancement

1. **Database Integration**: Persist stock out requests to database
2. **Real Warehouse Data**: Connect to actual warehouse capacity data
3. **Reporting**: Generate picking lists and shipping documents
4. **Barcode Scanning**: Integrate barcode/QR scanning for picking
5. **Multi-user**: Support concurrent picking operations
6. **Notification System**: Alert customers on order status
7. **Return Management**: Handle returned/damaged items
8. **Analytics**: Track picking efficiency and KPIs

---

## API Endpoints (When Backend Ready)

```
POST   /api/stock-out/requests          # Create new request
GET    /api/stock-out/requests          # List all requests
GET    /api/stock-out/requests/:id      # Get request details
PATCH  /api/stock-out/requests/:id      # Update request status
POST   /api/stock-out/requests/:id/picks # Add picks
DELETE /api/stock-out/picks/:pickId     # Remove pick
POST   /api/stock-out/complete          # Complete order
```

---

## Support & Troubleshooting

**Issue**: "Cannot proceed to verification"
- **Solution**: Ensure total picked quantity equals order requirement

**Issue**: "Partitions not showing"
- **Solution**: Verify warehouse zone and structure are selected

**Issue**: "Items still in picks after removal"
- **Solution**: Refresh browser or restart workflow


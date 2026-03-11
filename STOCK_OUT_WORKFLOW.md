# Stock Out Workflow Module

## Overview

The Stock Out Workflow module is a comprehensive warehouse management system for handling product outflows. It implements a 5-step sequential workflow that guides users through requesting, approving, locating, picking, and completing stock out operations.

## Features

### 1. **Stock Out Request Step**
- Create a new stock out request with product details
- Fields include:
  - Product Name (required)
  - Product Type (required)
  - Quantity (required)
  - Product Value (required)
  - UOM - Unit of Measurement (required)
  - Vendor (required)
  - Notes (optional)
- All requests are created with "Pending" status
- Form validation ensures all required fields are filled
- Success confirmation displayed after submission

### 2. **Request Approval Step**
- Review pending stock out requests
- View complete product details including:
  - Product information
  - Quantity and value
  - Vendor information
  - Creation date
  - Any notes attached
- Two actions available:
  - **Accept Request**: Approves the request and moves to zone selection
  - **Reject Request**: Rejects the request and stops the workflow
- Request status updates to "Approved" or "Rejected"

### 3. **Zone and Structure Selection Step**
- Select warehouse location hierarchy:
  - **Zones**: Choose the zone where products are located
  - **Structures**: Choose the structure within the zone
  - **Levels**: Choose the level within the structure
- Interactive three-column layout for easy navigation
- Visual feedback showing selected location
- Summary displays available partitions and their quantities
- Validates that all three levels (zone, structure, level) are selected before proceeding

### 4. **Picking Order Step**
- Confirm product picking from selected locations
- Features:
  - Displays product information and requested quantity
  - Visual progress bar showing picking status
  - List of available locations with quantities
  - Add multiple picking locations from different partitions
  - Adjust quantities for each location
  - Visual summary of picking allocation
  - Real-time calculation of total picked quantity
- Validations:
  - Cannot exceed available quantity per location
  - Must pick at least one unit
  - Cannot pick more than requested quantity
- Visual confirmation of picked items

### 5. **Completion Step**
- Final summary of completed stock out
- Displays:
  - Product details
  - Requested vs. picked quantities
  - Picking location details
  - Status badge showing "Completed"
- Actions:
  - **Download Summary**: Export picking details as text file
  - **New Request**: Start a new stock out workflow
- Shows all picking allocations with locations and quantities

## Workflow States

### Request Status Flow
```
Pending → Approval → Approved → Zone Selection → Picking → Completion (Completed)
          ↓
        Rejected (Workflow Stops)
```

### Status Definitions
- **Pending**: Initial status when request is created
- **Approved**: Request approved and ready for location selection
- **Picking**: In the picking process
- **Completed**: Workflow completed successfully
- **Rejected**: Request was rejected during approval

## Data Structure

### StockOutRequest
```typescript
interface StockOutRequest {
  id: string;
  productName: string;
  productType: string;
  quantity: number;
  productValue: number;
  uom: string;
  vendor: string;
  notes?: string;
  status: StockOutStatus;
  createdAt: string;
}
```

### PickingLocation
```typescript
interface PickingLocation {
  zoneId: string;
  zoneName: string;
  structureId: string;
  structureName: string;
  levelId: string;
  levelName: string;
  partitionId: string;
  partitionName: string;
  availableQuantity: number;
}
```

### PickingAllocation
```typescript
interface PickingAllocation {
  locationId: string;
  location: PickingLocation;
  pickedQuantity: number;
}
```

## Component Architecture

### Main Component
- **StockOutWorkflow** (`stock-out-workflow.tsx`): Orchestrates the entire workflow with step navigation

### Step Components
- **StockOutRequestStep** (`stock-out-request-step.tsx`): Handles request creation
- **StockOutApprovalStep** (`stock-out-approval-step.tsx`): Handles request approval/rejection
- **StockOutZoneSelectionStep** (`stock-out-zone-selection-step.tsx`): Handles location selection
- **StockOutPickingStep** (`stock-out-picking-step.tsx`): Handles picking confirmation
- **StockOutCompletionStep** (`stock-out-completion-step.tsx`): Displays completion summary

### Store
- **useStockOutStore** (`stock-out-store.ts`): Zustand store managing workflow state

## State Management

The workflow uses Zustand for state management with the following key actions:

### Request Management
- `addRequest`: Create new stock out request
- `approveRequest`: Approve a request
- `rejectRequest`: Reject a request

### Workflow Navigation
- `setCurrentStep`: Move to specific workflow step
- `startApprovalFlow`: Start approval process
- `startZoneSelection`: Start location selection
- `startPicking`: Start picking process
- `resetWorkflow`: Reset entire workflow

### Location Selection
- `selectZone`: Select warehouse zone
- `selectStructure`: Select structure
- `selectLevel`: Select level
- `setAvailableLocations`: Set available picking locations

### Picking Actions
- `addPickingAllocation`: Add location to picking
- `updatePickedQuantity`: Update picked quantity for location
- `removePickingAllocation`: Remove location from picking
- `confirmPicking`: Confirm all pickings
- `completeWorkflow`: Mark workflow as completed

## Integration with Warehouse Canvas

The Stock Out workflow integrates with the warehouse management system:

1. **Mode Toggle**: Users can switch between Design, Stock In, and Stock Out modes
2. **Stock Out Mode**: Accessed via button in the top-left mode switcher
3. **Data Persistence**: Requests and allocations are stored in Zustand store
4. **UI Integration**: Renders in the side panel when Stock Out mode is active

## Usage Example

```typescript
import { StockOutWorkflow } from '@/components/warehouse/workflow/stock-out-workflow';

export function WarehouseApp() {
  return <StockOutWorkflow />;
}
```

## UI/UX Features

### Visual Feedback
- **Progress Stepper**: Shows current step and completion status
- **Status Badges**: Color-coded status indicators (yellow=pending, green=completed, red=rejected)
- **Progress Bar**: Real-time picking progress visualization
- **Disabled States**: Navigation controls disabled when incomplete

### Accessibility
- Semantic HTML elements
- ARIA labels for interactive components
- Keyboard-friendly form inputs
- Clear error messages

### Responsive Design
- Mobile-responsive layout
- Grid system for form fields
- Adaptable column layouts
- Scrollable content areas for long lists

## Error Handling

The workflow includes comprehensive validation:

- **Request Creation**: Required field validation
- **Quantity Validation**: Numeric and range checks
- **Location Validation**: Ensures all hierarchy levels selected
- **Picking Validation**: Prevents over-picking and under-picking
- **Error Messages**: Clear, user-friendly error messages

## Future Enhancements

Potential improvements for the Stock Out workflow:

1. **Batch Operations**: Handle multiple stock out requests simultaneously
2. **Barcode Scanning**: Integration with barcode scanner for location/product verification
3. **Real-time Inventory**: Live inventory data from connected warehouse system
4. **Audit Trail**: Track all picking operations with timestamps and user info
5. **Reports**: Generate picking reports and stock movement analytics
6. **Mobile App**: Optimize for mobile warehouse picker devices
7. **Notifications**: Email/SMS notifications for approved requests
8. **API Integration**: Connect to ERP/inventory management systems

## File Structure

```
components/warehouse/workflow/
├── stock-out-workflow.tsx              # Main workflow orchestrator
├── stock-out-request-step.tsx          # Request creation
├── stock-out-approval-step.tsx         # Request approval
├── stock-out-zone-selection-step.tsx   # Location selection
├── stock-out-picking-step.tsx          # Picking confirmation
└── stock-out-completion-step.tsx       # Completion summary

store/
└── stock-out-store.ts                  # Zustand store for state management
```

## Notes

- The mock zone/structure/level data in `stock-out-zone-selection-step.tsx` should be replaced with real data from your warehouse system
- The availability information comes from the warehouse partition data
- All quantities are stored as numbers and should be validated for numeric accuracy
- The workflow maintains immutability of state throughout all operations

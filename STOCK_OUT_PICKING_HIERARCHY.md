# Stock Out Picking Hierarchy Guide

## Overview

The Stock Out picking process uses a hierarchical warehouse navigation system to locate and select products for customer orders. Users navigate through the warehouse structure level by level until reaching the partition where products are stored.

## Hierarchical Selection Flow

```
┌─────────────────────────────────────────────────────┐
│          WAREHOUSE SELECTION                         │
├─────────────────────────────────────────────────────┤
│                                                       │
│  Step 1: SELECT ZONE                                │
│  ├─ Cold Storage                                    │
│  ├─ Raw Materials                                   │
│  ├─ Finished Goods          ← Customer orders here  │
│  ├─ Packing Area                                    │
│  └─ Dispatch Area                                   │
│                                                       │
│  ↓                                                   │
│                                                       │
│  Step 2: SELECT STRUCTURE (within chosen Zone)     │
│  ├─ Warehouse                                       │
│  ├─ Section A                                       │
│  ├─ Section B                                       │
│  └─ Section C                                       │
│                                                       │
│  ↓                                                   │
│                                                       │
│  Step 3: SELECT LEVEL (within chosen Structure)    │
│  ├─ Level 1 (Ground Floor)                         │
│  ├─ Level 2 (Mezzanine)                            │
│  └─ Level 3 (Upper Floor)                          │
│                                                       │
│  ↓                                                   │
│                                                       │
│  Step 4: SELECT PARTITION & PICK PRODUCT          │
│  ├─ Partition A (45/100 capacity)                  │
│  ├─ Partition B (78/100 capacity) ← Pick here      │
│  └─ Partition C (32/100 capacity)                  │
│                                                       │
│  ↓                                                   │
│                                                       │
│  Step 5: ENTER PICK QUANTITY & CONFIRM             │
│  └─ Qty: [__5__] units → [Pick]                    │
│                                                       │
└─────────────────────────────────────────────────────┘
```

## Step-by-Step Process

### Step 1: Zone Selection
- **Purpose**: Filter warehouse by functional area
- **Color Indicator**: Blue highlight
- **Actions**: 
  - Click zone button to select
  - Only one zone can be selected at a time
  - Zones contain multiple structures

**Available Zones:**
- **Cold Storage** - Temperature-controlled area for perishables
- **Raw Materials** - Unprocessed inventory
- **Finished Goods** - Packaged products ready for shipment
- **Packing Area** - Order assembly and packaging location
- **Dispatch Area** - Staging area before shipment

### Step 2: Structure Selection
- **Purpose**: Narrow down to specific storage unit within zone
- **Color Indicator**: Amber highlight
- **Parent**: Selected Zone
- **Actions**:
  - Only appears after zone selection
  - Multiple structures in each zone
  - Click to select specific structure

**Structure Types:**
- Warehouse (main structure)
- Section A, B, C (subsections)
- Block (smallest structural unit)

### Step 3: Level Selection
- **Purpose**: Choose vertical level within structure
- **Color Indicator**: Green highlight
- **Parent**: Selected Structure
- **Actions**:
  - Only appears after structure selection
  - Typically 3 levels per structure
  - Single level selection per picking operation

**Levels:**
- **Level 1** - Ground floor (heavy items)
- **Level 2** - Mezzanine (medium items)
- **Level 3** - Upper floor (light/small items)

### Step 4: Partition Selection & Product Picking
- **Purpose**: Select specific compartment and pick quantities
- **Color Indicator**: Green highlight (available), Red tint (full)
- **Parent**: Selected Level
- **Actions**:
  - Each partition shows:
    - Partition name and code
    - Current capacity (used/max)
    - Capacity bar (red=full, amber=3/4, green=available)
    - Available quantity
  - Pick quantity input
  - Confirm pick button

**Partition Details:**
```
┌────────────────────────────────────────────┐
│ Partition B                   ✓ Picked     │
│ Code: PB                                    │
├────────────────────────────────────────────┤
│ Capacity: 78/100                           │
│ [████████░░░░░░░░░░░░░░░] 78%            │
│ Available: 22 units                        │
├────────────────────────────────────────────┤
│ Pick Quantity: [___5___]                   │
│ Max: 22 units        [PICK BUTTON]        │
└────────────────────────────────────────────┘
```

### Step 5: Quantity Entry & Confirmation
- **Input**: Pick quantity in units
- **Validation**:
  - Must be > 0
  - Cannot exceed remaining order quantity
  - Cannot exceed available partition capacity
- **Feedback**: Max allowed quantity displayed
- **Action**: Click [Pick] to add to cart

## Picking Cart Management

### Picked Items Display

```
5 Picked Locations

① Partition B          [Remove]
   Qty: 5 units

② Partition A          [Remove]
   Qty: 3 units

③ Partition C          [Remove]
   Qty: 2 units
```

**Features:**
- Numbered list showing pick order
- Each entry shows partition name and picked quantity
- Remove button for corrections
- Real-time total tracking

### Progress Tracking

```
Picking Progress
12 / 20 [████████░░░░░░░] 60%

Remaining: 8 units
```

## User Interactions

### Selection Actions
| Action | Result |
|--------|--------|
| Click Zone | Filters structures, resets lower selections |
| Click Structure | Filters levels, resets level/partition |
| Click Level | Filters partitions |
| Click Partition | Shows pick controls (if available) |
| Enter Quantity | Updates max value based on availability |
| Click [Pick] | Adds to picking cart |
| Click [Remove] | Removes from picking cart |

### Status Indicators

#### Partition Status Badges
- **✓ Picked** - Green badge, already picked from this partition
- **Full** - Red badge, partition at max capacity
- **Available** - Normal state, ready to pick
- **Disabled** - Gray, no remaining quantity to pick

#### Capacity Bar Colors
- **Green** (0-50%) - Plenty of space available
- **Amber** (50-80%) - Getting full
- **Red** (80-100%) - Nearly or fully packed

## Navigation Tips

### Best Practices for Efficient Picking

1. **Plan Your Route**
   - Identify all zones that contain ordered product
   - Plan efficient picking sequence through warehouse

2. **Check Capacity Before Picking**
   - Review capacity bar before selecting quantity
   - Partition capacity affects available quantity

3. **Use Accurate Quantities**
   - Enter exact pick quantities
   - Reduces need for corrections

4. **Verify as You Go**
   - Confirm each pick is correct
   - Check picked items summary before proceeding

5. **Manage Errors**
   - Use [Remove] button to undo any picks
   - Re-pick from correct partition if needed

## Example Picking Scenario

### Scenario: Pick 20 units of "Electronics Kit"

```
1. Click Zone: "Finished Goods"
   ├─ Structures appear: Warehouse-A, Section-B, Section-C

2. Click Structure: "Warehouse-A"
   ├─ Levels appear: Level 1, Level 2, Level 3

3. Click Level: "Level 2"
   ├─ Partitions appear: A, B, C

4. Click Partition B
   ├─ Shows: 78/100 capacity, 22 available
   ├─ Enter: 5 units
   ├─ Click: [Pick] ✓

5. Click Partition A
   ├─ Shows: 45/100 capacity, 55 available
   ├─ Enter: 10 units
   ├─ Click: [Pick] ✓

6. Click Partition C
   ├─ Shows: 32/100 capacity, 68 available
   ├─ Enter: 5 units
   ├─ Click: [Pick] ✓

7. Progress: 20/20 ✓ Complete
   └─ Picked from 3 partitions: B(5) + A(10) + C(5)
```

## Workflow Completion

### Next Steps After Picking Complete

✓ All required quantity picked (0 remaining)
↓
Click: "Continue to Verification"
↓
**Verification Step**: Verify each picked item details
↓
**Completion Step**: Order summary and dispatch preparation

## Troubleshooting

### Issue: Can't Pick from Partition
**Possible Causes:**
- Partition is at full capacity
- Order quantity already fully picked
- Partition contains different product

**Solution:**
- Select different partition with available capacity
- Check order details match partition contents

### Issue: Need to Unpick Items
**Solution:**
- Find item in "Picked Items" summary
- Click [Remove] button to undo pick
- Re-enter quantity and re-pick if needed

### Issue: Can't Navigate to Partition
**Solution:**
- Verify zone is selected (blue highlight)
- Verify structure is selected (amber highlight)
- Verify level is selected (green highlight)
- Then partition options will appear

## Technical Details

### Data Structure
```typescript
interface PickDetail {
  structureId: string;      // Warehouse section identifier
  levelId: string;          // Vertical level identifier
  partitionId: string;      // Specific compartment identifier
  partitionName: string;    // Display name (e.g., "Partition B")
  pickedQuantity: number;   // Units picked from this location
}
```

### Validation Rules
```
✓ Pick Quantity > 0
✓ Pick Quantity <= Remaining Order Quantity
✓ Pick Quantity <= Partition Available Capacity
✓ At least 1 pick required before proceeding
✗ Cannot pick more than order total
✗ Cannot pick from full partitions
```

### State Management (Zustand Store)
- `selectedZoneId` - Current zone selection
- `selectedStructureId` - Current structure selection
- `selectedLevelId` - Current level selection
- `picks[]` - Array of all picks made
- `remainingQuantity` - Units still needed

## Summary

The hierarchical picking system provides:
- **Organized Navigation**: Zone → Structure → Level → Partition
- **Real-time Feedback**: Capacity info, availability checks
- **Flexibility**: Pick from multiple partitions
- **Efficiency**: Visual indicators and progress tracking
- **Accuracy**: Validation and correction tools

This design ensures warehouse staff can quickly locate and pick the correct quantities of products for customer orders.

# Stock Out Picking Flow - Redesign Documentation

## Overview

The picking flow has been redesigned to provide a simpler, more direct user experience. Instead of navigating through multiple hierarchical levels (Structure → Level → Partition), users now:

1. **Click a Zone** to immediately see all available locations
2. **Select a Partition + Level combination** from that zone
3. **Enter pick quantity** and confirm

This streamlines the picking process and reduces navigation steps.

---

## New Picking Flow

### Step 1: Zone Selection
```
User sees grid of available zones:
┌─────────────────┬─────────────────┐
│ Cold Storage    │ Finished Goods  │
│ 27 locations    │ 35 locations    │
└─────────────────┴─────────────────┘
```
- User clicks a zone to reveal all picking locations in that zone
- Zone highlights in blue when selected
- Location count displayed for reference

### Step 2: Location Discovery
When zone is selected, all locations appear grouped by level:
```
Level 1
├─ Partition A (45/100) - 55 available
├─ Partition B (78/100) - 22 available  
└─ Partition C (32/100) - 68 available

Level 2
├─ Partition A (60/100) - 40 available
├─ Partition B (90/100) - 10 available
└─ Partition C (12/100) - 88 available

Level 3
└─ ...
```

Each location shows:
- Partition letter (A, B, C, etc.)
- Capacity bar (visual fill indicator)
- Used/Max capacity
- Available units

### Step 3: Location Selection & Picking
- User clicks a location card to expand it
- Card highlights in blue when selected
- Pick input field appears with auto-focus
- Pick button (green) becomes active

```
Partition A
───────────────────────────
Available: 55 units

Pick Qty: [___5___] ✓
Max: 55
```

### Step 4: Pick Confirmation
- User enters quantity (validated against available and remaining)
- Clicks green [+] button
- Pick is recorded
- Card shows green "✓ Picked" badge
- Pick appears in "Items Picked" summary below

---

## UI Components

### Zone Selection Grid
- 2 columns layout
- Blue highlight when selected
- Shows location count preview

### Location Cards (Grouped by Level)
- Header: Zone name and location count
- Level sections with amber background
- Each partition card shows:
  - Partition identifier (circle with letter)
  - Capacity bar with color coding
  - Used/Max capacity text
  - Available units
  - Status badges (Picked, Full)

### Pick Input Section (Expandable)
- Text input for quantity
- Max quantity displayed as helper
- Green [+] button to confirm pick

### Items Picked Summary
- Green header with counter
- Numbered list of picked items
- Quantity and unit for each
- Red [×] button to remove picks

---

## Visual Design

### Color Scheme
- **Zone Selection**: Blue (#3B82F6) highlight
- **Level Groups**: Amber (#FBBF24) background
- **Location Cards**: White background with borders
- **Picked Items**: Green (#16A34A) background
- **Full Partitions**: Red (#EF4444) background

### Capacity Bar Colors
- Green (0-50% filled): Spacious
- Amber (50-80% filled): Filling
- Red (80-100% filled): Nearly full

### Typography
- Zone labels: Bold small text
- Location count: Muted small text
- Partition identifier: Semibold small text
- Capacity values: Regular small text

---

## Workflow Sequence

```
1. User opens Stock Out request
   ↓
2. Workflow moves to PICKING step
   ↓
3. User sees zone grid
   ↓
4. User clicks a zone (e.g., "Cold Storage")
   ↓
5. Zone highlights blue
   ↓
6. Locations grouped by level appear below
   ↓
7. User clicks a location card (e.g., "Level 1 - Partition A")
   ↓
8. Card highlights blue
   ↓
9. Pick input section expands
   ↓
10. User enters quantity (e.g., "10")
    ↓
11. User clicks green [+] button
    ↓
12. Pick is recorded
    ↓
13. Pick appears in "Items Picked" summary
    ↓
14. Remaining quantity updates
    ↓
15. Progress bar updates
    ↓
16. User repeats steps 4-15 until full quantity picked
    ↓
17. User clicks [Next] to go to Verification
```

---

## Advantages Over Previous Design

| Previous Flow | New Flow |
|---|---|
| Zone → Structure → Level → Partition | Zone → Partition+Level |
| 4 navigation levels | 2 navigation levels |
| Unclear which levels/partitions available | All available locations visible at once |
| Must navigate through empty levels | Only shows zones with available partitions |
| Easy to get lost in hierarchy | Direct, clear path to picking |

---

## Implementation Details

### State Management
- `selectedZoneId`: Currently selected zone
- `selectedPartitionLevelId`: Currently selected partition+level combo
- `picks`: Array of completed picks
- `pickQuantity`: Temp input for quantity

### Functions
- `selectZone(zoneId)`: Select a zone and show its locations
- `handleAddPick(partitionId, levelId, quantity)`: Record a pick
- `removePick(partitionId)`: Remove a recorded pick

### Data Structure
```typescript
interface PartitionWithLevel {
  partitionId: string;
  partitionName: string;
  levelId: string;
  levelName: string;
  usedCapacity: number;
  maxCapacity: number;
}
```

---

## User Experience Flow

### First-time User
1. Sees clear zone grid
2. Clicks a zone
3. Immediately sees all available locations
4. Understands structure at a glance
5. Picks items confidently

### Experienced User
1. Quickly scans zone grid
2. Clicks correct zone
3. Rapidly selects multiple locations
4. Completes picks in seconds
5. Moves to verification

---

## Accessibility

- Keyboard navigation supported
- ARIA labels for screen readers
- High contrast capacity bars
- Clear visual feedback on interaction
- Error messages for invalid input

---

## Future Enhancements

1. Search/filter locations by capacity
2. Favorite/recent locations
3. Barcode scanning for locations
4. Batch picking (pick multiple at once)
5. Inventory sync to show real-time availability


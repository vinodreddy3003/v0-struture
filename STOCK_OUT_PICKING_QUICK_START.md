# Stock Out Picking - Quick Start Guide

## 5-Second Overview

**Pick products for customer orders by navigating through warehouse hierarchy:**

```
Zone → Structure → Level → Partition → Pick Quantity
```

## The Picking Interface

### Left Side Panel (Hierarchical Navigation)

```
┌─ ZONE SELECTION ────────────────────┐
│ [Cold Storage]  [Finished Goods] ✓  │
│ [Raw Materials] [Packing Area]      │
└─────────────────────────────────────┘
        ↓
┌─ STRUCTURE SELECTION ───────────────┐
│ [Warehouse]  [Section A] ✓          │
│ [Section B]  [Section C]            │
└─────────────────────────────────────┘
        ↓
┌─ LEVEL SELECTION ───────────────────┐
│ [Level 1]  [Level 2] ✓              │
│ [Level 3]                           │
└─────────────────────────────────────┘
        ↓
┌─ PARTITION SELECTION ───────────────┐
│ ┌─ Partition A (45/100) ─────────┐ │
│ │ Qty: [___] [Pick]              │ │
│ └────────────────────────────────┘ │
│ ┌─ Partition B (78/100) ✓ Picked ─┐ │
│ │ Picked: 5 units [Remove]       │ │
│ └────────────────────────────────┘ │
│ ┌─ Partition C (32/100) ─────────┐ │
│ │ Qty: [___] [Pick]              │ │
│ └────────────────────────────────┘ │
└─────────────────────────────────────┘
```

## How to Pick Products

### Step 1: Select Zone
- Click any zone button (Cold Storage, Finished Goods, etc.)
- Structures in that zone will appear below
- **Example:** Click "Finished Goods" to find packaged products

### Step 2: Select Structure
- Appears after zone selection
- Choose a specific storage section
- **Example:** Click "Warehouse-A" 

### Step 3: Select Level
- Appears after structure selection
- Choose vertical level (Ground, Mezzanine, Upper)
- **Example:** Click "Level 2"

### Step 4: Pick from Partition
1. **See partition info:**
   - Partition name and code
   - Capacity bar (shows how full it is)
   - Available quantity

2. **Enter pick quantity:**
   - Type number in [Qty] field
   - Max shown is what's available
   - Example: "5" units

3. **Click [Pick] button**
   - Adds to your picking cart
   - Button turns [Remove] if you need to undo

### Step 5: Repeat Until Complete
- Pick from multiple partitions if needed
- Keep picking until progress bar shows 100%
- Watch "Remaining: X units" counter

## Visual Indicators

### Color Codes
| Color | Meaning |
|-------|---------|
| Blue | Selected Zone |
| Amber | Selected Structure |
| Green | Selected Level or Picked Item |
| Red | Full or No Capacity |

### Partition Status Badges
- **✓ Picked** - Already picked from here
- **Full** - No space available
- **Available** - Ready to pick from

### Capacity Bar
```
[████████░░░░░░░░░░░░░░░] 78% - Getting Full
[████░░░░░░░░░░░░░░░░░░░░░░] 32% - Plenty Space
[██████████████████████████░] 95% - Almost Full
```

## Picking Cart (Right Side)

```
5 Picked Locations

① Partition B
   Qty: 5 units [Remove]

② Partition A
   Qty: 3 units [Remove]

③ Partition C
   Qty: 2 units [Remove]
```

**Actions:**
- See all picks at a glance
- Numbered for picking order
- Click [Remove] to undo a pick
- Real-time quantity tracking

## Progress Tracking

```
Picking Progress
12 / 20 [████████░░░░░░░] 60%
Remaining: 8 units
```

- **Top**: Total order quantity
- **Bar**: Visual progress
- **Remaining**: Units still needed

## Common Tasks

### To Pick from a Partition
1. Click zone
2. Click structure
3. Click level
4. Enter quantity in partition
5. Click [Pick]

### To Remove a Pick
1. Find item in "Picked Items" list
2. Click [Remove] button
3. Re-pick from correct partition if needed

### To Change Zone
1. Click different zone button
2. Previous selections reset
3. New structure options appear

### To Switch Levels
1. Click different level
2. New partitions appear
3. Previous level's picks stay in cart

## When You're Done

✓ All quantities picked (Remaining: 0)
↓
**Progress bar shows 100%**
↓
**[Continue to Verification] button enables**
↓
Click to move to next step

## Tips for Success

1. **Read Capacity Info** - Check available space before picking
2. **Enter Correct Qty** - Reduces corrections later
3. **Pick in Order** - Work systematically through warehouse
4. **Check Progress** - Keep eye on remaining units counter
5. **Use Remove Button** - Easy to undo if you make a mistake

## Keyboard Shortcuts

- **Tab** - Navigate between inputs
- **Enter** - Submit quantity (same as [Pick])
- **Escape** - Close any open dialogs

## Troubleshooting

| Problem | Solution |
|---------|----------|
| Partition not showing | Select zone → structure → level first |
| Can't pick | Partition might be full - try another partition |
| Want to unpick | Click [Remove] on item in cart |
| Numbers wrong | Click [Remove] and re-pick with correct qty |

## Example: Pick 20 Units

```
ORDER: Electronics Kit - 20 units needed

ZONE: Finished Goods ✓
STRUCTURE: Warehouse-A ✓
LEVEL: Level 2 ✓

PARTITION B: Available 22 units
├─ Enter: 5
├─ Click: [Pick] ✓ (Remaining: 15)

PARTITION A: Available 55 units
├─ Enter: 10
├─ Click: [Pick] ✓ (Remaining: 5)

PARTITION C: Available 68 units
├─ Enter: 5
├─ Click: [Pick] ✓ (Remaining: 0)

RESULT: ✓ All 20 units picked from 3 locations
NEXT: Click [Continue to Verification]
```

## Navigation Hierarchy Reminder

```
START HERE
    ↓
  ZONE
    ↓
STRUCTURE
    ↓
  LEVEL
    ↓
PARTITION (Pick From Here)
    ↓
CONFIRM QUANTITY
    ↓
  REPEAT UNTIL COMPLETE
```

---

**Need more details?** See `STOCK_OUT_PICKING_HIERARCHY.md` for comprehensive guide.

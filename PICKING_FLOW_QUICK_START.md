# Stock Out Picking Flow - Quick Start Guide

## 5-Minute Overview

### The New Picking Process

Instead of navigating through multiple menus, the new picking flow is **Zone First**:

1. **Select a Zone** - Click on the zone where products are stored (Cold Storage, Finished Goods, etc.)
2. **View Locations** - All partitions and levels in that zone appear, grouped by level
3. **Pick a Location** - Click a partition card to select it
4. **Enter Quantity** - Input how many units to pick from that location
5. **Confirm** - Click the green [+] button to record the pick
6. **Repeat** - Continue picking from different locations until the full order is fulfilled

---

## Visual Layout

### 1. Zone Selection Screen
```
┌──────────────────────────────────┐
│ PICKING PROCESS                  │
│ Select a zone to begin           │
├──────────────────────────────────┤
│ ┌─────────┐  ┌─────────┐         │
│ │ COLD    │  │FINISHED │         │
│ │STORAGE  │  │ GOODS   │         │
│ │27 locs  │  │35 locs  │         │
│ └─────────┘  └─────────┘         │
│                                  │
│ Select a zone above to start     │
└──────────────────────────────────┘
```

### 2. After Zone Selected - Location List
```
┌──────────────────────────────────┐
│ Available Locations - Cold Storage│
├──────────────────────────────────┤
│ LEVEL 1                          │
│ ┌────────────────────────────────┤
│ │ A  Partition A                 │
│ │    ████████░░  45/100 (55 avail)│
│ └────────────────────────────────┤
│ ┌────────────────────────────────┤
│ │ B  Partition B                 │
│ │    ███████████░ 78/100 (22 avail)│
│ └────────────────────────────────┤
│                                  │
│ LEVEL 2                          │
│ ┌────────────────────────────────┤
│ │ A  Partition A                 │
│ │    ██████░░░░░ 60/100 (40 avail)│
│ └────────────────────────────────┤
└──────────────────────────────────┘
```

### 3. Location Selected - Pick Input Appears
```
┌──────────────────────────────────┐
│ ┌────────────────────────────────┤
│ │ A  Partition A    ✓ SELECTED   │
│ │    ████████░░  45/100 (55 avail)│
│ │                                │
│ │  Pick Qty: [___10___]  ✓      │
│ │  Max: 55                       │
│ └────────────────────────────────┤
└──────────────────────────────────┘
```

### 4. After Pick Recorded
```
┌──────────────────────────────────┐
│ PICKED ITEMS (1)                 │
├──────────────────────────────────┤
│ ① Level 1 - Partition A          │
│    Qty: 10 units          [×]    │
└──────────────────────────────────┘

Progress: 10/20 ████████░░░░░░░ 50%
```

---

## Step-by-Step Instructions

### Step 1: Choose Your Zone
- Look at the zone grid at the top
- Click the zone where you need to pick items
- **Zone will highlight in BLUE** to show it's selected

### Step 2: Review Available Locations
- All locations in that zone appear below
- They're organized by **Level** (Level 1, Level 2, Level 3)
- Each partition shows:
  - **Name**: Letter (A, B, C, etc.)
  - **Capacity Bar**: Visual fill indicator
  - **Availability**: How many units are available

### Step 3: Select a Location
- Click on a partition card to select it
- **Card will highlight in BLUE** when selected
- **Pick input field appears** automatically (with cursor ready)

### Step 4: Enter Pick Quantity
- Type the number of units to pick
- **Max quantity** shown as reference
- Don't exceed the available amount

### Step 5: Confirm the Pick
- Click the green **[+]** button
- Pick is recorded
- **Partition card turns GREEN** with "✓ Picked" badge
- Pick appears in **"Items Picked"** section below

### Step 6: Continue Picking
- You can pick from the same zone again (different locations)
- Or select a different zone
- Repeat until all required quantity is picked

### Step 7: Remove a Pick (if needed)
- In "Items Picked" section, click **[×]** button next to a pick
- That pick will be removed
- You can pick from that location again

---

## Key Tips

### ✓ Do This
- Pick from multiple locations if product is distributed
- Check the capacity bar - green=lots available, red=nearly full
- Use the progress bar to track how much you've picked
- Pick in order from the list for efficient workflow

### ✗ Don't Do This
- Try to pick more than available quantity
- Pick from a location marked "Full"
- Skip steps or try to navigate manually
- Pick more than the required quantity

---

## Common Scenarios

### Scenario 1: Product in One Location
```
1. Select zone
2. Click partition A
3. Enter 20 (full quantity)
4. Click [+]
5. DONE - Pick complete
```

### Scenario 2: Product Spread Across Locations
```
1. Select zone
2. Click partition A → Pick 10
3. Click partition B → Pick 5
4. Click partition C → Pick 5
5. DONE - All 20 picked
```

### Scenario 3: Need to Switch Zones
```
1. Select Cold Storage → Pick 12
2. Select Finished Goods → Pick 8
3. DONE - Mixed locations
```

### Scenario 4: Made a Mistake
```
1. See wrong pick in "Items Picked" section
2. Click [×] button to remove
3. Select correct location
4. Enter correct quantity
5. Click [+] to confirm
```

---

## Troubleshooting

| Issue | Solution |
|---|---|
| Can't see locations | Did you click a zone? Locations only appear after zone selection |
| Can't pick - input disabled | Location might be already picked or full. Try a different one |
| Exceeded maximum quantity | The input won't allow it. Clear and enter a smaller number |
| Pick quantity showing 0 | Pick quantity input must be > 0. Enter at least 1 |
| Need to change a pick | Click [×] on the pick in "Items Picked" and try again |

---

## Progress Tracking

### Progress Bar Shows
```
Picking Progress
10 / 20 [████████░░░░░░░] 50%
Remaining: 10 units
```

- **Left number**: How much you've picked
- **Right number**: Total required
- **Bar**: Visual representation
- **Remaining**: How much left to pick

### When You're Done
- Progress bar reaches 100%
- **[Next]** button appears
- Click to move to Verification step

---

## Next Steps

After you've picked all items:
1. Verification step shows all your picks
2. Confirm each item
3. Complete the order
4. Order is ready for dispatch


# Stock Out Workflow - Quick Start Guide

## Getting Started

The Stock Out Workflow module is now fully integrated into your warehouse management system. Here's how to use it:

## Step-by-Step Usage

### 1. Access Stock Out Mode
- Navigate to the warehouse canvas
- In the top-left corner, click the **"Stock Out"** button (third mode button with Package icon)
- The side panel will switch to Stock Out workflow mode

### 2. Create a Stock Out Request
- Fill in the form with product information:
  - **Product Name**: Enter the product name (e.g., "Widget A")
  - **Product Type**: Specify the type (e.g., "Hardware")
  - **Quantity**: Enter the quantity to stock out (e.g., 100)
  - **Product Value**: Enter the value per unit
  - **UOM**: Unit of measurement (e.g., "units", "kg", "box")
  - **Vendor**: Vendor name
  - **Notes**: Any additional notes (optional)
- Click **"Create Request"** button
- You'll see a success message

### 3. Approve/Reject Request
- The system shows the request in "Pending Approval" state
- Review the request details
- Click either:
  - **"Approve & Continue"**: Move to location selection
  - **"Reject"**: Stop the workflow
- If approved, the workflow advances to Step 3

### 4. Select Warehouse Location
- Choose the storage location hierarchy:
  - Select a **Zone** (e.g., "Zone A - Raw Materials")
  - Select a **Structure** (e.g., "Structure 1")
  - Select a **Level** (e.g., "Level 1")
- The system displays available partitions in the selected location
- Review the summary of selected location
- Click **"Continue to Picking"** to proceed

### 5. Confirm Picking
- The system shows:
  - Product information
  - Requested quantity
  - Available locations with quantities
  - Real-time picking progress
- For each available location:
  - Click **"Add from this location"** to select it
  - Enter the quantity to pick from that location
  - Remove locations with **Delete** button if needed
- Monitor the progress bar to see if you've picked the full amount
- Click **"Confirm Picking"** when done

### 6. Review Completion Summary
- View the final summary showing:
  - Product details
  - Requested vs. actual picked quantity
  - All picking locations and quantities
  - Status: "Completed"
- Download the summary as a text file using **"Download Summary"** button
- Click **"New Request"** to start another stock out workflow

## Workflow Navigation

### Between Steps
- Use the horizontal **Step Progress Indicator** at the top to see current progress
- The **"Back"** button (when available) allows you to return to the previous step
- Each step must be completed before moving to the next

### Reset Workflow
- Click **"New Request"** at completion step to reset and start over
- Or use the **"Back"** button to navigate backwards

## Viewing Previous Requests

On the Request creation step, scroll down to see a list of all previous stock out requests with:
- Product name
- Current status (Pending, Approved, Rejected, Picking, Completed)
- Product type, quantity, vendor
- Creation date

## Status Indicators

- **Yellow Badge** - Pending Approval
- **Blue Badge** - Approved/In Progress
- **Red Badge** - Rejected
- **Green Badge** - Completed

## Tips for Success

### Best Practices
1. **Verify Quantities**: Always double-check product quantities before confirming picking
2. **Check Location**: Ensure you've selected the correct warehouse zone/structure/level
3. **Add Multiple Locations**: If products are split across locations, add all locations to the picking plan
4. **Monitor Progress**: Watch the progress bar to ensure you're picking the correct total quantity
5. **Download Records**: Always download the summary for audit trails

### Common Issues

**"Quantity cannot exceed available quantity" error**
- The quantity you entered is more than what's available in that location
- Reduce the quantity or select a different location

**Cannot proceed to next step**
- You haven't completed required actions in the current step
- Check for any validation errors (they appear in red)
- Ensure all required selections are made

**Missing locations**
- Make sure you've selected all three levels (Zone → Structure → Level)
- The system needs these to populate available picking locations

## Integration Features

### Mode Switching
The Stock Out workflow integrates seamlessly with other warehouse modes:
- **Design Mode**: Create warehouse layout
- **Stock In Mode**: Receive and add inventory
- **Stock Out Mode**: Remove inventory (Current)

### Data Persistence
All stock out requests are maintained in the application state and include:
- Request creation date and time
- Full product information
- Status history
- Picking allocations

## Example Workflow

**Scenario**: Remove 50 units of "Laptop Batteries" to send to a distributor

1. **Create Request**
   - Product Name: Laptop Batteries
   - Type: Electronics
   - Quantity: 50
   - Value: $25.00
   - UOM: units
   - Vendor: Storage Facility A

2. **Approve**: Review and approve the request

3. **Select Location**: Choose
   - Zone: Electronics Storage
   - Structure: Shelf Unit 3
   - Level: Level 2

4. **Pick**: 
   - Available partitions show 50 units in Partition 2A
   - Add location and enter 50 units to pick
   - Progress shows 50/50 complete

5. **Complete**: 
   - Summary confirms 50 units picked
   - Download record for shipping documentation

## Next Steps

For more detailed information about the workflow, please refer to:
- `STOCK_OUT_WORKFLOW.md` - Comprehensive technical documentation
- Code comments in individual component files
- Warehouse canvas integration guide

---

**Version**: 1.0
**Last Updated**: 2026-03-11

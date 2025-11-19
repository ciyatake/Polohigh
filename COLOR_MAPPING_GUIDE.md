# Color Palette Mapping Guide

## Overview
This document explains how color palettes are synchronized between the product uploader (admin) and advanced filters (user-facing) to ensure consistent color filtering across the application.

## Shared Color Constants

All color definitions are centralized in `/client/src/constants/colors.js`:

```javascript
export const COMMON_COLORS = [
  { name: "black", label: "Black", hex: "#000000", value: "black" },
  { name: "white", label: "White", hex: "#FFFFFF", value: "white" },
  { name: "red", label: "Red", hex: "#DC2626", value: "red" },
  { name: "blue", label: "Blue", hex: "#2563EB", value: "blue" },
  { name: "green", label: "Green", hex: "#059669", value: "green" },
  { name: "pink", label: "Pink", hex: "#EC4899", value: "pink" },
  { name: "purple", label: "Purple", hex: "#7C3AED", value: "purple" },
  { name: "yellow", label: "Yellow", hex: "#EAB308", value: "yellow" },
  { name: "orange", label: "Orange", hex: "#EA580C", value: "orange" },
  { name: "brown", label: "Brown", hex: "#92400E", value: "brown" },
  { name: "grey", label: "Grey", hex: "#6B7280", value: "grey" },
  { name: "navy", label: "Navy", hex: "#1E3A8A", value: "navy" },
];
```

## Components Using Shared Colors

### 1. Advanced Filters (`/client/src/components/common/AdvancedFilters.jsx`)
- **Purpose**: User-facing filter component for product browsing
- **Display**: Shows color swatches with names in a 3-column grid
- **Implementation**: Imports `COMMON_COLORS` from constants
- **Filter Behavior**: Sends color names (lowercase) to backend API

### 2. Color Picker (`/client/src/components/admin/products/ColorPicker.jsx`)
- **Purpose**: Admin interface for selecting product colors during upload
- **Display**: Shows color swatches in quick-add grid
- **Implementation**: Imports `COMMON_COLORS` from constants
- **Storage Format**: Saves colors with `{ id, name, hex, value }` structure

### 3. HomePage Mobile Filters (`/client/src/pages/user/HomePage.jsx`)
- **Purpose**: Mobile responsive filter interface
- **Implementation**: Imports `COMMON_COLORS` from constants
- **Filter Behavior**: Allows users to select colors for filtering

## Backend Color Filtering

### Product Model (`/server/models/Product.js`)
- Variant schema stores colors as:
  ```javascript
  color: {
    name: String,  // lowercase color name
    hex: String    // hex color code
  }
  ```

### Product Controller (`/server/Controllers/productController.js`)
- Color filtering logic:
  ```javascript
  filter["variants.color.name"] = { $in: colorArray.map(c => c.toLowerCase()) };
  ```
- The `getAvailableColors()` method returns colors in format:
  ```javascript
  {
    value: colorName,
    label: ColorName (capitalized),
    hex: hexCode
  }
  ```

## How Color Filtering Works

1. **Admin uploads product**:
   - Selects colors from `ColorPicker` component
   - Colors stored in database with lowercase `name` and `hex` values

2. **User browses products**:
   - Views color options in `AdvancedFilters` or mobile filters
   - Selects desired colors

3. **Filter request sent to backend**:
   - Color names sent as array (e.g., `["red", "blue"]`)
   - Backend queries `variants.color.name` field

4. **Results returned**:
   - Products matching selected colors displayed
   - Available colors shown based on active product variants

## Key Points for Consistency

✅ **Single Source of Truth**: All components import from `/client/src/constants/colors.js`

✅ **Lowercase Storage**: Color names stored in lowercase in database

✅ **Exact Hex Matching**: Hex codes must match exactly between admin and filters

✅ **Label Consistency**: All components use the same color labels (e.g., "Grey" not "Gray")

## Adding New Colors

To add a new color to the palette:

1. Update `/client/src/constants/colors.js`:
   ```javascript
   { name: "teal", label: "Teal", hex: "#14B8A6", value: "teal" }
   ```

2. The new color will automatically appear in:
   - Advanced Filters
   - Mobile Filters
   - Product Upload ColorPicker

3. No backend changes needed - the filtering logic is dynamic

## Troubleshooting

**Colors not filtering correctly?**
- Verify color names match exactly (case-insensitive on backend)
- Check hex codes are identical in constants file
- Ensure product variants have colors assigned

**New colors not showing?**
- Clear browser cache
- Restart development server
- Check import statements in components

**Mismatched colors between admin and filter?**
- Both should import from `/client/src/constants/colors.js`
- Update any hardcoded color arrays to use the shared constant

# Printing Guidelines for Ikea Skadis meets 2020 Adapters

## Overview

This document provides guidelines for 3D printing the adapters and joins designed for compatibility with Ikea Skadis pegboards and 2020 aluminium extrusion rods. Following these guidelines will help ensure optimal print quality and functionality of the models.

## Recommended Printing Settings

- **Layer Height**: 0.2 mm for a good balance between detail and print time.
- **Perimeters**: 4 perimeters for optimal strength.
- **Top and Bottom Layers**: 8 layers for solid surfaces.
- **Infill**: 15% infill for join plates is sufficient; structural integrity primarily comes from perimeters and solid layers.
- **Seam Position**: Random seams are strongly recommended. This setting is critical for structural integrity as it prevents the creation of a single weak point along the model. In slicer software:
  - In PrusaSlicer/SuperSlicer: Set "Seam Position" to "Random"
  - In Cura: Set "Z Seam Alignment" to "Random"
  - In Simplify3D: Enable "Randomize start points"
- **Supports**: No supports needed; models are designed to print without support material.

## Material Recommendations

- **PCTG (Preferred)**: The optimal material for these adapters due to its excellent combination of impact resistance, durability, and printing ease. PCTG offers better layer adhesion than regular PETG with less brittleness than PLA.
- **PETG**: A good alternative offering durability and flexibility; recommended for functional parts.
- **PLA+**: Stronger than standard PLA; suitable for moderate load applications in stable temperature environments.
- **ABS**: Provides good strength and heat resistance; requires a heated bed and proper ventilation.

### Recommended Filament Suppliers

**For PCTG (Recommended):**
- **Europe**: 
  - [Extrudr PCTG](https://www.extrudr.com/en/inlt/products/pctg/) - Excellent filaments with consistent diameter and superior layer adhesion
  - [Fiberlogy PCTG](https://fiberlogy.com/en/fiberlogy-filaments/pctg/) - High-quality PCTG with excellent transparency and color options

- **United States**: 
  - [Fusion Filaments PCTG](https://fusionfilaments.com/collections/pctg-filament) - Known for tight tolerance specifications
  - [Printed Solid by Jessie PCTG](https://www.printedsolid.com/collections/1-75mm-filament/material_pctg) - Offers good layer adhesion and minimal warping
  - [MatterHackers Pro PCTG](https://www.matterhackers.com/s/store?q=pctg) - Excellent strength characteristics

- **Global**: 
  - [Polymaker PolyMax PCTG](https://polymaker.com/product/polymax-pctg/) - Available through various resellers worldwide

PCTG prints at similar temperatures to PETG (230-250°C) but typically requires less drying before use and exhibits less stringing during printing.

## Tips for Successful Printing

1. **Bed Adhesion**: Ensure proper bed adhesion to prevent warping. Use a suitable adhesive or print on a textured surface.
2. **Calibration**: Regularly calibrate your printer to maintain accuracy in dimensions.
3. **Cooling**: Use adequate cooling for PLA prints to improve surface finish and detail.
4. **Test Prints**: Consider printing single test pieces to verify settings before printing larger batches.

## Screw Selection Based on Print Orientation

The designs in this project have already taken into account optimal print orientation for strength and durability. The mounting holes have been specifically designed with the following considerations:

- **Countersunk Holes:** Positioned where the hole is perpendicular to print layers for better pressure distribution.

- **Flat Head Holes:** Used where the screw hole runs parallel to print layers to prevent layer separation.

Simply follow the recommended print orientations provided with each model file to achieve the intended strength characteristics.

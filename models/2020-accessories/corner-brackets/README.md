# 2020 Aluminium Extrusion Corner Brackets

These corner brackets are designed to join 2020 aluminium extrusion profiles at 90° angles, providing a strong and precise connection for building frames and structures. Multiple configurations are available to suit different requirements and use cases.

![Corner Bracket Image](../../../images/2020_corner_brackets/2020%20flat%20M5%202x2%20-%20mounted.jpg)

## Features

- **High Strength**: Designed to provide sturdy support for 2020 extrusion frames
- **Multiple Configurations**: Available with various screw types and hole counts
- **Easy Installation**: Simple mounting with common M4 or M5 screws
- **Customizable**: Choose the exact configuration that meets your project requirements

## Configuration Options

The corner brackets are available in multiple configurations based on the following parameters:

### Screw Parameters:

- **Screw Size**: M4 or M5
- **Screw Head Type**: Flat head or Countersunk (sunk) head

### Wing Configuration (per wing):

- **Number of Holes**: 1 or 2 holes per wing

## Naming Convention

The file naming follows this pattern:
`2020_corner_bracket_{screw_size}_{head_type}_{wing1}x{wing2}.step`

Where:

- `{screw_size}`: M4 or M5
- `{head_type}`: flat or sink
- `{wing1}x{wing2}`: Number of holes on each wing (1x1, 1x2, 2x2)

Examples:

- `2020_corner_bracket_M5_flat_2x2.step` - M5 flat head screws, 2 holes per wing
- `2020_corner_bracket_M4_sink_1x2.step` - M4 countersunk screws, 1 hole on first wing, 2 holes on second wing

## Recommended Usage

### For Light-Duty Applications

- M4 screws with 1x1 hole configuration

### For Medium-Duty Applications

- M5 screws with 1x2 or 2x1 hole configuration

### For Heavy-Duty Applications

- M5 screws with 2x2 hole configuration

## Printing Guidelines

For optimal results when 3D printing these brackets:

- Use PETG or ABS for better strength and durability
- Print with 5 perimeters and no infill for optimal strength
- Enable Arachne walls for better structural integrity
- Use random seam position to improve strength
- **CRITICAL**: Print with the bracket on its side as provided in the print file
- No supports needed when printed in the recommended orientation

> ⚠️ **IMPORTANT**: The side orientation is strongly recommended for optimal strength. When printed on the side, the layers are correctly aligned to bear loads in both wings, providing maximum strength across the entire bracket. The flat variants don't suffer from layer separation weakness like the countersunk variants, but still benefit from the side orientation for optimal layer alignment relative to the forces they'll bear.

## Installation Instructions

1. Position the corner bracket at the desired junction between two 2020 extrusion profiles
2. Mark and pre-drill holes if necessary
3. Secure the bracket using appropriate M4 or M5 screws (flat or countersunk as per your bracket version)
4. Tighten screws firmly but avoid over-tightening which may damage the bracket

### Important Note for Countersunk Variants

When using countersunk (sunk) variants, it's recommended to perform a breaking test with a spare bracket to determine the optimal tightening force. The breaking point will differ significantly based on:

- Printing material (PLA, PETG, ABS, etc.)
- Print settings (perimeters, layer height, etc.)
- Print orientation
- Layer adhesion quality

Over-tightening countersunk screws can cause layer separation and bracket failure. Test until layer adhesion fails to understand the limits of your specific prints.

## Available Files

- `2020_corner_bracket_M4_flat_1x1.step`
- `2020_corner_bracket_M4_flat_1x2.step`
- `2020_corner_bracket_M4_flat_2x2.step`
- `2020_corner_bracket_M4_sink_1x1.step`
- `2020_corner_bracket_M4_sink_1x2.step`
- `2020_corner_bracket_M4_sink_2x2.step`
- `2020_corner_bracket_M5_flat_1x1.step`
- `2020_corner_bracket_M5_flat_1x2.step`
- `2020_corner_bracket_M5_flat_2x2.step`
- `2020_corner_bracket_M5_sink_1x1.step`
- `2020_corner_bracket_M5_sink_1x2.step`
- `2020_corner_bracket_M5_sink_2x2.step`

## Load Capacity

The load capacity of these brackets depends on:

1. Material used for printing
2. Screw size (M5 provides higher strength than M4)
3. Number of screws (2x2 configuration is strongest)
4. Type of load (shear vs. tension)

For critical applications where safety is a concern, appropriate testing should be performed before deployment.

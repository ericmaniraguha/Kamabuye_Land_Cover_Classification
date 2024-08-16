
# Land Cover Classification: Water Body Identification Using Google Earth Engine

## Project Overview

This project focuses on identifying water bodies within the Kamabuye Sector, Bugesera District, using Google Earth Engine (GEE) and Sentinel-2 satellite imagery. The project utilizes specific spectral bands to classify water bodies and visualize them distinctly on the map.

## Methodology

### 1. Configuring Geometry for Water Body Identification

The area of interest (AOI) is defined using a geometry that encompasses the potential locations of water bodies within the Kamabuye Sector. This geometry was carefully selected to include regions where water bodies are likely to be present.
![water classification-2](https://github.com/user-attachments/assets/e1c3d270-037e-4507-b37d-39c68c7c7104)

### 2. Layer Visualization Parameters

To effectively identify and visualize water bodies, the following Sentinel-2 bands were selected:

- **B8 (Near Infrared - NIR)**
- **B4 (Red)**
- **B2 (Blue)**

These bands are particularly useful in distinguishing water from other land cover types. In the visualization:

- **Water bodies** appear as **black** due to their distinct spectral signature in these bands.
![water body features classification-1](https://github.com/user-attachments/assets/e3c6d22e-4596-455a-b10f-2322d2443cb2)

### 3. Selecting the Water Body Area

The Sentinel-2 image collection was filtered to the AOI and processed to highlight water bodies. The steps include:

- **Filtering the Image Collection:**
  - The Sentinel-2 imagery was filtered to match the AOI and a specific date range, ensuring recent and relevant data.
  - The images were also filtered for cloud coverage to reduce noise and enhance clarity.

- **Selecting Appropriate Bands:**
  - The selected bands (B8, B4, B2) were used to create a composite image that effectively highlights water bodies.

- **Visualizing Water Bodies:**
  - The visualization parameters were set to ensure that water bodies appear distinctly as black on the map, making them easy to identify.

### JavaScript Co![water classification](https://github.com/user-attachments/assets/acd7e074-b8c6-4c2c-94ea-0cb80163ebbe)
de Example

```javascript
// Import the Sentinel-2 image collection
// Filter the Sentinel-2 image collection
var sentinel2 = ee.ImageCollection("COPERNICUS/S2_SR_HARMONIZED")
  
var rgbImage = sentinel2.filterBounds(RIO)
                      .filterDate('2021-01-01', '2023-12-31')
                      .filterMetadata('CLOUDY_PIXEL_PERCENTAGE', 'less_than', 1)
                      .median()
                      .clip(RIO)

// Add the RGB image layer to the map
Map.addLayer(rgbImage,imageVisParam,'Sentinel-2 RGB Image');
```

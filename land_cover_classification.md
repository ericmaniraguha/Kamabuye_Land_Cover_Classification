![water_buildup_mapped](https://github.com/user-attachments/assets/fccd99fe-f511-4c20-aead-d7c216268a3f)
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
![water classification-2](https://github.com/user-attachments/assets/e97cd4f4-1743-4f17-8221-5fa6be9fb7b8)

### JavaScript Co![water classification](https://github.com/user-attachments/assets/acd7e074-b8c6-4c2c-94ea-0cb80163ebbe)
de Example

```javascript![Uploading water classification-2.png…]()

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

### 4. Selecting Built-Up Areas

For identifying built-up areas, we use the band combination of **B4 (Red), B3 (Green), and B2 (Blue)**. This combination represents the visible spectrum and creates true-color images, making it easier to distinguish urban and built-up areas from vegetation and other land cover types.

- **Band B4 (Red, 665 nm)**
- **Band B3 (Green, 560 nm)**
- **Band B2 (Blue, 490 nm)**

![Buildup-area-02](https://github.com/user-attachments/assets/28bede69-c23a-4191-ae8d-a80aa19eada4)
![Buildup-area-01](https://github.com/user-attachments/assets/c25344bc-7359-4e77-b8c4-fab0db926b70)
![water_buildup_mapped](https://github.com/user-attachments/assets/1787ee34-83eb-404c-b1cc-85e765bcaca0)

### 5. Selecting Bare Land 

To identify bare land areas, we use the band combination of **B11 (SWIR), B8 (NIR), and B2 (Blue)**. This combination is particularly effective for distinguishing bare land from vegetation and other land covers, as it highlights differences in soil moisture content and vegetation health.

- **Band B11 (Shortwave Infrared - SWIR 1, 1610 nm)**
- **Band B8 (Near-Infrared - NIR, 842 nm)**
- **Band B2 (Blue, 490 nm)**

These combinations are useful not only for identifying bare land but also for agricultural monitoring, environmental studies, and urban planning. Additionally, they can be employed for vegetation analysis, false-color composites, burned area detection, and water body identification.
![image](https://github.com/user-attachments/assets/685cb8f4-9966-4506-a403-bc4540167b23)
![vegetation-identification ](https://github.com/user-attachments/assets/5d12da46-dce3-44e6-81be-cd66bcff71a1)

## Best Band Combination for Agriculture

For agricultural monitoring, the best band combination is **B6 (Red Edge 2), B5 (Red Edge 1), and B2 (Blue)**. This combination is ideal for assessing crop health, vegetation analysis, and identifying different types of vegetation.

- **Band B6 (Red Edge 2, 740 nm)**
- **Band B5 (Red Edge 1, 705 nm)**
- **Band B2 (Blue, 490 nm)**

This combination provides enhanced sensitivity to vegetation health, making it ideal for agricultural applications.

![image](https://github.com/user-attachments/assets/8bf89080-a6a4-42f7-83f1-fad61fb379ff)

### Resources

For more information on band combinations and their applications, refer to the following resources:

- [ESRI Blog: Band Combinations for Landsat 8](https://www.esri.com/arcgis-blog/products/product/imagery/band-combinations-for-landsat-8/?srsltid=AfmBOopM9_Xm7rvC-wc8fr4kjyyl9R5I9BX_ZObFfBs8qEKHor6JIllh)
- [Google Earth Engine: Sentinel-2 Harmonized Bands](https://developers.google.com/earth-engine/datasets/catalog/COPERNICUS_S2_SR_HARMONIZED#bands)


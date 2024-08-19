# Land Cover Classification in Kamabuye Sector - Analysis using Sentinel-2 Imagery

## Steps

1. **Select the Region of Interest (ROI)**
   - Define the geographic boundaries of the Kamabuye Sector as the area of interest.

2. **Choosing and Filtering the Image Collection**
   - Select the Sentinel-2 image collection.
   - Apply filters to the collection based on cloud cover percentage and the desired date range (e.g., 2021-01-01 to 2023-12-31).

3. **Collecting the Training Points**
   - Identify and collect ground truth points for different land cover classes (e.g., buildings, marshland, vegetation).

4. **Merging Training Points**
   - Combine the collected training points into a single dataset that includes all the land cover classes.

5. **Create the Training Dataset by Sampling Regions**
   - Sample the image collection using the training points to create a training dataset that associates spectral information with the land cover classes.

6. **Create the Classifier and Classify the Image**
   - Train a classification model (e.g., Random Forest) using the training dataset.
   - Apply the trained classifier to the image collection to generate a classified image.

7. **Create the Classified Image**
   - Generate a new image where each pixel is labeled according to the predicted land cover class.

8. **Display the Result**
   - Visualize the classified image to assess the classification visually.

9. **Print Confusion Matrix for Accuracy Assessment**
   - Generate a confusion matrix by comparing the classified image against a validation dataset to evaluate the model's accuracy.

10. **Calculate Area for Each Class**
    - Compute the area covered by each land cover class within the ROI.

## Define the Region of Interest (ROI)

```javascript
var RIO = ee.Geometry.Polygon([
  [
    [30.029317259335446, -2.5143636970540246],
    [30.35204064800732, -2.5143636970540246],
    [30.35204064800732, -2.18779600896156],
    [30.029317259335446, -2.18779600896156],
    [30.029317259335446, -2.5143636970540246]
  ]
]);
```

## Cloud Masking Function
This function masks clouds using the Sentinel-2 QA band.

```javascript
function maskS2clouds(image) {
  var qa = image.select('QA60');

  // Bits 10 and 11 are clouds and cirrus, respectively.
  var cloudBitMask = 1 << 10;
  var cirrusBitMask = 1 << 11;

  // Both flags should be set to zero, indicating clear conditions.
  var mask = qa.bitwiseAnd(cloudBitMask).eq(0)
      .and(qa.bitwiseAnd(cirrusBitMask).eq(0));

  return image.updateMask(mask).divide(10000);
}

```

## Load Sentinel-2 Image Collection
Apply filtering based on date, cloud percentage, and region of interest (RIO).

```javascript
var dataset = ee.ImageCollection('COPERNICUS/S2_SR_HARMONIZED')
                  .filterDate('2020-01-01', '2020-01-30')
                  .filter(ee.Filter.lt('CLOUDY_PIXEL_PERCENTAGE', 20))
                  .map(maskS2clouds)
                  .filterBounds(RIO);
```
## Visualization Parameters for Land Cover

```javascript
var visualization = {
  min: 0.0,
  max: 0.3,
  bands: ['B8', 'B4', 'B3'],  // Near-Infrared, Red, Green
};
```

## Center Map and Add Layers
Center the map on the region of interest and add both the land cover and boundary layers.

```javascript

Map.centerObject(RIO, 12);

// Add the land cover visualization layer to the map
Map.addLayer(dataset.mean().clip(RIO), visualization, 'Land Cover within RIO');

// Add the RIO boundaries as a separate layer with a specific style
Map.addLayer(RIO, {color: 'red'}, 'RIO Boundaries');
````

## Incorporate Ground Truth Data
Add a ground truth dataset for comparison. This is a hypothetical example; replace it with actual data.

```javascript
var groundTruth = ee.FeatureCollection([
  ee.Feature(ee.Geometry.Polygon([[30.1, -2.4], [30.2, -2.4], [30.2, -2.3], [30.1, -2.3]]), {class: 'Urban'}),
  ee.Feature(ee.Geometry.Polygon([[30.3, -2.5], [30.4, -2.5], [30.4, -2.4], [30.3, -2.4]]), {class: 'Forest'}),
]);

// Add ground truth data to the map
Map.addLayer(groundTruth, {color: 'blue'}, 'Ground Truth');
```
## Results

Bugesera District -  Kamabuye Sector: ![image](https://github.com/user-attachments/assets/7990167b-e531-4248-a1b9-f0e69faacb1d)


## Summary
This script processes Sentinel-2 imagery over a specific region of interest to visualize land cover. It includes a cloud masking function, applies appropriate filters to the imagery, and overlays ground truth data for comparison. The results are displayed on the map with different layers representing the land cover and the region boundaries, along with ground truth data for validation.


### Explanation:
- **Region of Interest (ROI)**: Defines the geographical area to analyze.
- **Cloud Masking**: Filters out cloudy pixels for clearer imagery.
- **Sentinel-2 Image Collection**: Retrieves and processes satellite images.
- **Visualization Parameters**: Specifies how the data should be displayed.
- **Ground Truth Data**: Adds polygons representing known land cover types to validate the imagery.

You can run this script in Google Earth Engine to visualize the land cover and compare it with ground truth data.


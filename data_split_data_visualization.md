# Land Cover Classification and Visualization with Google Earth Engine

## Overview

This project demonstrates the process of land cover classification using Sentinel-2 imagery and visualizes the classified results through a chart diagram. The workflow includes merging training points, training a classifier, classifying the imagery, and generating a chart to visualize the land cover areas.

## Prepare Training Data

Merge training datasets for various land cover classes:

```javascript
var merged_sample = water
  .merge(buildup)
  .merge(bareland)
  .merge(cropland)
  .merge(vegetation);
```

## Training and Classification

Create Training Dataset
Sample pixel values from the RGB image using the merged training points:

```javascript
var bands = ["B2", "B3", "B4", "B5", "B6", "B7", "B8", "B11", "B12"];

var training = rgbImage.select(bands).sampleRegions({
  collection: merged_sample,
  properties: ["Class"],
  scale: 10,
});
```

## Train the Classifier

#### Train a Random Forest classifier using the training dataset:

```javascript
var classifier = ee.Classifier.smileRandomForest(100).train({
  features: trainingPartition,
  classProperty: "Class",
  inputProperties: bands,
});
```

## Classify the Image

### Apply the trained classifier to the RGB image:

```javascript
var classified = rgbImage.select(bands).classify(classifier);
```

## Visualization

###Generate a Chart Diagram
Create a chart to visualize the area covered by each land cover class:

```javascript
var classLabels = ["Water", "Build up", "Bareland", "Crop Land", "Vegetation"];

var chart = ui.Chart.image.byClass({
  image: ee.Image.pixelArea().multiply(1e-4).addBands(classified),
  classBand: "classification", // Ensure 'classification' is the correct band name
  region: RIO,
  reducer: ee.Reducer.sum(),
  scale: 30,
});
```

## Customize and Display the Chart

### Define class labels and customize chart options:

```javascript
chart.setOptions({
  title: "LULC Area of Kamabuye Sector - Bugesera District",
  vAxis: { title: "Area (Ha)" },
  hAxis: {
    title: "Class",
    ticks: [
      { v: 0, f: "Water" },
      { v: 1, f: "Build up" },
      { v: 2, f: "Bareland" },
      { v: 3, f: "Crop Land" },
      { v: 4, f: "Vegetation" },
    ],
  },
  colors: ["blue", "red", "yellow", "pink", "green"],
});
print(chart);
```

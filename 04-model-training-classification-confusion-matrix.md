# Land Cover Classification and Accuracy Assessment

This project involves classifying land cover in the Kamabuye Sector, Bugesera District, using Sentinel-2 imagery. The classification process includes calculating accuracy and visualizing the results on the map.

## Steps

### 1. Classify the Image

The image is classified into five land cover types: Water, Build up, Bareland, Crop Land, and Vegetation.

```javascript
var classified = rgbImage.select(bands).classify(classifier);
Map.addLayer(
  classified,
  { min: 0, max: 4, palette: ["blue", "red", "yellow", "pink", "green"] },
  "Land Cover Classification"
);
```

## 2. Calculate Accuracy and Confusion Matrix

To evaluate the accuracy of the classification, a confusion matrix is generated, and the overall accuracy is calculated.

```javascript
var testClassification = testingPartition.classify(classifier);
var confusionMatrix = testClassification.errorMatrix("Class", "classification");
print("Confusion Matrix:", confusionMatrix);

var accuracy = confusionMatrix.accuracy();
print("Accuracy:", accuracy);
```

## 3. Create a Confusion Matrix Chart

A table chart is created to visualize the confusion matrix, helping to understand the performance of the classifier.

```javascript
var confusionMatrixArray = ee.Array(confusionMatrix.array());
print("Confusion Matrix Array:", confusionMatrixArray);

var confusionMatrixChart = ui.Chart.array
  .values({
    array: confusionMatrixArray,
    axis: 0,
  })
  .setChartType("Table")
  .setOptions({
    title: "Confusion Matrix",
    vAxis: { title: "True Class" },
    hAxis: { title: "Predicted Class" },
    colorAxis: { colors: ["#ffffff", "#ff0000"] },
  });

print(confusionMatrixChart);
```

## 4. Export the Classified Map

The classified map can be exported to Google Drive for further analysis or presentation.

```javascript
Export.image.toDrive({
  image: classified,
  description: "LandCoverClassification",
  scale: 10,
  region: RIO,
  maxPixels: 1e13,
});
```

## 5. Generate Area Chart for Land Cover Types

An area chart is generated to show the area covered by each land cover type.

```javascript
var chart = ui.Chart.image.byClass({
  image: ee.Image.pixelArea()
    .multiply(1e-4)
    .addBands(classified.rename("classification")),
  classBand: "classification",
  region: RIO,
  reducer: ee.Reducer.sum(),
  scale: 25,
  classLabels: classLabels,
});

chart.setOptions({
  title: "LULC Area of Kamabuye Sector - Bugesera District",
  vAxis: { title: "Area (Ha)" },
  hAxis: { title: "Class" },
  colors: classColors,
});

print(chart);
```

## 6. Create and Add Legend to the Map

A legend is added to the map for better interpretation of the land cover classification.

```javascript
var legend = ui.Panel({
  style: { position: "bottom-left", padding: "8px 15px" },
});

var legendTitle = ui.Label({
  value: "Classification",
  style: {
    fontWeight: "bold",
    fontSize: "18px",
    margin: "0 0 10px 0",
    padding: "0",
  },
});

legend.add(legendTitle);

for (var i = 0; i < classLabels.length; i++) {
  legend.add(makeRow(classColors[i], classLabels[i]));
}

Map.add(legend);
```

## 7. Add Map Title

Finally, a title is added to the map to provide context.

```javascript
var title = ui.Label({
  value: "Land Cover Landuse Classification Kamabuye Map 2021-2023",
  style: {
    fontWeight: "bold",
    fontSize: "20px",
    position: "top-center",
    padding: "8px",
    margin: "0 auto",
    textAlign: "center",
  },
});
Map.add(title);
```

## Conclusion

This process classifies land cover, assesses the accuracy of the classification, and visualizes the results using charts and legends on the map. The classified image can also be exported for further analysis.

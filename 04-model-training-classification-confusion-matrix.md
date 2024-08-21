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
## Results 

### 1. Accuracy: 0.8310626702997275 
### 2. Confusion matrix

![image](https://github.com/user-attachments/assets/cdc0fb9f-96f5-45f3-9bbb-92e79db7eb93)  

### Key Points to Analyze:

```
1. Diagonal Elements (Correct Classifications):
   - High values indicate correctly classified instances.
   - Aim to maximize these values for better model accuracy.

2. Off-Diagonal Elements (Misclassifications):
   - Represent instances that were incorrectly classified.
   - The goal is to minimize these numbers to reduce errors.
```
### Interpretation and Strategy for Improving Accuracy:
```
- Class 0:
  - Correct: 84 instances.
  - Misclassified as: 
    - Class 2: 6 instances.
    - Class 4: 7 instances.
  - Strategy: Improve feature differentiation between Class 0 and Classes 2 and 4.

- Class 1:
  - Correct: 76 instances.
  - Misclassified as: 
    - Class 2: 10 instances.
  - Strategy: Focus on enhancing the separation between Class 1 and Class 2.

- Class 2:
  - Correct: 82 instances.
  - Misclassified as: 
    - Class 1: 10 instances.
    - Class 4: 5 instances.
  - Strategy: Refine features that distinguish Class 2 from both Classes 1 and 4.

- Class 3:
  - Correct: 25 instances.
  - Misclassified as: 
    - Class 0: 8 instances.
    - Class 4: 1 instance.
  - Strategy: Investigate why Class 0 is often confused with Class 3.

- Class 4:
  - Correct: 38 instances.
  - Misclassified as: 
    - Class 0: 7 instances.
    - Class 2: 5 instances.
  - Strategy: Enhance the differentiation between Class 4 and Classes 0 and 2.
```
### Steps to Improve Overall Accuracy:
```
1. Enhance Feature Engineering:
   - Add or refine features to improve class distinction.
   - Consider dimensionality reduction (e.g., PCA) to identify key features.

2. Increase Training Data:
   - Collect more samples, especially for frequently misclassified classes.
   - Use data augmentation techniques like oversampling (e.g., SMOTE) for minority classes.

3. Tweak the Model:
   - Experiment with different classifiers or tune the existing model's hyperparameters.
   - Consider ensemble methods to combine multiple models for better accuracy.

4. Improve Class Balance:
   - Address any class imbalance by oversampling or undersampling underrepresented classes.

5. Cross-Validation:
   - Implement cross-validation to test the model's robustness and improve generalization across different data subsets.

```

### 3. LULC Area of Kamabuye Sector - Bugesera District

![ee-chart (2)](https://github.com/user-attachments/assets/abd62b1c-e6c3-420f-8abe-c604dde97b54)

## 4. Land Cover Landuse Classification Kamabuye Map 2021-2023 
![image](https://github.com/user-attachments/assets/45eeea1e-ffe4-4df2-bc42-62c3b7078aab)

## Conclusion

This process classifies land cover, assesses the accuracy of the classification, and visualizes the results using charts and legends on the map. The classified image can also be exported for further analysis.

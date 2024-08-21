// Import the Sentinel-2 image collection
var sentinel2 = ee.ImageCollection("COPERNICUS/S2_SR_HARMONIZED");

// Filter the Sentinel-2 image collection
var rgbImage = sentinel2.filterBounds(RIO)
                        .filterDate('2021-01-01', '2023-12-31')
                        .filterMetadata('CLOUDY_PIXEL_PERCENTAGE', 'less_than', 1)
                        .median()
                        .clip(RIO);

// Add the RGB image layer to the map
Map.addLayer(rgbImage, imageVisParam, 'Sentinel-2 RGB Image');

// Center the map on the region of interest (optional)
Map.centerObject(RIO, 10);

// Merge all training points together
var merged_sample = water.merge(buildup).merge(bareland).merge(cropland).merge(vegetation);

print('Merged Sample:', merged_sample);

// Band Collection 
var bands = ['B2', 'B3', 'B4', 'B5', 'B6', 'B7', 'B8', 'B11', 'B12'];

// Make a training dataset by sampling regions using pixel values 
var training = rgbImage.select(bands).sampleRegions({
  collection: merged_sample, 
  properties: ['Class'],
  scale: 10
});

print("Training Dataset:", training);

// Split the training dataset into training and testing subsets
var datawithRandom = training.randomColumn();  // Add a column of random numbers

// 80% for training, 20% for testing
var trainingPartition = datawithRandom.filter(ee.Filter.lt('random', 0.8));
var testingPartition = datawithRandom.filter(ee.Filter.gte('random', 0.8));

print('Training Partition:', trainingPartition);
print('Testing Partition:', testingPartition);

// Train the Classifier
var classifier = ee.Classifier.smileRandomForest(100).train({
  features: trainingPartition, 
  classProperty: 'Class', 
  inputProperties: bands
});

// ==================================================================
// Classify the Image
var classified = rgbImage.select(bands).classify(classifier);
Map.addLayer(classified, {min: 0, max: 4, palette: ['blue', 'red', 'yellow', 'pink', 'green']}, 'Land Cover Classification');

// Calculate Accuracy and Confusion Matrix
var testClassification = testingPartition.classify(classifier);
var confusionMatrix = testClassification.errorMatrix('Class', 'classification');
print('Confusion Matrix:', confusionMatrix);

var accuracy = confusionMatrix.accuracy();
print('Accuracy:', accuracy);

// Define the class names for better readability in the chart
var classNames = ['Water', 'Build up', 'Bareland', 'Crop Land', 'Vegetation'];

//  Create the Confusion Matrix Array
// Assuming you already have the confusionMatrix calculated:
var confusionMatrixArray = ee.Array(confusionMatrix.array());
print('Confusion Matrix Array:', confusionMatrixArray);


// Create the Confusion Matrix Array
// Assuming you already have the confusionMatrix calculated:
var confusionMatrixArray = ee.Array(confusionMatrix.array());
print('Confusion Matrix Array:', confusionMatrixArray);

// Define the class names for better readability in the chart
var classNames = ['Water', 'Build up', 'Bareland', 'Crop Land', 'Vegetation'];

// Create a table chart of the confusion matrix
var confusionMatrixChart = ui.Chart.array.values({
  array: confusionMatrixArray,
  axis: 0  // x-axis for predicted classes
})
.setChartType('Table')
.setOptions({
  title: 'Confusion Matrix',
  vAxis: {
    title: 'True Class',
    ticks: [
      {v: 0, f: 'Water'},
      {v: 1, f: 'Build up'},
      {v: 2, f: 'Bareland'},
      {v: 3, f: 'Crop Land'},
      {v: 4, f: 'Vegetation'}
    ]
  },
  hAxis: {
    title: 'Predicted Class',
    ticks: [
      {v: 0, f: 'Water'},
      {v: 1, f: 'Build up'},
      {v: 2, f: 'Bareland'},
      {v: 3, f: 'Crop Land'},
      {v: 4, f: 'Vegetation'}
    ]
  },
  colorAxis: {colors: ['#ffffff', '#ff0000']}  // White to red color gradient
});

// Display the chart
print(confusionMatrixChart);

// Optionally, you can export the classified map
Export.image.toDrive({
  image: classified,
  description: 'LandCoverClassification',
  scale: 10,
  region: RIO,
  maxPixels: 1e13
});


// ====================================End of Model ==============================================

// Define the class labels and corresponding colors
var classLabels = ['Water', 'Build up', 'Bareland', 'Crop Land', 'Vegetation'];
var classColors = ['blue', 'red', 'yellow', 'pink', 'green'];

// Add the classified layer to the map
Map.addLayer(classified, {min: 0, max: 4, palette: classColors}, 'Land Cover Classification');


// Generate the chart using ui.Chart.image.byClass
var chart = ui.Chart.image.byClass({
  image: ee.Image.pixelArea().multiply(1e-4).addBands(classified.rename('classification')),
  classBand: 'classification',  // Ensure this matches your classified image
  region: RIO,
  reducer: ee.Reducer.sum(),
  scale: 25,
  classLabels: classLabels  // Explicitly pass the class labels
});

// Customize the chart with class labels
chart.setOptions({
  title: 'LULC Area of Kamabuye Sector - Bugesera District',
  vAxis: {title: 'Area (Ha)'},
  hAxis: {
    title: 'Class',
    ticks: [
      {v: 0, f: 'Water'},
      {v: 1, f: 'Build up'},
      {v: 2, f: 'Bareland'},
      {v: 3, f: 'Crop Land'},
      {v: 4, f: 'Vegetation'}
    ]
  },
  colors: classColors  // Use the predefined class colors
});

// Display the chart
print(chart);

//===========================================For the map====================
// Create the legend
var legend = ui.Panel({
  style: {
    position: 'bottom-left',
    padding: '8px 15px'
  }
});

// Add a title to the legend
var legendTitle = ui.Label({
  value: 'Classification',
  style: {
    fontWeight: 'bold',
    fontSize: '18px',
    margin: '0 0 10px 0',
    padding: '0'
  }
});

legend.add(legendTitle);  // Add the title to the legend

// Add the title to the map (corrected)
var title = ui.Label({
  value: 'Land Cover Landuse Classification Kamabuye Map 2021-2023',
  style: {
    fontWeight: 'bold',
    fontSize: '20px',
    position: 'top-center',  // Fixed position
    padding: '8px',
    margin: '0 auto',
    textAlign: 'center'
  }
});
Map.add(title);

// Create a function to add color and label to the legend
var makeRow = function(color, name) {
  // Create the color box
  var colorBox = ui.Label({
    style: {
      backgroundColor: color,
      padding: '8px',
      margin: '0 0 4px 0'
    }
  });
  
  // Create the label
  var description = ui.Label({
    value: name,
    style: {
      margin: '0 0 4px 6px'
    }
  });
  
  // Return the row
  return ui.Panel({
    widgets: [colorBox, description],
    layout: ui.Panel.Layout.Flow('horizontal')
  });
};

// Add color and label rows to the legend
for (var i = 0; i < classLabels.length; i++) {
  legend.add(makeRow(classColors[i], classLabels[i]));
}

// Add the legend to the map
Map.add(legend);

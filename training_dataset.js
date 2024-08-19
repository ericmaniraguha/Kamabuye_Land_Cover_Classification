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

// Classify the Image
var classified = rgbImage.select(bands).classify(classifier);

// Define class labels
// var classLabels = ['Water', 'Build up', 'Bareland', 'Crop Land', 'Vegetation'];

// Generate the chart using ui.Chart.image.byClass
var chart = ui.Chart.image.byClass({
  image: ee.Image.pixelArea().multiply(1e-4).addBands(classified),
  classBand: 'classification',  // Ensure this matches your classified image
  region: RIO,
  reducer: ee.Reducer.sum(),
  scale: 25
});visua

// Customize the chart with class labels
chart.setOptions({
  title: 'LULC Area of Kamabuye Sector - Bugesera District',
  vAxis: {title: 'Area (Ha)'},
  hAxis: {
    title: 'Class',
    // ticks: classLabels.map((label, index) => ({v: index, f: label}))
  },
  colors: ['blue', 'red', 'yellow', 'pink', 'green']  // Adjust as needed
});

// Display the chart
print(chart);
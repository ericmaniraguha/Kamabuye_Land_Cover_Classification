// Define the MultiPolygon geometry for the Kamabuye Sector
var RIO = ee.Geometry.MultiPolygon(
    [
      [
        [
          [30.019163681985344, -2.4791343283143186],
          [30.307554795266594, -2.4791343283143186],
          [30.307554795266594, -2.2613110277776594],
          [30.019163681985344, -2.2613110277776594],
          [30.019163681985344, -2.4791343283143186]
        ]
      ],
      [
        [
          [30.28592546177049, -2.4403746034640093],
          [30.312017991067364, -2.4403746034640093],
          [30.312017991067364, -2.439002557222352],
          [30.28592546177049, -2.439002557222352],
          [30.28592546177049, -2.4403746034640093]
        ]
      ],
      [
        [
          [30.2591462869658, -2.398526566858037],
          [30.259832932473614, -2.398526566858037],
          [30.259832932473614, -2.3971544782854997],
          [30.2591462869658, -2.3971544782854997],
          [30.2591462869658, -2.398526566858037]
        ]
      ]
    ],
    null,  // geodesic: false
    false
  );
  
  // Visualization parameters for RGB bands
  var imageVisParam = {
    bands: ["B4", "B3", "B2"],
    min: 309.86,
    max: 1551.14,
    gamma: 1.0490000000000002,
    opacity: 1
  };
  
  // Choose and filter the image collection
  // Source: https://developers.google.com/earth-engine/datasets/catalog/COPERNICUS_S2_SR_HARMONIZED#image-properties 
  var sentinel2 = ee.ImageCollection("COPERNICUS/S2_SR_HARMONIZED")
    .filterBounds(RIO)
    .filterDate('2021-01-01', '2023-12-31')
    .filterMetadata('CLOUDY_PIXEL_PERCENTAGE', 'less_than', 1)
    .median()
    .clip(RIO);
  
  // Select the RGB bands (e.g., B4, B3, B2 for Red, Green, Blue)
  var rgbImage = sentinel2.select(['B4', 'B3', 'B2']);
  
  // Define visualization parameters for map display
  var visualizationParams = {
    min: 0,
    max: 3000,
    gamma: 1.4
  };
  
  // Add the RGB image layer to the map
  Map.addLayer(rgbImage, visualizationParams, 'Sentinel-2 RGB Image');
  

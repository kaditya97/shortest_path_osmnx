var map = L.map('map');
map.setView([28.3949, 84.2640], 7);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

var startIcon = L.icon({
  iconUrl: 'css/images/start.png',
  shadowUrl: 'css/images/marker-shadow.png',
  iconSize:     [38, 95],
  shadowSize:   [50, 64],
  iconAnchor:   [22, 94],
  shadowAnchor: [4, 62], 
  popupAnchor:  [-3, -76] 
});
var stopIcon = L.icon({
  iconUrl: 'css/images/Stop_sign.png',
  shadowUrl: 'css/images/marker-shadow.png',
  iconSize:     [38, 95],
  shadowSize:   [50, 64],
  iconAnchor:   [22, 94],
  shadowAnchor: [4, 62], 
  popupAnchor:  [-3, -76] 
});

var result;
var dataSend = {};
$("form#myForm").submit(function (e) {
  e.preventDefault();
  if (jQuery.isEmptyObject(dataSend)) {
    alert("Please Add a Marker First")
  } else {
    $.ajax({
      'type': 'post',
      'async': false,
      'global': false,
      'url': "http://127.0.0.1:5000/",
      // 'data': $("form#myForm").serialize(),
      'data': dataSend,
      'dataType': "json",
      'success': function (data) {
        result = data;
        console.log(data)
        drawnItems.clearLayers();
        way(result);
      }
    });
  }
})

function way(result){
  var points = [];
  for (var i = 0; i < result['path'].length; i++) {
    points.push([result['path'][i].lat, result['path'][i].lng]);
  }
  var polyline = L.polyline(points, { color: 'red' }).addTo(map);
  map.fitBounds(polyline.getBounds());
  
  L.marker([result['path'][0].lat, result['path'][0].lng], {icon: startIcon}).bindPopup('Start').addTo(map);
  L.marker([result['path'][result['path'].length - 1].lat, result['path'][result['path'].length - 1].lng], {icon: stopIcon}).bindPopup('End').addTo(map);
}

var drawnItems = new L.FeatureGroup();
map.addLayer(drawnItems);
var drawControl = new L.Control.Draw({
  draw: {
    polyline: false,
    polygon: false,
    rectangle: false,
    circle: false,
    circlemarker: false
  },
  edit: {
    featureGroup: drawnItems
  }
});
map.addControl(drawControl);
map.on('draw:created', function (e) {
  drawnItems.addLayer(e.layer);
});
map.on(L.Draw.Event.CREATED, function (e) {
  var type = e.layerType,
    layer = e.layer;
  if (type === 'marker') {
    cord = layer.getLatLng()
    if(jQuery.isEmptyObject(dataSend)){
      dataSend["lat1"] = cord.lat
      dataSend["lng1"] = cord.lng
    }else{
      dataSend["lat2"] = cord.lat
      dataSend["lng2"] = cord.lng
    }
    layer.bindPopup(cord.toString()).openPopup();
  }
  map.addLayer(layer);
});
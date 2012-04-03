var map, interactivity, layer;

var url = 'http://api.tiles.mapbox.com/v3/';
var activelayer = "occupy.4q11-delinq";
var statelayer = "occupy.state-lines";

wax.tilejson(url + activelayer + ',' + statelayer + '.jsonp', function(tilejson) {
  map = new L.Map('map')
    .setView(new L.LatLng(39.317, -95.823), 4);

  tilejson.minzoom = 2;
  tilejson.maxzoom = 7;

  layer = new wax.leaf.connector(tilejson);
  map.addLayer(layer);

  interactivity = wax.leaf.interaction()
    .map(map)
    .tilejson(tilejson)
    .on(wax.tooltip().animate(true).parent(map._container).events());
});

function refreshMap(layers) {
  wax.tilejson(url + layers + '.jsonp', function(tilejson) {
    tilejson.minzoom = 2;
    tilejson.maxzoom = 7;

    // This little dance to try to avoid a flash,
    // but Leaflet seems to flash anyway
    var newlayer = new wax.leaf.connector(tilejson);
    map.addLayer(newlayer);
    map.removeLayer(layer);
    layer = newlayer;

    interactivity.tilejson(tilejson);
  });
}

$(document).ready(function () {

  // Create a new UI Slider. Requires jQuery version 1.8
  // http://docs.jquery.com/UI/API/1.8/Slider
  $('#slider').slider({
    animate: 'normal',
    min: 1999,
    max: 2011,
    value: 2011
  });

  // Initialize slider handle year
  $('a.ui-slider-handle').html('2011');

  // refresh the map every time the slider changes
  $('#slider').bind('slidechange', function(event, ui) {
  	// occupy.4q11-delinq
    var year = $('#slider').slider('value').toString()
    var value = year.substring(2,4);
  	var activeLayer = "occupy.4q" + value + "-delinq";
    var layers = [
      activeLayer,
      statelayer
    ];
    $('a.ui-slider-handle').html(year);
  	refreshMap(layers);
  });
});

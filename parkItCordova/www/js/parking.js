$('document').ready(init);
var storage;

function initMap() {
    var $park = $("#park").on("click", function () {
        setParkingLocation();
    });
    var $retrieve = $("#retrieve").on("click", function () {
        // alert("get Parking location.");
        getParkingLocation();
    });

    var $gotIt = $("#gotIt").on('click', function () {
        $('#instructions').hide();
    });

    var BAU = {lat: 41.0421, lng: 29.0090};

    var mapDiv = new google.maps.Map(
        document.getElementById('map'), {
            zoom: 12,
            center: BAU
        });
}


function init() {
    document.addEventListener("deviceready", onDeviceReady, false);
    storage = window.localStorage;
}

function onDeviceReady() {
    if (cordova.platformid == 'ios') {
        $('head').append('<link rel="stylesheet" href="css/park-it-ios.css" type="text/css" />');
        //prevents status bar from overlaying web view
        window.StatusBar.overlaysWebView(false);
        window.StatusBar.styleDefault();
    } else {
        $('head').append('<link rel="stylehseet" href="css/park-it-android.css" type="text/css" />');
        window.StatusBar.backgroundColorByHexString("#1565C0");
    }
}

function setParkingLocation() {
    navigator.geolocation.getCurrentPosition(setParkingLocationSuccess,
        setParkingLocationError, {enableHighAccuracy: true});

}

function setParkingLocationSuccess(position) {
    latitude = position.coords.latitude;
    storage.setItem("parkedLatitude", latitude);

    longitude = position.coords.longitude;
    storage.setItem("parkedLongitude", longitude);


    showParkingLocation();
}

function setParkingLocationError(error) {
    navigator.notification.alert("Error code : " + error.code + "\nError Message: "
        + error.message)
}

function showParkingLocation() {
    //navigator.notification.alert("You are parked at Lat: " + storage.getItem("parkedLatitude")
    //  + storage.getItem("parkedLongitude"));

    $("#instructions").hide();
    $("#directions").hide();

    var latLong = new google.maps.LatLng(latitude, longitude);
    var map = new google.maps.Map(document.getElementById('map'));

    map.setZoom(16);
    map.setCenter(latLong);
    var mapDiv = new google.maps.Marker({
        position: latLong,
        map: map
    });
}

function getParkingLocation() {
    navigator.geolocation.getCurrentPosition(getParkingLocationSuccess,
        getParkingLocationError, {enableHighAccuracy: true});
}

function getParkingLocationSuccess(position) {
    currentLatitude = position.coords.latitude;
    currentLongitude = position.coords.longitude;
    parkedLatitude = storage.getItem("parkedLatitude");
    parkedLongitude = storage.getItem("parkedLongitude");

    showDirections();
}

function showDirections() {
    var dRenderer = new google.maps.DirectionsRenderer;
    var dService = new google.maps.DirectionsService;
    var curLatLong = new google.maps.LatLng(currentLatitude, currentLongitude);
    var parkedLatLong = new google.maps.LatLng(parkedLatitude, parkedLongitude);
    var map = new google.maps.Map(document.getElementById("map"));
    map.setZoom(16);
    map.setCenter(curLatLong);
    dRenderer.setMap(map);
    dService.route({
            origin: curLatLong,
            destination: parkedLatLong,
            travelMode: 'DRIVING'
        },
        function (response, status) {
            if (status == 'OK') {
                dRenderer.setDirections(response);
                $('#directions').html('');
                dRenderer.setPanel(document.getElementById('directions'));
            } else {
                navigator.notification.alert("Directions failed " + status);
            }
        });

    $('#map').show();
    $('#directions').show();
    $('#instructions').hide();
}

function getParkingLocationError(error) {
    navigator.notification.alert("Error Code: " + error.code +
        "\nError Message: " + error.message);
}

function fetchGeoLocation() {
    var geoLocate = new GeoLocation();
    geoLocate.fetch({
        success: function () {
            var infosHtml = _.template($('#ipGeoLocationView').html(), {geolocation: geoLocate.toJSON()});
            $('#ipLocationInfo').html(infosHtml);
        },
        error: function () {

        }
    });
}

$(document).ready(
    function () {
        fetchGeoLocation();

        if (IS_FIREFOX) {
            // popup is not resizing on firefox when content is added dynamically
            var bodyElm = $('#bodycontent');
            var children_height = 0;
            bodyElm.children().each(function () {
                children_height += $(this).height();
            });
            bodyElm.height(Math.max(children_height / 2, bodyElm.height())) + 10;
        }
    }
);
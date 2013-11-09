
var waitForFinalEvent = (function () {
  var timers = {};
  return function (callback, ms, uniqueId) {
    if (timers[uniqueId]) {
      clearTimeout (timers[uniqueId]);
    }
    timers[uniqueId] = setTimeout(callback, ms);
  };
})();

var current_lesson = 0;

function load_project_xml(uri) {
        document.getElementById('snap').contentWindow.load_project_xml(uri);
}

function place_video () {
        var pos = document.getElementById('snap').contentWindow.videoPos;
        var snap = $('#snap').offset();
        var padding = 5;
        console.log('video pos =', pos);
        if (pos !== undefined) {
                $("#video-loop").offset({top: pos.y + snap.top + padding, left: pos.x + snap.left + padding});
                $("#video-loop").first().width(pos.width - padding);
        }
}

$(document).ready(function() {
        // Makes button looked clicked permanently.
        //$("#first-button").button('toggle');
        document.getElementById('snap').contentWindow.onSnapLoad = function () {
                place_video();
        }
        console.log('video pos =', document.getElementById('snap').contentWindow.videoPos);
});

function btn_click (text, index) {
        $('#buttons')[current_lesson].button('toggle');
        load_project_xml(text);
        current_lesson = index;
}

$(window).load(function () {
        //$('#buttons')[current_lesson].click();
        $("#first-button").click();
        place_video ();
});

$(window).resize(function () {
        waitForFinalEvent(place_video, 10, "place_video_late");
});

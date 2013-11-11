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
        if (pos !== undefined) {
                $("#video-loop").offset({top: pos.y + snap.top + padding, left: pos.x + snap.left + padding});
                $("#video-loop").first().width(pos.width - padding);
        }
}

var btn_to_name = [
        "tutorial_01",
        "tutorial_02",
        "molemash"
        ];

function update_video (name) {
        $('#video-loop').find('source').remove();
        $('#video-loop').append($('<source>', {src:name + '.ogv', type: 'video/ogv'}));
        $('#video-loop').append($('<source>', {src:name + '.ogg', type: 'video/ogg'}));
        $('#video-loop').append($('<source>', {src:name + '.webm', type: 'video/webm'}));
        $('#video-loop').append($('<source>', {src:name + '.avi', type: 'video/avi'}));
        $('#video-loop')[0].load();
}

function btn_click (index) {
        //var index = $(this).data('index');
        var name = btn_to_name[index];
        $('.btn-top').eq(current_lesson).button('toggle');
        load_project_xml(name + ".xml");
        update_video(name);
        $('.btn-top').eq(index).button('toggle');
        current_lesson = index;
}

$(window).load(function () {
        //var top_buttons = $('#buttons-top')
        //for ( var i in btn_to_name ) {
          //top_buttons.append($('<button>'
          //}
        $(".btn-top").first().button('toggle');
        btn_click(0);
        place_video();
});

$(window).resize(function () {
        waitForFinalEvent(place_video, 10, "place_video_late");
});

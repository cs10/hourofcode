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

function place_corral_cover () {
  var pos = document.getElementById('snap').contentWindow.corralPos;
  var snap = $('#snap').offset();
  var padding = 5;
  if (pos !== undefined) {
    $("#corral-cover").offset({
      top: pos.y + snap.top + padding,
      left: pos.x + snap.left + padding
      });
    //$("#corral-cover").first().width(pos.width - padding);
    $("#corral-cover").width(pos.width - padding);
    $("#corral-cover").height(pos.height - 2 * padding);
    $('#corral-cover').children().each(function (i,j) {
      var v = $(this).offsetWidth;
    });
  }
}

var btn_to_name = [
  "tutorial_01",
  "tutorial_02",
  "molemash",
  ];

var btn_to_left = [
  ];

function preload_left () {
  for (var i in btn_to_name) {
    var url = btn_to_name[i] + '.html';
    //console.log('i = ', i);
    //console.log('btn_to_name[i] = ', btn_to_name[i]);
    var request = new XMLHttpRequest ();
    request.onload = function(idx) {
      return function () {
      	btn_to_left[idx] = this.responseText;
    } }(i);
    request.open("get", url, true);
    request.send();
  }
}

preload_left();

function click_btn_num ( i ) {
  $('.btn-top').eq(i).click();
}

function place_in_corral_cover(elems) {
  var corralCover = $('#corral-cover');
  corralCover.empty();
  corralCover.append($('<div>', {class: 'div-corral-cover'})
      .append($('<div>', {class: 'div-corral-cover-inner'})
      .append(elems)));
}

function do_it_for_me() {
  load_project_xml(btn_to_name[current_lesson + 1] + ".xml");
}

function fix_code() {
  load_project_xml(btn_to_name[current_lesson] + ".xml");
}

function corralBtn(text, callback) {
  return $('<button>', {class: 'btn btn-primary btn-lg btn-corral-cover'}).text(text).click(callback)
}

function show_answer() {
    place_in_corral_cover ([$('<img>',
          {src: btn_to_name[current_lesson] + '_answer.gif'}),
        corralBtn('Do it for me.', do_it_for_me)
        ]);
}

function btn_click () {
  var index = parseInt($(this).data('index'));
  var name = btn_to_name[index];
  $('.btn-top').eq(current_lesson).button('toggle');
  //load_project_xml(name + ".xml");
  $('.btn-top').eq(index).button('toggle');
  current_lesson = index;
  if (current_lesson + 1 === btn_to_name.length) {
    $('#done-button').removeClass('hidden');
    $('#next-button').addClass('hidden');
  }
  else {
    $('#next-button').removeClass('hidden');
  }
  function load_left (idx) {
    var leftText = btn_to_left[index];
    if (leftText !== undefined) {
      $('#left').html(leftText);
    }
    else {
      setTimeout(load_left, 100);
    }
  }
  place_in_corral_cover([
      corralBtn('Show me the answer.', show_answer),
      corralBtn('Replace my code.', fix_code)
      ]
      );
  load_left();
}

function next_lesson() {
  click_btn_num(current_lesson + 1);
}

$(document).ready(function () {
  document.getElementById('snap').contentWindow.corralCover = $('#corral-cover');
});

$(window).load(function () {
  var top_buttons = $('#buttons-top')
  var i;
  for ( i in btn_to_name ) {
    i = parseInt(i);
    top_buttons.append($('<button>',
      {class:'btn-top btn btn-lg btn-default'})
      .text('#' + (i + 1)).data('index', i).on('click', btn_click));
    }
  $(".btn-top").first().button('toggle');
  $(".btn-top").first().click();
  load_project_xml ( btn_to_name[0] + '.xml' );
  place_corral_cover();
  $("#next-button").on('click', next_lesson);
});

$(window).resize(function () {
  waitForFinalEvent(place_corral_cover, 10, "place_corral_cover");
});

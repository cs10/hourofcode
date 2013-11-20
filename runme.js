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

function load_project_uri(uri) {
  document.getElementById('snap').contentWindow.load_project_uri(uri);
}

function load_project_xml(text) {
  return document.getElementById('snap').contentWindow.load_project_xml(text);
}

function export_project_xml() {
  return document.getElementById('snap').contentWindow.export_project_xml();
}

function xmlToString(xmlData) { 

    var xmlString;
    //IE
    if (window.ActiveXObject){
        xmlString = xmlData.xml;
    }
    // code for Mozilla, Firefox, Opera, etc.
    else{
        xmlString = (new XMLSerializer()).serializeToString(xmlData);
    }
    return xmlString;
}

function load_hidden_blocks(answer) {
  var myXML = $.parseXML(export_project_xml());
  var otherXML = $.parseXML(answer);
  $(myXML).find('hidden').text($(otherXML).find('hidden').text());
  load_project_xml(xmlToString(myXML));
}

function host_xml(xml) {
  var hash = hex_sha512(xml);
  $.post("http://snap.berkeley.edu/hoc/store/store.php", {xml: xml, hash: hash});
  return hash;
}

function generate_url(hash, callback) {
  var url = "http://www.corsproxy.com/tinyurl.com/api-create.php?url=" + 
    encodeURIComponent("http://snap.berkeley.edu/snapsource/snap.html#run:http://snap.berkeley.edu/hoc/store/" + hash + ".xml");
  $.get(url, callback);
}

function share(callback) {
    generate_url(host_xml(export_project_xml()), callback);
}


var congrats_html = null;

function preload_congrats () {
  var url = 'congrats.html';
  var request = new XMLHttpRequest ();
  request.onload = function() {
    console.log('Got congrats html');
    congrats_html = this.responseText;
  };
  request.open("get", url, true);
  request.send();
}

preload_congrats();

function congrats() {
    $('.modal-title').html("Congrats!");
    $('.modal-body').html(congrats_html);
    $('#myModal').modal('show');
    share(function(data) {
      $('.modal-body').html(congrats_html + "<br>Use this link to share your code: <a href=" + data + " target='_blank'>" + data + "</a>");
    });
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
    $("#corral-cover").width(pos.width - padding);
    $("#corral-cover").height(pos.height - 2 * padding);
    $('#corral-cover').children().each(function (i,j) {
      var v = $(this).offsetWidth;
    });
  }
}

var btn_to_name = [
  "bjchoc_00",
  "bjchoc_01",
  "bjchoc_02",
  "bjchoc_03",
  "bjchoc_04",
  "bjchoc_05",
  "bjchoc_06",
  "bjchoc_07",
  "bjchoc_08",
  "bjchoc_09",
  ];

var idx_to_title = [
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  ];

var btn_to_left = [
  ];

function preload_left () {
  for (var i in btn_to_name) {
    var url = btn_to_name[i] + '.html';
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
  var inner = $('<div>', {class: 'div-corral-cover-inner'});
  corralCover.append($('<div>', {class: 'div-corral-cover'}).append(inner));
  if (current_lesson !== btn_to_name.length - 1) {
    inner.append(elems);
  }
}

function do_it_for_me() {
  if (current_lesson !== btn_to_name.length - 1) {
    load_project_uri(btn_to_name[current_lesson + 1] + ".xml");
  } else {
    load_project_uri("bjchoc_10.xml");
  }
}

function fix_code() {
  load_project_uri(btn_to_name[current_lesson] + ".xml");
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

function killvideo() {
	src = $('#video').attr('src');
	$('#video').attr('src', '');
	$('#video').attr('src', src);
}

function load_left (idx, callback) {
  var leftText = btn_to_left[idx];
  if (leftText !== undefined) {
    callback(leftText);
  }
  else {
    setTimeout(function () {load_left(idx, callback)}, 100);
  }
}

function get_proj_xml ( uri, callback ) {
  var request = new XMLHttpRequest ();
  request.onload = function () {
    callback(this.responseText);
  };
  request.open("get", uri, true);
  request.send();
}

function btn_click () {
  var index = parseInt($(this).data('index'));
  var name = btn_to_name[index];
  $('.btn-top').eq(current_lesson).button('toggle');
  //load_project_uri(name + ".xml");
  if (index !== 0) {
    get_proj_xml ( name + ".xml", load_hidden_blocks);
  }
  $('.btn-top').eq(index).button('toggle');
  current_lesson = index;
  if (current_lesson + 1 === btn_to_name.length) {
    $('#done-button').removeClass('hidden');
    $('#next-button').addClass('hidden');
  }
  else {
    $('#next-button').removeClass('hidden');
  }
  location.hash = "#" + (current_lesson + 1);
  place_in_corral_cover([
      corralBtn('Show me the answer.', show_answer),
      corralBtn('Replace my code.', fix_code)
      ]
      );
  load_left(index, function (leftText) {
    $('#left').html(leftText);
    });
  prepare_modal(current_lesson, function () {
    $('#myModal').modal('toggle');
    });
}

function next_lesson() {
  click_btn_num(current_lesson + 1);
}

function prepare_modal(idx, callback) {
  load_left(idx, function (leftText) {
    $('.modal-title').html(idx_to_title[idx]);
    $('.modal-body').html(leftText);
    $('.modal-body').append($('<button>',
        {class:'btn btn-lg btn-primary', style: 'margin-left:80%;', text:'Okay'}
      ).click(function () {
      $('#myModal').modal('toggle');
    }));
    callback();
    });
}

$(document).ready(function () {
  document.getElementById('snap').contentWindow.corralCover = $('#corral-cover');
  document.getElementById('snap').contentWindow.dont_export_hidden = true;
  $(".modal").click( function() { killvideo(); } );
});

var first_lesson_loaded = false;

$(window).load(function () {
  var top_buttons = $('#buttons-top')
  var i;

  var num = window.location.hash.substring(1);

  if (num === '') {
    num = 1;
    location.hash = "#" + num;
  }
  else {
    current_lesson = parseInt(num) - 1;
  }

  for ( i in btn_to_name ) {
    i = parseInt(i);
    top_buttons.append($('<button>',
      {class:'btn-top btn btn-lg btn-default'})
      .text('#' + (i + 1)).data('index', i).on('click', btn_click));
    }
  $(".btn-top").eq(current_lesson).button('toggle');
  $(".btn-top").eq(current_lesson).click();
  load_project_uri ( btn_to_name[current_lesson] + '.xml' );
  place_corral_cover();
  $("#next-button").on('click', next_lesson);
});

$(window).resize(function () {
  waitForFinalEvent(place_corral_cover, 10, "place_corral_cover");
});

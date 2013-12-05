var waitForFinalEvent = (function () {
  var timers = {};
  return function (callback, ms, uniqueId) {
    if (timers[uniqueId]) {
      clearTimeout(timers[uniqueId]);
    }
    timers[uniqueId] = setTimeout(callback, ms);
  };
})();

var current_lesson = 0;

function load_project_uri(uri, callback) {
  var request = new XMLHttpRequest ();
  request.onload = function () {
    if (callback !== undefined) {
      callback(this.responseText);
    }
    else {
      load_project_xml(this.responseText);
    }
  };
  request.open("get", uri, true);
  request.send();
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

function partial_load_xml(answer, ownXML) {
  if (ownXML === undefined) {
    ownXML = export_project_xml();
  }
  var myXML = $.parseXML(ownXML);
  var otherXML = $.parseXML(answer);
  var oldHidden = $(myXML).find('hidden').text().split(' ');
  var newHidden = $(otherXML).find('hidden').text().split(' ');
  var newBlocks = [];
  for (var i in oldHidden) {
    if (newHidden.indexOf(oldHidden[i]) === -1) {
      newBlocks.push(oldHidden[i]);
    }
  }
  $(myXML).find('hidden').text($(otherXML).find('hidden').text());
  var project = myXML.getElementsByTagName('project')[0];
  var newBlocksNode = myXML.createElement('new');
  newBlocksNode.appendChild(myXML.createTextNode(newBlocks.join(' ')));
  project.appendChild(newBlocksNode);
  var str = xmlToString(myXML);
  load_project_xml(str);
  return str;
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
    congrats_html = this.responseText;
  };
  request.open("get", url, true);
  request.send();
}

preload_congrats();

function congrats() {
    $('.modal-body').html(congrats_html);
    $('#myModal').modal('show');
    share(function(data) {
      $('.modal-body').html(congrats_html + "<br><h4>Use this link to share your code: <a href=" + data + " target='_blank'>" + data + "</a></h4>");
    });
}

function place_corral_cover () {
  var pos = document.getElementById('snap').contentWindow.corralPos;
  var snap = $('#snap').offset();
  var padding = 5;
  var corral_cover = $("#corral-cover");
  if (pos !== undefined) {
    corral_cover.offset({
      top: pos.y + snap.top + padding,
      left: pos.x + snap.left + padding
      });
    corral_cover.width(pos.width - padding);
    corral_cover.height(pos.height - 2 * padding);
    corral_cover.children().each(function (i,j) {
      var v = $(this).offsetWidth;
    });
  }
  check_lg_buttons ();
}

function check_lg_buttons () {
  var corral_cover = $("#corral-cover");
  if (corral_cover.width() < 300) {
    var large_buttons = $('.btn-lg');
    large_buttons.removeClass('btn-lg');
    large_buttons.addClass('had-btn-lg');
  }
  else {
    $('.had-btn-lg').addClass('btn-lg').removeClass('had-btn-lg');
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
  inner.append(elems);
  check_lg_buttons();
}

function do_it_for_me() {
  if (current_lesson !== btn_to_name.length - 1) {
    var current_xml = export_project_xml();
    load_project_uri(btn_to_name[current_lesson + 1] + ".xml",
        function (xml) {
          partial_load_xml(current_xml, xml);
        });
  }
  // The do it for me button should not exist otherwise.
}

function fix_code() {
  load_project_uri(btn_to_name[current_lesson] + ".xml");
}

function corralBtn(text, callback) {
  return $('<button>', {class: 'btn btn-primary btn-lg btn-corral-cover'}).text(text).click(callback)
}

function show_answer() {
  var answer_png = 'pngs/' + btn_to_name[current_lesson] + '_answer.png';
  place_in_corral_cover ([
      $('<a>', {'href':answer_png, 'target':'_blank'}).append(
        $('<img>', {'class': 'answer-png', 'src': answer_png})),
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
  var first_click_copy = first_click;
  $('.btn-top').eq(current_lesson).button('toggle');
  if (index === btn_to_name.length - 1) {
    $('#corral-cover').addClass('my-hidden');
    get_proj_xml ( name + ".xml", function (lastXML) {
      var xml = partial_load_xml(lastXML);
      if ( first_click_copy ) {
        $('#snap').load(function () {
          load_project_uri(btn_to_name[index] + '.xml');
        });
      }
      else {
        $('#snap').load(function () {
          load_project_xml(xml);
        });
      }
      $('#snap').attr('src', 'full-interface/snap.html');
    });
  }
  else {
    $('#corral-cover').removeClass('my-hidden');
    if (index >= 4) {
      document.getElementById('snap').contentWindow.show_make_a_variable = true;
    }
    else {
      document.getElementById('snap').contentWindow.show_make_a_variable = false;
    }
    // If this is the first click, then the project has already been loaded.
    if (!first_click) {
      get_proj_xml ( name + ".xml", partial_load_xml);
    }
  }
  $('.btn-top').eq(index).button('toggle');
  current_lesson = index;
  if (current_lesson + 1 === btn_to_name.length) {
    $('#done-button').removeClass('hidden');
    $('#snaplogo-img').addClass('hidden');
    $('#page-subtitle').addClass('hidden');
    $('#next-button').addClass('hidden');
  }
  else {
    $('#next-button').removeClass('hidden');
  }
  location.hash = "#" + (current_lesson + 1);
  if (current_lesson !== btn_to_name.length - 1) {
    place_in_corral_cover([
      corralBtn('Show me the answer.', show_answer),
      corralBtn('Replace my code.', fix_code)
      ]);
  } else {
    place_in_corral_cover([
      corralBtn('Replace my code.', fix_code)
      ]);    
  }
  load_left(index, function (leftText) {
    $('#left').html(leftText);
  });
  prepare_modal(current_lesson, function () {
    $('#myModal').modal('toggle');
  });
  first_click = false;
}

function next_lesson() {
  click_btn_num(current_lesson + 1);
}

function prepare_modal(idx, callback) {
  load_left(idx, function (leftText) {
    $('.modal-title').html(idx_to_title[idx]);
    $.ajax({
      url : "modaltext/" + btn_to_name[idx] + "_modal.html",
      dataType: "text",
      success : function (data) {
        $('.modal-body').html(data);
        $('.modal-body').append($('<button>',
          {class:'btn btn-lg btn-primary', style: 'margin-left:80%;', text:'OK'}
          ).click(function () {
            $('#myModal').modal('toggle');
        }));
        callback();
      }
    });
  });
}

$(document).ready(function () {
  document.getElementById('snap').contentWindow.corralCover = $('#corral-cover');
  document.getElementById('snap').contentWindow.dont_export_hidden = true;
  $(".modal").click( function() { killvideo(); } );
  var is_chrome = navigator.userAgent.toLowerCase().indexOf('chrome') > -1;
  if (!(is_chrome)) {
    $('#snap').attr('src', '');
    $("#right").empty();
    $("#myModal").remove();
    $("#right").append("<div id='chrome-message'>Welcome to our Hour of Code! Please use us on <a href='http://www.google.com/chrome' target='_blank'>Google Chrome</a>.</div>");
    $("#chrome-message").show();
  }
});

var first_lesson_loaded = false;

var first_click = true;
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
  load_project_uri(btn_to_name[current_lesson] + '.xml', 
      function (xml) {
        load_project_xml(xml);
        place_corral_cover();
        // Why is this still necessary?
        // It seems Snap! is asynchronously loading the xml,
        // despite there being no blocking action taking place.
        setTimeout(place_corral_cover, 100);
      });
  $(".btn-top").eq(current_lesson).button('toggle');
  $(".btn-top").eq(current_lesson).click();
  $("#next-button").on('click', next_lesson);
});

$(window).resize(function () {
  waitForFinalEvent(place_corral_cover, 10, "place_corral_cover");
});

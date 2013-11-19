$(document).ready(function() {


	$(".modal").click( function() { killvideo()});

    num = window.location.hash.substring(1);
    if (!(num)) {
    	num = 1;
    	location.hash = "#" + num;
    }

    button = $("#buttons :nth-child(" + num + ")");
    button.button("toggle");

});



function killvideo() {
	src = $('#video').attr('src');
	$('#video').attr('src', '');
	$('#video').attr('src', src);
}


function load(num, user, proj) {
	document.getElementById('snap').src = 'http://snap.berkeley.edu/snapsource/snap.html#present:Username=' + user + '&ProjectName=' + proj;
	$('#iframes').html($('#iframes').children().clone());
	location.hash = "#" + num;
}

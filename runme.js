$(document).ready(function() {


	load('Dan Garcia', 'Mole Mash');

});




function load(user, proj) {
	document.getElementById('snap').src = 'http://snap.berkeley.edu/snapsource/snap.html#present:Username=' + user + '&ProjectName=' + proj;
	$('#iframes').html($('#iframes').children().clone());
}

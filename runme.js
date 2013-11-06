
var snap_url = "http://snap.berkeley.edu/snapsource/snap.html";
//var snap_url = "snap.html";


$(document).ready(function() {


        //load('Dan Garcia', 'Mole Mash');
});

function load_project_xml(uri) {
        document.getElementById('snap').contentWindow.load_project_xml(uri);
}

function load(user, proj) {
	document.getElementById('snap').src = snap_url + '#present:Username=' + user + '&ProjectName=' + proj;
	$('#iframes').html($('#iframes').children().clone());
}

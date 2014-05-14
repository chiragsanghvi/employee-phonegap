var scroll = new iScroll('wrapper', { vScrollbar: false, hScrollbar:false, hScroll: false });
var id = getUrlVars()["id"];

document.addEventListener("deviceready", onDeviceReady, false);

function onDeviceReady() {
    getReportList();
}

function transaction_error(status) {
	$('#busy').hide();
    alert("Appacitive Error: " + status.message);
}

function getReportList() {
	var employee = new directory.Employee({ __id: id });
	employee.fetchReports().then(getReportList_success, transaction_error);
}

function getReportList_success(results) {
	$('#busy').hide();
    var len = results.length;
    for (var i=0; i<len; i++) {
    	var employee = results.at(i)
		$('#reportList').append('<li><a href="employeedetails.html?id=' + employee.id + '">' +
				'<img src="' + employee.get('pic') + '" class="list-icon"/>' +
				'<p class="line1">' + employee.name() + '</p>' +
				'<p class="line2">' + employee.get('title') + '</p>' +
				'<span class="bubble">' + employee.reportCount() + '</span></a></li>');
    }
	setTimeout(function(){
		scroll.refresh();
	});
}

function getUrlVars() {
    var vars = [], hash;
    var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
    for(var i = 0; i < hashes.length; i++)
    {
        hash = hashes[i].split('=');
        vars.push(hash[0]);
        vars[hash[0]] = hash[1];
    }
    return vars;
}
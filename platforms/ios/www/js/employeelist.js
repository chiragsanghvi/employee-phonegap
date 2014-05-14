var scroll = new iScroll('wrapper', { vScrollbar: false, hScrollbar:false, hScroll: false });

document.addEventListener("deviceready", onDeviceReady, false);

function onDeviceReady() {
    getEmployees();
};

function transaction_error(status) {
	$('#busy').hide();
    alert("Appacitive Error: " + status.message);
}

function getEmployees() {
	var employees = new directory.EmployeeCollection();
	employees.query()
		.orderBy('$reports')
		.isAscending(false)
		.fields(['pic', 'firstname', 'lastname', 'title', '$reports']);

	employees.fetch().then(getEmployees_success, transaction_error);	
}

function getEmployees_success(results) {
	$('#busy').hide();
    var len = results.length;
    for (var i=0; i<len; i++) {
    	var employee = results.at(i)
		$('#employeeList').append('<li><a href="employeedetails.html?id=' + employee.id + '">' +
				'<img src="' + employee.get('pic') + '" class="list-icon"/>' +
				'<p class="line1">' + employee.name() + '</p>' +
				'<p class="line2">' + employee.get('title') + '</p>' +
				'<span class="bubble">' + employee.reportCount() + '</span></a></li>');
    }
	setTimeout(function(){
		scroll.refresh();
	},100);
}
var scroll = new iScroll('wrapper', { vScrollbar: false, hScrollbar:false, hScroll: false });

var id = getUrlVars()["id"];

document.addEventListener("deviceready", onDeviceReady, false);

function onDeviceReady() {
	getEmployee();
}

function transaction_error(status) {
	$('#busy').hide();
    alert("Appacitive Error: " + status.message);
}

function getEmployee(tx) {
	var employee = new directory.Employee({ __id: id });
	employee.fetch().then(getEmployee_success, transaction_error);
}

function getEmployee_success(employee) {
	$('#busy').hide();
	$('#employeePic').attr('src', employee.get('pic'));
	$('#fullName').text(employee.name());
	$('#employeeTitle').text(employee.get('title'));
	$('#city').text(employee.get('city'));
	if (employee.get('managerid') > 0 ) {
		$('#actionList').append('<li><a href="employeedetails.html?id=' + employee.get('managerid') + '"><p class="line1">View Manager</p>' +
				'<p class="line2">' + employee.get('managername') + '</p></a></li>');
	}
	if (employee.reportCount() > 0) {
		$('#actionList').append('<li><a href="reportlist.html?id=' + employee.id + '"><p class="line1">View Direct Reports</p>' +
				'<p class="line2">' + employee.reportCount() + '</p></a></li>');
	}
	if (employee.get('email')) {
		$('#actionList').append('<li><a href="mailto:' + employee.get('email') + '"><p class="line1">Email</p>' +
				'<p class="line2">' + employee.get('email') + '</p><img src="img/mail.png" class="action-icon"/></a></li>');
	}
	if (employee.get('officePhone')) {
		$('#actionList').append('<li><a href="tel:' + employee.get('officephone') + '"><p class="line1">Call Office</p>' +
				'<p class="line2">' + employee.get('officephone') + '</p><img src="img/phone.png" class="action-icon"/></a></li>');
	}
	if (employee.get('cellphone')) {
		$('#actionList').append('<li><a href="tel:' + employee.get('cellphone') + '"><p class="line1">Call Cell</p>' +
				'<p class="line2">' + employee.get('cellphone') + '</p><img src="img/phone.png" class="action-icon"/></a></li>');
		$('#actionList').append('<li><a href="sms:' + employee.get('cellphone') + '"><p class="line1">SMS</p>' +
				'<p class="line2">' + employee.get('cellphone') + '</p><img src="img/sms.png" class="action-icon"/></a></li>');
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
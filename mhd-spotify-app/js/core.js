var endpoint = 'http://ec2-75-101-233-141.compute-1.amazonaws.com/test_response.php';

function start() {
	
	// load spinner

  	// perform network call
	$.get(endpoint, function(data,status) {
    	var obj = $.parseJSON(data);
    	alert(obj.author);

		// restore button
    	// $('#spinner').hide();
    	// $('#mButton').show();

	},'html');
};



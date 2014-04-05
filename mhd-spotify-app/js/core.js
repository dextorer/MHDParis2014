var endpoint = 'https://raw.githubusercontent.com/mlegenhausen/node-ogone-directlink/master/package.json';

function start() {
	
	// load spinner
	// var image = $('<img src="/img/spinner.gif" />'); // preload the spinner
  	// $('#mButton').hide();
  	// $('#spinner').show();

  	// perform network call
	$.get(endpoint, function(data,status) {
    	// console.log(data);
    	var obj = $.parseJSON(data);
    	alert(obj.author);

		// restore button
    	// $('#spinner').hide();
    	// $('#mButton').show();

	},'html');
};



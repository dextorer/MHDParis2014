function fuckme() {
	$.get('https://raw.githubusercontent.com/mlegenhausen/node-ogone-directlink/master/package.json',function(data,status) {
    	// console.log(data);
    	var obj = $.parseJSON(data);
    	alert(obj.author);
	},'html');
};

function start() {
	$(document).ready(function() {
      	var contained = $('#txtarea').val();
        alert(contained);
    });
}


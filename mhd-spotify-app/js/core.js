//###############################################################################################
//################################## SPOTY STUFF  ###############################################
//###############################################################################################

//Take spotify stuff
var models;

require(['$api/models'], function(myModels) {
	models = myModels;
});

//Endpoint
var endpoint = 'http://ec2-75-101-233-141.compute-1.amazonaws.com/test_response.php';

//SPOTYPLAYER
var looper = new Array();
var currentId = 0;


//Start
function start() {
	
	// load spinner

  	// perform network call
	$.get(endpoint, function(data,status) {
    	var response = $.parseJSON(data);
    	var result = response.result;

		t = new Array();
		s = new Array();
		d = new Array();

    	for (var i=0; i<result.length; i++) {
    		var token_chunk = result[i].token_chunk;
    		var token_content = result[i].token_content;
    		
    		t[i] = token_content[0].spotify_id;
    		console.log('spotify id ' + token_content[0].spotify_id);
    		// s[i] = parseInt(token_content[0].start_time);
    		s[i] = 53000;
    		console.log('start time ' + token_content[0].start_time);
    		// d[i] = parseInt(token_content[0].duration);
    		d[i] = 3000;
    		console.log('duration ' + token_content[0].duration);
    	}

		models.player.playTrack(t[0]);

		// startSpotyStuff(t,s,d);

		// restore button
    	// $('#spinner').hide();
    	// $('#mButton').show();

	},'html');
}

/*function test(){
			//var album = models.Album.fromURI('spotify:album:2mCuMNdJkoyiXFhsQCLLqw');
			//models.player.playContext(album);
		
			//STUB PARAMS
			t = new Array();
			s = new Array();
			d = new Array();
			
			t[0] = models.Track.fromURI('spotify:track:4QEFQlNFerDnWvNU8NASiV');
			t[1] = models.Track.fromURI('spotify:track:3pDhN3qB33AOPhQEkUCaWt');
			t[2] = models.Track.fromURI('spotify:track:2Oehrcv4Kov0SuIgWyQY9e');
			t[3] = models.Track.fromURI('spotify:track:0sooJd5WbNnnz5k6yO7FIQ');


			for(var i=0; i<t.length; i++){
				s[i] = parseInt(15000 +i*5000);
				//document.body.write("Seek " + i + " is: " + s[i]  + "<br>");
			}
			
			for(var i=0; i<t.length; i++){
				d[i] = 2 * 1000;
				//document.write("Duration " + i + " is: " + d[i]  + "<br>");
			}
			startSpotyStuff(t,s,d);
}*/


function startSpotyStuff(track, seeks, durations){

	function SpotyTimed(current){

		//models.player.stop();
		console.log("Playing " + track[current] + " starting from " + seeks[current]);
		models.player.stop();
		models.player.playTrack(track[current]);
		models.player.seek(seeks[current]);
	}	

	stopSpotyStuff();
	
	looper = new Array();
	looper[0] = setTimeout(function(){  SpotyTimed(currentId++) } , 0 );
	var deltat = 0;
	var j;
	for(j=1; j<track.length; j++){
		//document.write("Loop " + j+ " is " + track[j] + " <br>");
		looper[j] = setTimeout(function(){ SpotyTimed(currentId++) } , deltat + durations[j-1] );
		//setTimeout(function() { t = track[j]; s = seeks[j]; SpotyTimed(t, s )}, deltat + durations[j-1]);
		deltat = deltat + durations[j-1];
	}

	looper [j] = setTimeout(function(){ models.player.stop();  }, deltat + durations[j-1] ); //kill the last
}

function stopSpotyStuff(){
	currentId = 0;
	for(var i = 0; i<looper.length; i++)
		clearTimeout(looper[i]);

	models.player.stop();
	
}



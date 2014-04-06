//###############################################################################################
//################################## SPOTY STUFF  ###############################################
//###############################################################################################

//Take spotify stuff
var models;

require(['$api/models'], function(myModels) {
	models = myModels;
});

//Endpoint
var endpoint = 'http://ec2-75-101-233-141.compute-1.amazonaws.com/api.php';

//SPOTYPLAYER
var looper = new Array();
var currentId = 0;


//Start
function start() {
	
	// read data from textarea
	var query = $('#query_txtarea').val();

	// load spinner
	$('.listenButton').addClass('loaded').empty().html('Wasting your time..');

  	// perform network call
	$.get(endpoint + '?q=' + query, function(data,status) {

		// switch content
		$('.home-section').hide();
		$('.result-section').show();

    	var response = $.parseJSON(data);
    	var result = response.result;
    	
		t = new Array();
		s = new Array();
		d = new Array();
		an = new Array();
		ti = new Array();
		sub = new Array();

    	for (var i=0; i<result.length; i++) {
    		var token = result[i].token;
    		var token_output = result[i].token_output;
    		
			var current;
			var found = false;

    		for (var j=0; j<token_output.length && !found; j++) {
    			current = token_output[j];
    			if (current.spotify_id) {
    				console.log("breaking stuff");
    				found = true;
    			}
    		}

    		found = false;

    		t[i] = 'spotify:track:' + current.spotify_id;
    		t[i] = models.Track.fromURI(t[i]);
    		s[i] = current.phrase_times * 1000;
    		d[i] = current.duration * 1000;
    		an[i] = current.artist;
    		ti[i] = current.title;
    		sub[i] = current.subtitle;

    		$('.songs-list').append("<div class='song blurred'><img src=/cover-art/0c02ccc021d5f1fde006bfd7e61ae144b72b3f11.jpg class='cover' /><div class='overlay-cover'><p class='song-title'>" + ti[i] + "</p><p class='artist-name'>" + an[i] + "</p></div></div>");
    		$('.synced-lyrics').append("<p>" + sub[i] + "</p>");
    	}

		var song_width = 100 / response.length + '%';
		$('.song').css( "width", song_width );

		startSpotyStuff(t,s,d);

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

	// removing first song's blur
	$('.songs-list').children().first().removeClass('blurred');
	$('.synced-lyrics').children().first().addClass('selected');

	function SpotyTimed(current){

		if (current > 1) {
			// update previous
			$('.songs-list').children(':eq(' + current-1 + ')').removeClass('blurred');
			$('.synced-lyrics').children(':eq(' + current-1 + ')').removeClass('selected');

			// update current
			$('.songs-list').children(':eq(' + current + ')').addClass('blurred');
			$('.synced-lyrics').children(':eq(' + current + ')').addClass('selected');
		}

		//models.player.stop();
		console.log("Playing " + track[current] + " starting from " + seeks[current]);
		models.player.stop();
		models.player.playTrack(track[current]);
		models.player.seek(seeks[current]);

		// update current lyrics
	}	

	stopSpotyStuff();
	
	looper = new Array();

	var deltat = 0;
	var j;

	for(j=1; j<track.length; j++){
		//document.write("Loop " + j+ " is " + track[j] + " <br>");
		models.player.pause();
		models.player.playTrack(track[currentId]);
		models.player.pause();

		looper[j] = setTimeout(function(){ SpotyTimed(currentId++) } , deltat + durations[j-1] );
		//setTimeout(function() { t = track[j]; s = seeks[j]; SpotyTimed(t, s )}, deltat + durations[j-1]);
		deltat = deltat + durations[j-1];

	}
	
	//First
	looper[0] = setTimeout(function(){  SpotyTimed(currentId++) } , 0 );
	//Last close
	looper [j] = setTimeout(function(){ models.player.stop();  }, deltat + durations[j-1] ); //kill the last
}

function stopSpotyStuff(){
	currentId = 0;
	for(var i = 0; i<looper.length; i++)
		clearTimeout(looper[i]);

	models.player.stop();
	
}



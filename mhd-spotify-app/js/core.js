//###############################################################################################
//################################## SPOTY STUFF  ###############################################
//###############################################################################################

//Take spotify stuff
var models;

require(['$api/models'], function(myModels) {
	models = myModels;
});

//Endpoint
// var endpoint = 'http://ec2-75-101-233-141.compute-1.amazonaws.com/api.php';
var endpoint = 'http://ec2-75-101-233-141.compute-1.amazonaws.com/api2.php';

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
	$.ajax({
        url: endpoint,
        type: "post",
        data: "q=" + query,
        success: function(data){
            
        	console.log(data);

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
			ca = new Array();

	    	for (var i=0; i<result.length; i++) {
	    		var token = result[i].token;
	    		var token_output = result[i].token_output;
	    		
				var current;
				var found = false;

	    		for (var j=0; j<token_output.length && !found; j++) {
	    			current = token_output[j];
	    			if (current.spotify_id) {
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
	    		ca[i] = current.coverart;

	    		$('.songs-list').append("<div class='song blurred'><img src=" + ca[i] + " class='cover' /><div class='overlay-cover'><p class='song-title'>" + ti[i] + "</p><p class='artist-name'>" + an[i] + "</p></div></div>");
	    		$('.synced-lyrics').append("<p>" + sub[i] + "</p>");
	    	}

			var song_width = 100 / response.length + '%';
			$('.song').css( "width", song_width );

			startSpotyStuff(t,s,d);
        },
        error:function(){
            alert("Darn, some error occurred :/");
        }
    });

}


function startSpotyStuff(track, seeks, durations){

	// removing first song's blur
	$('.songs-list').children().first().removeClass('blurred');
	$('.synced-lyrics').children().first().addClass('selected');

	function SpotyTimed(current){

		if (current >= 1) {
			// update previous
			$('.songs-list').children(':eq(' + (current-1) + ')').addClass('blurred');
			$('.synced-lyrics').children(':eq(' + (current-1) + ')').removeClass('selected');

			// update current
			$('.songs-list').children(':eq(' + current + ')').removeClass('blurred');
			$('.synced-lyrics').children(':eq(' + current + ')').addClass('selected');

			// scroll div
			var newDivSize = parseInt($('.synced-lyrics').css('margin-top')) - 80;
			console.log("new size " + newDivSize);
			$('.synced-lyrics').css("margin-top", newDivSize + "px");
		}

		//models.player.stop();
		console.log("Playing " + track[current] + " starting from " + seeks[current]);
		//models.player.stop();
		models.player.playTrack(track[current], seeks[current], durations[current]);
		//models.player.seek(seeks[current]);

		// update current lyrics
	}	

	stopSpotyStuff();
	
	looper = new Array();

    var initialSlack = 700;
	var deltat = 0;
	var j;



	for(j=1; j<track.length; j++){
		//document.write("Loop " + j+ " is " + track[j] + " <br>");
		models.player.pause();
		models.player.playTrack(track[currentId]);
		models.player.pause();

		looper[j] = setTimeout(function(){ SpotyTimed(currentId++) } , deltat + durations[j-1] + initialSlack );
		//setTimeout(function() { t = track[j]; s = seeks[j]; SpotyTimed(t, s )}, deltat + durations[j-1]);
		deltat = deltat + durations[j-1];

	}
	
	//First
	looper[0] = setTimeout(function(){  SpotyTimed(currentId++) } , initialSlack+0 );
	//Last close
	looper [j] = setTimeout(function(){ models.player.stop();  }, deltat + durations[j-1] +initialSlack ); //kill the last
}

function stopSpotyStuff(){
	currentId = 0;
	for(var i = 0; i<looper.length; i++)
		clearTimeout(looper[i]);

	models.player.stop();
	
}



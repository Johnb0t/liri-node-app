// At the top of the liri.js file, write the code you need to grab the data from keys.js. Then store the keys in a variable.

// Make it so liri.js can take in one of the following commands:

// my-tweets

// spotify-this-song

// movie-this

// do-what-it-says

// What Each Command Should Do

// node liri.js my-tweets

// This will show your last 20 tweets and when they were created at in your terminal/bash window.
// node liri.js spotify-this-song '<song name here>'

// This will show the following information about the song in your terminal/bash window

// Artist(s)
// The song's name
// A preview link of the song from Spotify
// The album that the song is from
// if no song is provided then your program will default to

// "The Sign" by Ace of Base
// node liri.js movie-this '<movie name here>'

// This will output the following information to your terminal/bash window:

// Title of the movie.
// Year the movie came out.
// IMDB Rating of the movie.
// Country where the movie was produced.
// Language of the movie.
// Plot of the movie.
// Actors in the movie.
// Rotten Tomatoes Rating.
// Rotten Tomatoes URL.
// If the user doesn't type a movie in, the program will output data for the movie 'Mr. Nobody.'

// If you haven't watched "Mr. Nobody," then you should: http://www.imdb.com/title/tt0485947/
// It's on Netflix!
// node liri.js do-what-it-says

// Using the fs Node package, LIRI will take the text inside of random.txt and then use it to call one of LIRI's commands.
// It should run spotify-this-song for "I Want it That Way," as follows the text in random.txt.
// Feel free to change the text in that document to test out the feature for other commands.
// BONUS

// In addition to logging the data to your terminal/bash window, output the data to a .txt file called log.txt.

// Make sure you append each command you run to the log.txt file.

// Do not overwrite your file each time you run a command.


// enable node fs
var fs = require('fs'); 

var Twitter = require('twitter');
var spotify = require('spotify');
var Req = require('request');

var Tkeys = require('./keys.js');
var	STkeys = Tkeys.twitterKeys

// first input after file is operation to perform
var command = process.argv[2]; 

var request;
var requestArr = [];

if (process.argv.length == 4){
	request = process.argv[3];
	}
else{
	joinInputs();
}

// validate commands and log appropriately
if (command == "my-tweets" || command =="spotify-this-song" 
	|| command == "movie-this"  || command == "do-what-it-says"){     
	console.log("you selected : " + command); 
	logCommand("log.txt", command);

}
else{
	 console.log("invalid selection");
	 logCommand("errorlog.txt", command);
	 }

// handle twitter command
if (command == "my-tweets"){

	var client = new Twitter({
			 consumer_key: STkeys.consumer_key,
			 consumer_secret: STkeys.consumer_secret,
			 access_token_key: STkeys.access_token_key,
			 access_token_secret: STkeys.access_token_secret
			})

	client.get('statuses/user_timeline', function(error, tweets, response) {
		if(error) throw error;
		  for (var x = 0; x < tweets.length; x++) {
		  		console.log(tweets[x].text);
		  }
		});
}

function spotifySong(){
	spotify.search({ type: 'track', query: request }, function(err, data) {
	    if ( err ) {
	        console.log('Error occurred: ' + err);
	        return;
	    }
	    	console.log(data.tracks.items[0].artists);

	// Artist(s)
	// The song's name
	// A preview link of the song from Spotify
	// The album that the song is from


	});
}



if (command =="spotify-this-song"){

	if (request == undefined ){
		spotify.search({ type: 'track', query: "The Sign" }, function(err, data) {
		    if ( err ) {
		        console.log('Error occurred: ' + err);
		        return;
		    }
		    	//console.log(data);
		    	console.log("Artist: " + data.tracks.items[0].artists[0].name);
		    	console.log("Song: " + data.tracks.items[0].name);
		    	console.log("Album: " + data.tracks.items[0].album.name)
		    	console.log("URL: " + data.tracks.items[0].artists[0].external_urls.spotify);
		});
	} else {
		spotify.search({ type: 'track', query: request }, function(err, data) {
		    if ( err ) {
		        console.log('Error occurred: ' + err);
		        return;
		    }
		    	//console.log(data);
		    	console.log("Artist: " + data.tracks.items[0].artists[0].name);
		    	console.log("Song: " + data.tracks.items[0].name);
		    	console.log("Album: " + data.tracks.items[0].album.name)
		    	console.log("URL: " + data.tracks.items[0].artists[0].external_urls.spotify);
		});
	}
}

if (command == "movie-this"){
// node liri.js movie-this '<movie name here>'
	var ombdURL = "http://www.omdbapi.com/?t=";
	ombdURL += request;
	ombdURL += "&y=&plot=short&tomatoes=true&r=json";
	
Req(ombdURL, function (error, response, body) {
  if (!error && response.statusCode == 200) {
  	body= JSON.parse(body)// string
  	console.log(body.Title);
	console.log(body.Year);
	console.log(body.Rated);
	console.log(body.Country);
	console.log(body.Language);
	console.log(body.Plot);
	console.log(body.Actors);
	console.log(body.tomatoRating);
	console.log(body.tomatoURL); 
   // body = body.replace('{', '');
    // var MovieArr = body.split(',');
    // console.log(MovieArr[0]);// returns a string 
  }
})


 
// If the user doesn't type a movie in, the program will output data for the movie 'Mr. Nobody.'

}

if (command == "do-what-it-says"){

	fs.readFile("random.txt", "utf8", function(err, data) {
	  	console.log(data);
		var randomArr = data.split(',');
			command = randomArr[0];
			request = randomArr[1];

	  	// spotify-this-song,"I Want it That Way"
	});
		
}

///////////////////////////////////////////////////////////
//functions

function joinInputs() {
	for (var i = 3; i < process.argv.length; i++) {	
			requestArr.push(process.argv[i]);
			request = requestArr.join(' ');
		}
	}

// function to handle logging all input operations
// valid commands are sent to log.txt, invalid commands sent to errorlog.txt
function logCommand(file, action) {
	fs.appendFile(file, action +", ", function (err) { 
    	if (err){
        	console.log(err);
    	}
    	else{
        	console.log('Appended to log.');
    	}
	});
}
var fs = require('fs'); 

var Twitter = require('twitter');
var spotify = require('spotify');
var request = require('request');

var Tkeys = require('./keys.js');
var	STkeys = Tkeys.twitterKeys

// first input after file is operation to perform
var command = process.argv[2]; 

var userRequest;
var requestArray = [];

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

// if statement for process.argv with length of 4
if (process.argv.length == 4) {
    userRequest = process.argv[3];
}
else {
    for (var i = 3; i < process.argv.length; i++) {
        requestArray.push(process.argv[i]);
    };
    userRequest = requestArray.join(" ");
};

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

// function to retrieve song info
function songInfo(songName) {
    console.log("Searching for: " + songName.toUpperCase());
    spotify.search({type: "track", query: songName}, function(err, data) {
        if (err) {
            console.log("Error: " + err);
            log("error_log.txt", command + " Error: " + err);
            return;
        } else {
            for (var i = 0; i < data.tracks.items.length; i++) {
                console.log("--------------------------------------------------------------------");
                console.log("Artist: " + data.tracks.items[i].artists[0].name);
                console.log("Song Name: " + data.tracks.items[i].name);
                console.log("Album: " + data.tracks.items[i].album.name);
                console.log("Preview Link: " + data.tracks.items[i].external_urls.spotify + "\n");
            };
        };
    });
};


// function to retrieve movie info
function movieInfo(movieURL) {
    request(movieURL, function(err, response, body) {
        if (!err && response.statusCode == 200) {
            //convert body to string
            body = JSON.parse(body);
            console.log("Title: " + body.Title);
            console.log("Year: " + body.Year);
            console.log("Rating: " + body.Rated);
            console.log("Country: " + body.Country);
            console.log("Language: " + body.Language);
            console.log("Plot: " + body.Plot);
            console.log("Cast: " + body.Actors);
            console.log("Rotten Tomatoes Rating: " + body.tomatoRating);
            console.log("Rotten Tomatoes URL: " + body.tomatoURL);
        } else {
            log("error_log.txt", command + " Error: " + err);
            return;
        };
    });
};

if (command == "spotify-this-song") {
    if (userRequest == "") {
        userRequest = "The Sign";
        songInfo(userRequest);
    } else {
        songInfo(userRequest);
    };
};

if (command == "movie-this") {
    // initialize var to hold omdbURL
    var omdbURL;

    if (userRequest == "") {
        omdbURL = "http://www.omdbapi.com/?t=mr.nobody&y=&plot=short&tomatoes=true&r=json";
        movieInfo(omdbURL);
    } else {
        omdbURL = "http://www.omdbapi.com/?t=" + userRequest + "&y=&plot=short&tomatoes=true&r=json";
        movieInfo(omdbURL);
    };
};

// If the user doesn't type a movie in, the program will output data for the movie 'Mr. Nobody.'

if (command == "do-what-it-says"){

	fs.readFile("random.txt", "utf8", function(err, data) {
	  	console.log(data);
		var randomArr = data.split(',');
			userRequest = randomArr[1];
			songInfo(userRequest);
	});
		
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
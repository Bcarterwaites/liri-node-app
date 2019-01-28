require("dotenv").config();

var request = require("request")

var moment = require("moment")

var keys = require("./keys.js");

var fs = require("fs");


var Spotify = require("node-spotify-api")

var spotify = new Spotify(keys.spotify);

var command = process.argv[2];
var userQuery = process.argv.slice(3).join(" ");

var queryUrl = "https://rest.bandsintown.com/artists/" + userQuery + "/events?app_id=codingbootcamp"

var queryUrl2 = "https://www.omdbapi.com/?t=" + userQuery + "&y=&plot=short&apikey=trilogy"



function inputCommand(command, userQuery) {
    switch (command) {
        case "spotify-this":
        spotThis();
        break;
        case "movie-this":
        movieThis();
        break;
        case "concert-this":
        concertThis();
        break;
        case "do-what-it-says":
        doThis(userQuery);
        break;
    }


}

inputCommand(command, userQuery);

function spotThis() {

    if (!userQuery) {
        userQuery = "the sign ace of base"
    }

    spotify.search({ type: 'track', query: userQuery, limit: 1 }, function(error, data) {
        if (error) {
            return console.log('Error occurred ' + error);


        }

        var spotifyArr = data.tracks.items;

        for (i = 0; i < spotifyArr.length; i++) {
            console.log('Artist: ' + data.tracks.items[i].album.artists[0].name);
            console.log('Song: ' + data.tracks.items[i].name);
            console.log('Preview link: ' + data.tracks.items[i].external_urls.spotify);
            console.log('Album: ' + data.tracks.items[i].album.name)
        }
    });
}

function concertThis() {
    

    request(queryUrl, function(error, response, body) {

        if (!error && response.statusCode === 200) {
            
            var data = JSON.parse(body);
            
            if (data.length > 0) {
                
            for (var i = 0; i < 1; i++) {

                console.log("Artist: " + data[i].lineup[0]);

                console.log("Venue: " + data[i].venue.name);

                console.log("Venue Location: " + data[i].venue.city + ", " + data[i].venue.country);

               var date = moment(data[i].datetime).format("MM/DD/YYYY hh:00 A");

                console.log("Date and Time: " + date);
            }

        } else {
            console.log("Concert not found");
        };

    };

});

}

function movieThis() {
    
    if (!userQuery) {
        userQuery = "mr nobody"
     }

    request(queryUrl2, function(error, response, body) {
        var movieInfo = JSON.parse(body);

        var ratingsArr = movieInfo.Ratings;

     // if (ratingsArr.length > 2) {

      // }

      for (i = 0; i < ratingsArr.length; i++)


       if (!error && response.statusCode === 200) {
            
            console.log("Title: " + movieInfo.Title);
            console.log("Release Year: " + movieInfo.Year);
            console.log("IMDB Rating: " + movieInfo.imdbRating);
            //console.log("Rotten Tomatoes Rating: " + movieInfo.Ratings[1].Value)
            console.log("Country: " + movieInfo.Country);
            console.log("Language: " + movieInfo.Language);
            console.log("Plot: " + movieInfo.Plot);
            console.log("Actors: " + movieInfo.Actors);

        } else {
            return console.log("Movie not found" + error)
        }
    });

}


function doThis() {

    fs.readFile("random.txt", "utf8", function(error, data) {

        if (error) {

            return console.log(error);
        }

        var dataArr = data.split(",");

        command = dataArr[0];
        userQuery = dataArr[1];

        inputCommand(command, userQuery)

    })

}
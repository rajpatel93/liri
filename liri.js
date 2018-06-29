require("dotenv").config();


var keys = require("./keys.js");
var Twitter = require("twitter");
var client = new Twitter(keys.twitter);

var fs = require("fs");

var Spotify = require("node-spotify-api");
var spotify = new Spotify(keys.spotify);

var request = require("request");

var requestType = process.argv[2];
var textFile = "log.txt";

function omdb(movie){
  request("http://www.omdbapi.com/?t="+movie+"&y=&plot=short&apikey=trilogy", function(error, response, body) {
    if (error) {
      return console.log(error);
    }
      console.log("\nMovie: " + JSON.parse(body).Title+"\n\nYear of Movie Released: "+JSON.parse(body).Year+"\n\nIMDB Rating: "+JSON.parse(body).Rated+"\n\nRotten Tomatoes Rating: "+JSON.parse(body).Ratings[1].Value+"\n\nCountry: "+JSON.parse(body).Country+"\n\nLanguages: "+JSON.parse(body).Language+"\n\nPlot: "+JSON.parse(body).Plot+"\n\nActors: "+JSON.parse(body).Actors);
      
      var movieInfo="\nMovie: " + JSON.parse(body).Title+"\nYear of Movie Released: "+JSON.parse(body).Year+"\nIMDB Rating: "+JSON.parse(body).Rated+"\nRotten Tomatoes Rating: "+JSON.parse(body).Ratings[1].Value+"\nCountry: "+JSON.parse(body).Country+"\nLanguages: "+JSON.parse(body).Language+"\nPlot: "+JSON.parse(body).Plot+"\nActors: "+JSON.parse(body).Actors;
     
      writeToFile(movieInfo);
  });
}
function spotify(theSong){
  spotify.search({ type: "track", query: theSong}, function(err,data) {
    if (err) {
      return console.log("Error has been made: " + err);
    }
    var artist=JSON.stringify(data.tracks.items[0].album.artists[0].name, null, 2);
    var albumName=JSON.stringify(data.tracks.items[0].album.name, null, 2);
    var previewLink=JSON.stringify(data.tracks.items[0].album.external_urls.spotify, null, 2);
    var song=JSON.stringify(data.tracks.items[0].name, null, 2);
    console.log("\nArtist: "+artist+"\n\nSong: "+song+"\n\nAlbum Name: "+albumName+"\n\nPreview Link: "+previewLink);
    var dataToPrint="\nArtist: "+artist+"\nSong:"+song+"\nAlbum Name: "+albumName+"\nPreview Link: "+previewLink
    writeToFile(dataToPrint);
  });
  }

function writeToFile(data){
  fs.appendFile(textFile,data+",\n", function(err) {
      if (err) {
        return console.log(err);
      }
        console.log("\nInformation added to log.txt!\n");
    });
  }

switch(requestType){
case "my-tweets":
  client.get("statuses/home_timeline", { q: "node.js" }, function(error,tweets,response) {
    if (error) throw error;
    var dataArr = [];
    for (var i = 0; i < tweets.length; i++) {
      dataArr.push((i+1)+". "+tweets[i].text+"\n");
    }
    writeToFile(dataArr);
  });
 break;
case "spotify-this-song":
  if(process.argv[3]){
      spotify(process.argv.splice(3).join(","));
    }else{
      spotify("I Want it That Way");
    }
  break; 
case "movie-this":
  if(process.argv[3]){
    omdb(process.argv.splice(3).join("+"));
  }else{
    omdb("Mr.Nobody");
  }
break;
case "do-what-it-says":
  fs.readFile("random.txt", "utf8", function(error, data) {
    if (error) {

      return console.log(error);
    }

      console.log(data);
      var dataArr = data.split(",");
      console.log(dataArr[0]);
      console.log(dataArr[1]);

      switch(dataArr[0]){

        case "spotify-this-song":
        spotify(dataArr[1]);

        break;

        case "movie-this":
        omdb(dataArr[1].split(" ").join("+"));

        break;
      }

  });

  break;
  
  default:
    console.log("Oh man you did do what you needed to :/.");
  break;
}

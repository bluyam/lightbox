// Kyle Wilson
// Slack Challenge
// TODO: Add metadata, clean code, code reviews, etc...

// construct api call
var baseURL = "https://api.flickr.com/services/rest/";
var format = "json";
var method = "flickr.galleries.getPhotos";
var apiKey = "40a902327d6c6c0bf873c91945dfc3bd";
var galleryId = "6065-72157617483228192";
var noJSONCallback = 1;
var apiCall = baseURL + "?format=" + format + "&method=" + method +
                        "&api_key=" + apiKey + "&gallery_id=" + galleryId +
                        "&nojsoncallback=" + noJSONCallback;

// httpGetAsync(url, callback):
// sends an http GET request and performs some
// callback function on the responseText
function httpGetAsync(url, callback) {
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() {
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
            callback(xmlHttp.responseText);
    }
    xmlHttp.open("GET", url, true);
    xmlHttp.send(null);
}

// initializeGalleryFromJSON(json):
// initialize webpage by retrieving images from gallery
// and then adding the appropriate html
function initializeGalleryFromJSON(json) {
  var obj = JSON.parse(json);
  var p = obj.photos.photo;
  for (var i = 0; i < p.length; i++) {
    var img = document.createElement('img');
    url =  "http://c2.staticflickr.com/"
    url += p[i].farm + '/';
    url += p[i].server + '/';
    url += p[i].id + '_';
    url += p[i].secret + '_n.jpg';
    img.setAttribute('src',url);
    var image = new Image();
    image.src = url;
    var attr;
    if (image.width > image.height) attr = "height";
    else attr = "width";
    img.setAttribute(attr,100);
    var node = document.createElement('li');
    node.setAttribute('class','imageWrapper');
    node.appendChild(img);
    document.getElementById('imageGallery').appendChild(node);
  }
}

httpGetAsync(apiCall, initializeGalleryFromJSON);

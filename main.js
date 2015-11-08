// Kyle Wilson
// Slack Challenge
// TODO: Add metadata, clean code, code reviews, etc...

// global data storage of photos
var photoUrls = new Array();

// cat names
var photoNames = ['Fluffy','Muffy','Buffy','Tuffy','Scruffy',
                  'Cuddly','Puddly','Ruddy','Muddy','Buddy',
                  'Sluggy','Druggie','Shruggie','Ugly','Juggly'];

// cat ages
var ages = [1,4,2,3,4,1,2,3,4,3,2,1,2,3,4];

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
  var photoCount = p.length;
  animateValue("value", 0, photoCount, 150);
  for (var i = 0; i < photoCount; i++) {
    console.log(p[i].title);
    url =  "http://c2.staticflickr.com/"
    url += p[i].farm + '/';
    url += p[i].server + '/';
    url += p[i].id + '_';
    url += p[i].secret + '_n.jpg';
    photoUrls.push(url);
    var image = document.createElement('div');
    image.setAttribute('class','image');
    image.setAttribute('style','background-image: url('+url+');');
    image.setAttribute('id',i);
    image.setAttribute('onclick','revealLightbox('+i+")");
    var node = document.createElement('li');
    node.setAttribute('class','imageWrapper');
    var status = document.createElement('div');
    var random = Math.floor((Math.random() * 9) + 2)
    var activityDot = '<label id="activity">\u2022</label>';
    status.innerHTML = activityDot + ' About ' + random + ' miles away';
    status.setAttribute('class','caption');
    node.appendChild(image);
    node.appendChild(status);
    document.getElementById('imageGallery').appendChild(node);
  }
}

// revealLightbox(id):
// displays lightbox containing appropriate image
// when thumbnail is clicked in gallery
// lightbox is hidden when clicked
function revealLightbox(id) {
  var currentImageId = id;
  var thumbnail = document.getElementById(id);
  var imageUrl = thumbnail.style.backgroundImage.slice(4,-1).replace(/"/g, "");
  var overlayImage = document.getElementById('overlayImage');
  var caption = document.getElementById('caption');
  var bio = document.getElementById('snapshot');
  overlayImage.setAttribute('src',imageUrl);
  caption.innerHTML = 'Join today to match with '+photoNames[id]+'.';
  bio.innerHTML = photoNames[id]+', age '+ages[id];
  overlayImage.setAttribute('alt',photoNames[id]);
  var overlay = document.getElementById('overlay');
  overlay.setAttribute('style','display: block;');

  // anonymous onclick-triggered function():
  // ensures that the box disappears when clicked
  overlay.onclick = function() {
    overlay.setAttribute('style','display: none;');
  }

  // anonymous onkeydown-triggered function():
  // implements carousel for left and right arrow keys
  document.onkeydown = function(e) {
      // left arrow key pressed
      if (e.keyCode == '37') {
        if (currentImageId == 0) {
          currentImageId = photoUrls.length;
        }
        caption.innerHTML = 'Join today to match with '+photoNames[currentImageId-1]+'.';
        bio.innerHTML = photoNames[currentImageId-1]+', age '+ages[currentImageId-1];
        overlayImage.setAttribute('src',photoUrls[currentImageId-1]);
        overlayImage.setAttribute('alt',photoNames[--currentImageId]);
      }
      // right arrow key pressed
      if (e.keyCode == '39') {
        if (currentImageId == photoUrls.length-1) {
          currentImageId = -1;
        }
        caption.innerHTML = 'Join today to match with '+photoNames[currentImageId+1]+'.';
        bio.innerHTML = photoNames[currentImageId+1]+', age '+ages[currentImageId+1];
        overlayImage.setAttribute('src',photoUrls[currentImageId+1]);
        overlayImage.setAttribute('alt',photoNames[++currentImageId]);
      }
    }
}

// animateValue(id, start, end, duration)
// animates count up to number of matches
function animateValue(id, start, end, duration) {
    var range = end - start;
    var current = start;
    var increment = end > start? 1 : -1;
    var stepTime = Math.abs(Math.floor(duration / range));
    var obj = document.getElementById(id);
    var timer = setInterval(function() {
        current += increment;
        obj.innerHTML = current;
        if (current == end) {
            clearInterval(timer);
        }
    }, stepTime);
}

httpGetAsync(apiCall, initializeGalleryFromJSON);

// Kyle Wilson
// Slack Challenge

// global data storage of photos
var photoUrls = new Array();

// cat names (must be static)
var photoNames = ['Fluffy','Muffy','Buffy','Tuffy','Scruffy',
                  'Cuddly','Puddly','Ruddy','Muddy','Buddy',
                  'Sluggy','Druggie','Shruggie','Ugly','Juggly'];

// cat ages (must be static)
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

// animateValue(id, start, end, duration):
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

// generatePhotoURL(photo):
// generate source url using json photo data
// add url to array of urls
function generatePhotoURL(photo) {
  var url =  "http://c2.staticflickr.com/";
  url += photo.farm + '/';
  url += photo.server + '/';
  url += photo.id + '_';
  url += photo.secret + '_n.jpg';
  photoUrls.push(url);
}

// generateThumbnail(index):
// generates thumbnail div from the ith photoUrl
function generateThumbnail(i) {
  var image = document.createElement('div');
  image.setAttribute('class','image');
  image.setAttribute('style','background-image: url('+photoUrls[i]+');');
  image.setAttribute('id',i);
  image.setAttribute('onclick','revealLightbox('+i+")");
  return image;
}

// generateStatusBar():
// generate status div with random distance
function generateStatusBar() {
  var status = document.createElement('div');
  var random = Math.floor((Math.random() * 9) + 2);
  var activityDot = '<label class="activity">\u2022</label>';
  status.innerHTML = activityDot + ' About ' + random + ' miles away';
  status.setAttribute('class','caption');
  return status;
}

// generateImageWrapper(thumb, status):
// generates wrapper from thumbnail and status bar
function generateImageWrapper(thumb, status) {
  var node = document.createElement('li');
  node.setAttribute('class','imageWrapper');
  node.appendChild(thumb);
  node.appendChild(status);
  return node;
}

// setGalleryImage(photo, index):
// adds image from json object to gallery with appropriate elements
function setGalleryImage(photo, index) {
  generatePhotoURL(photo);
  var thumb = generateThumbnail(index);
  var status = generateStatusBar();
  var wrapper = generateImageWrapper(thumb, status);
  document.getElementById('imageGallery').appendChild(wrapper);
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
    setGalleryImage(p[i], i);
  }
}

// refreshOverlay(caption, bio, overlayImage, currentImageId):
// refresh elements within overlay based on next image
function refreshOverlay(currentImageId) {
  var caption = document.getElementById('caption');
  var bio = document.getElementById('bio');
  var overlayImage = document.getElementById('overlayImage');
  caption.innerHTML = 'Join today to match with '+photoNames[currentImageId]+'.';
  bio.innerHTML = photoNames[currentImageId]+', age '+ages[currentImageId];
  overlayImage.setAttribute('src',photoUrls[currentImageId]);
}


// revealLightbox(id):
// displays lightbox containing appropriate image
// when thumbnail is clicked in gallery
// lightbox is hidden when clicked
function revealLightbox(id) {
  refreshOverlay(id);
  var overlay = document.getElementById('overlay');
  overlay.setAttribute('style','display: block;');

  // anonymous onclick-triggered function():
  // ensures that the box disappears when clicked
  overlay.onclick = function() {
    overlay.setAttribute('style','display: none;');
  }

  // anonymous onkeydown-triggered function():
  // implements carousel for left and right arrow keys
  var currentImageId = id;
  document.onkeydown = function(e) {
      // left arrow key pressed
      if (e.keyCode == '37') {
        if (currentImageId == 0) {
          currentImageId = photoUrls.length;
        }
        refreshOverlay(--currentImageId);
      }
      // right arrow key pressed
      if (e.keyCode == '39') {
        if (currentImageId == photoUrls.length-1) {
          currentImageId = -1;
        }
        refreshOverlay(++currentImageId);
      }
    }
}

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

httpGetAsync(apiCall, initializeGalleryFromJSON);

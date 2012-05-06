Unicorn = (function() {
  var po, map;

  function init() {
    po = org.polymaps;
    initMap();
    loadUnicorns();
    getTweets();
  }

  function initMap() {
    map = po.map()
            .container(document.getElementById("map").appendChild(po.svg("svg")))
            .add(po.interact());

    map.add(po.image()
              .url(po.url("http://{S}tile.cloudmade.com" +
                          "/1a1b06b230af4efdbb989ea99e9841af" + // http://cloudmade.com/register
                          "/998/256/{Z}/{X}/{Y}.png")
                     .hosts(["a.", "b.", "c.", ""])));
  }

  function loadUnicorns(){
    $.getJSON('/geocorn/sightings', function(data){
      buildUnicorns($.map(data, function(unicorn) {
        return {
          lat: parseFloat(unicorn[0]),
          lng: parseFloat(unicorn[1]),
          type: unicorn[2],
          title: unicorn[3]
        };
      }));
    });
  }

  function buildUnicorns(unicorns) {
    map.add(po.geoJson()
              .features($.map(unicorns, function(unicorn) {
                return buildUnicorn(unicorn);
              }))
              .on('load', styleUnicorns)
           );
  }

  function buildUnicorn(unicorn) {
    return {
      geometry: {
        coordinates: [unicorn.lng, unicorn.lat],
        type: 'Point'
      },
      properties: {
        title: unicorn.title || '',
        type: unicorn.type || ''
      }
    };
  }

  function styleUnicorns(e) {
    $.each(e.features, function(i, unicorn) {
      unicorn.element.setAttribute('class', unicorn.data.properties.type);
      unicorn.element.setAttribute('title', unicorn.data.properties.title);
      unicorn.element.addEventListener('mouseover', function(e) {
        showDescription(this);
      });
      unicorn.element.addEventListener('mouseout', function(e) {
        clearDescription();
      });
    });
  }

  function showDescription(item) {
    console.log(item);
    $('#description').attr('class', item.getAttribute('class')).text(item.getAttribute('title'));
  }

  function clearDescription() {
    $('#description').text('');
  }

  var REFRESH_RATE = 5000;
  var TWITTER_SEARCH_BASE = 'http://search.twitter.com/search.json';
  var search_params = '?q=unicorn+OR+unicorns';
  function getTweets() {
    var url = TWITTER_SEARCH_BASE + search_params + '&callback=?';
    $.getJSON(url, function(data) {
      search_params = data.refresh_url;
      $.each(data.results, handleTweet);
      setTimeout(getTweets, REFRESH_RATE);
    });
  }

  var TWITTER_BASE = 'http://twitter.com';
  function handleTweet(i, tweet) {
    $('#tweets').prepend(
      $('<li>', {'class': 'tweet'}).append(
        $('<img>', {src: tweet.profile_image_url}),
        $('<a>', {href: TWITTER_BASE + '/' + tweet.from_user}).text('@' + tweet.from_user),
        $('<p>').text(tweet.text)
      )
    );
  }

  return {
    init        : init,
    handleTweet : handleTweet
  };
})();

$(Unicorn.init);

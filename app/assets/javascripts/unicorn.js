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
      buildUnicorns($.map(data, function(geo) {
        return {
          lat: parseFloat(geo[0]),
          lng: parseFloat(geo[1])
        };
      }));
    });
  }

  function buildUnicorns(unicorns) {
    map.add(po.geoJson().features($.map(unicorns, function(unicorn) {
      return buildUnicorn(unicorn);
    })));
  }

  function buildUnicorn(unicorn) {
    return {
      geometry: {
        coordinates: [unicorn.lng, unicorn.lat],
        type: 'Point'
      }
    };
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

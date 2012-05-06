Unicorn = (function() {
  var po, map;

  function init() {
    po = org.polymaps;
    initMap();
    getTweets();

    load_unicorns();
  }

  function initMap() {
    map = po.map()
            .container(document.getElementById("map").appendChild(po.svg("svg")));

    map.add(po.image()
              .url(po.url("http://{S}tile.cloudmade.com" +
                          "/1a1b06b230af4efdbb989ea99e9841af" + // http://cloudmade.com/register
                          "/998/256/{Z}/{X}/{Y}.png")
                     .hosts(["a.", "b.", "c.", ""])));
  }

  function load_unicorns(){
    $.getJSON('/geocorn/sightings', function(data){
      for (var i=0; i < data.length; i++){
        var lat = parseFloat(data[i][0]),
            lon = parseFloat(data[i][1]);
        load_unicorn(lat, lon);
      }
    })
  }

  function load_unicorn(lat, lon) {
    var marker = po.svg('circle');
    var mappos = map.locationPoint({lat: lat, lon: lon});
    marker.setAttribute('r', 2);
    marker.setAttribute('cx', mappos.x);
    marker.setAttribute('cy', mappos.y);
    $('#map svg')[0].appendChild(marker);
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
    init : init,
    handleTweet : handleTweet
  };
})();

$(Unicorn.init);

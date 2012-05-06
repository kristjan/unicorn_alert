Unicorn = (function() {
  var po, map;

  function init() {
    po = org.polymaps;
    initMap();
    getTweets();
  }

  function initMap() {
    map = po.map()
            .container(document.getElementById("map").appendChild(po.svg("svg")))
            .add(po.interact())
            .add(po.hash());

    map.add(po.image()
              .url(po.url("http://{S}tile.cloudmade.com" +
                          "/1a1b06b230af4efdbb989ea99e9841af" + // http://cloudmade.com/register
                          "/998/256/{Z}/{X}/{Y}.png")
                     .hosts(["a.", "b.", "c.", ""])));

    map.add(po.compass().pan("none"));
  }

  var REFRESH_RATE = 500;
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
    $('#tweets').find('.tweet').removeClass('top');

    var listItem = $('<li>', {'class': 'tweet top'}).append(
        $('<div>', {'class': 'tweetWrapper'}).append(
          $('<a>', {href: TWITTER_BASE + '/' + tweet.from_user}).append(
            $('<img>', {'class': 'userPic', src: tweet.profile_image_url}),
            $('<h2>').text('@' + tweet.from_user),
            $('<p>').text(tweet.text)
          )
        )
      ).hide().prependTo('#tweets').slideDown(1000);
    
  }

  return {
    init : init,
    handleTweet : handleTweet
  };
})();

$(Unicorn.init);

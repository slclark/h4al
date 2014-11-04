$(function() {
	// load data
	var url = 'https://s3.amazonaws.com/lafayette-co-arts/lafayette-co-public-art.json';

	$.getJSON(url, function(data) {
		getItems(data);
	});

	/**
	 *  Process the feed data
	 *  @param the json data
	 **/
	function getItems(json) {
		var html_alley = html_rotating = html_perm = '';
		var galleries = {};

		var obj = json;
		var counter = 0;
		// set up galleries
		$.each(obj, function(i, val) {
			if (!_.has(galleries, this.collection)) {
				galleries[this.collection] = new Array();
			}
			galleries[this.collection].push(this);
		});
		$.each(galleries, function(i, artworks) {

			// create the gallery if it does not exist
			var key = i.replace(/\W/g, '').toLowerCase();
			if ($('.gallery-' + key).length == 0) {
				$('.galleries').append('<h2>' + i + '</h2><div class="gallery gallery-' + key + '"></div>');
			}

			// add images
			$.each(artworks, function(k, art) {
				var thisid = key + k;
				var maplink = 'https://maps.google.com/maps?q=' + art.latitude + ',' + art.longitude + '&output=classic';
				var info = '<div class="info" id="info_' + thisid + '"><strong>Title:</strong> <span class="swipebox-sc-title">' + art.title + '</span> by ' + art.artist + '<br/><strong>From the collection: </strong> <span class="swipebox-sc-collection">' + art.collection + '</span><br/><strong>Address:</strong> <span class="swipebox-sc-address" data-href="' + maplink + '">' + art.address + '</span></div>';

				// form html for images in gallery
				var linkImg = 'https://images1-focus-opensocial.googleusercontent.com/gadgets/proxy?url=' + encodeURIComponent('https://s3.amazonaws.com/lafayette-co-arts/images/' + art.image) + '&container=focus&resize_w=650&refresh=31536000';
				var thumbImg = 'https://images1-focus-opensocial.googleusercontent.com/gadgets/proxy?url=' + encodeURIComponent('https://s3.amazonaws.com/lafayette-co-arts/images/' + art.image) + '&container=focus&resize_w=150&refresh=31536000';

				var html = '<a id="item_' + thisid + '" title="' + art.title + '" rel="' + key + '" class="swipebox img_link" href="' + linkImg + '"><img src="' + thumbImg + '" class="img-responsive" alt="' + art.title + '"/>' + info + '</a>';
				$('.gallery-' + key).append(html);
			});

		});

		// create justified gallery
		$(".gallery").justifiedGallery({
			captions : true,
			captionSettings : {
				animationDuration : 500,
				visibleOpacity : 1.0,
				nonVisibleOpacity : 1.0
			}
		});

		var updateImgInfoHandler = function() {
			updateImgInfo();
		};

		// init the swipebox
		$('.swipebox').swipebox({
			loopAtEnd : true,
			hideBarsDelay : 5000,
			afterOpen : function() {
				// keep checking for when swipebox container has loaded
				var checkContLoaded = setInterval(function() {
					if ($('#swipebox-container').length > 0 && $('#swipebox-info-btn').length <= 1) {
						// add more info options and addthis share links
						//$('#swipebox-container').append('<div class="swipebox-sc-share"> <div class="addthis_sharing_toolbox"></div></div><a id="swipebox-info-btn"><img src="/assets/images/btn/info.png"/></a><div id="swipebox-info-container" style="display:none;"></div>');
						$('#swipebox-container').append('<a id="swipebox-info-btn"><img src="/assets/images/btn/info.png"/></a><div id="swipebox-info-container" style="display:none;"></div>');
						
						//initAddThis();
						// turn more info into a modal
						$('#swipebox-info-btn').on('click touchend', function() {
							$('#swipebox-info-container').toggle();
						});
						clearInterval(checkContLoaded);

						// populate swipebox-info-container with this image's info
						var checkInfoContLoaded = setInterval(function() {
							if ($('#swipebox-info-container').length > 0) {
								updateImgInfo();
								clearInterval(checkInfoContLoaded);
							}

						}, 300);

						// event handlers so changing images will update info
						$('#swipebox-prev').bind('click touchend', updateImgInfoHandler);
						$('#swipebox-next').bind('click touchend', updateImgInfoHandler);
						$('body').bind('touchend', updateImgInfoHandler);

						$(document).keydown(function(e) {
							updateImgInfoHandler();
						});
					}

				}, 300);

			},
			afterClose : function() {
				$('#swipebox-prev').unbind('click touchend', updateImgInfoHandler);
				$('#swipebox-next').unbind('click touchend', updateImgInfoHandler);
				$('body').unbind('touchend', updateImgInfoHandler);
			}
		});
	}

});
var shorturl = '';

/*
 * check if url exists
 */
function UrlExists(url) {
	var http = new XMLHttpRequest();
	http.open('HEAD', url, false);
	http.send();
	return http.status != 404;
}

/*
 * update the info box and links with the currently viewed image
 */
function updateImgInfo() {
	// first clear
	$('#swipebox-info-container').empty();
	//TODO need to wait until the current image has finished loading
	var checkCurrentLoaded = setInterval(function() {
		// only one current
		// current is not also loading
		if ($('.slide.current').length == 1 && $('.slide.slide-loading.current').length == 0) {
			var src = $('.slide.current').find('img').attr('src');
			var img_info = $('.gallery').find('a[href="' + src + '"]').find('.info').html();
			
			// load image info
			$('#swipebox-info-container').html(img_info);
			// get short url
			var longurl = $('.swipebox-sc-address').attr('data-href');
			gapi.client.load('urlshortener', 'v1', function() {
				var request = gapi.client.urlshortener.url.insert({
					'resource' : {
						'longUrl' : longurl
					}
				});
				var resp = request.execute(function(resp) {
					if (resp.error) {
						shorturl = longurl;
					} else {
						shorturl = resp.id;
					}
					// create sharing links
					var title = $('#swipebox-info-container').find('.swipebox-sc-title').text();
					var msg = 'I <3 #ArtsLafayette and saw "' + title + '" in #LafayetteCO';
					var tweet = msg+' '+shorturl;
					var twitter_link = '<br/><span class="swipebox-sc-twitter" data-href="http://twitter.com/share?text='+encodeURIComponent(tweet)+'">Tweet This</span>';
					$('#swipebox-info-container').append(twitter_link);
					
					setupLinks();

					//var title = $('#swipebox-info-container').find('.swipebox-sc-title').text();
					//var msg = encodeURIComponent('I <3 #ArtsLafayette and saw "' + title + '" in #LafayetteCO');
					//var shareurl = encodeURIComponent(shorturl);
					//addthis.update('share', 'url', shareurl);
					//addthis.update('share', 'title', msg);
					//addthis.update('share', 'description', msg);
					//$('.addthis_sharing_toolbox').attr('data-url', shareurl);
					//$('.addthis_sharing_toolbox').attr('data-title', msg);
				});
			});
			
			
			clearInterval(checkCurrentLoaded);
		}
	}, 300);

}

/*
 * enable map link
 */
function setupLinks() {
	// handle the map and twitter link and the twitter link
	$('.swipebox-sc-address, .swipebox-sc-twitter').on('click touchend', function(event) {
		var href = $(this).attr('data-href');
		window.open(href, '_blank');
		event.stopPropagation();
		event.preventDefault();
	});

}

/*
 * load google api tools for url shortener
 */
function gapiLoad() {
	gapi.client.setApiKey('AIzaSyDZWoBQkDJViguZX1j779hH6vpxrbIWsdA');

}

/*
 * init addthis share buttons after container loaded on page
 */
function initAddThis() {
	addthis.init();
}

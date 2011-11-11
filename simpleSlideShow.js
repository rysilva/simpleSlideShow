/**
 * simpleSlideShow
 * A simple slideshow which performs a nice crossfade between images, and shows a caption when hovering over
 * There is no navigation (yet)
 *
 * Initialization:
 * $slideshowContainer.simpleSlideShow({
 *      delay: 5000,            //Time to show each image before transitioning, in ms.  Default 5000
 *      transitionDelay: 800,   //How long the crossfade takes, in ms.  Default 800
 *      images: [               //Array of objects of the form shown below
            {
                    src: 'images/ss/ss01.jpg',
                    caption: 'Lane Stadium, Blacksburg, Virginia'
            },
            {
                    src: 'images/ss/ss02.jpg',
                    caption: 'Sunrise from Dragon\'s Tooth, Cove Mountain, Virginia'
            },
            {
                    src: 'images/ss/ss03.jpg',
                    caption: 'Crab on the beach at Guaruja, Brazil'
            }
        ]
    });
 */

(function($) {

    $.fn.simpleSlideShow = function(options) {
        
        // Create some defaults, extending them with any options that were provided
        var settings = $.extend( {
            delay: 5000,
            transitionDelay: 800,
            images: []
        }, options);

        var currImg = 0, images = settings.images, captionPadding = 15;

        if ( images.length < 2 ) {
            throw new Error("Error: Can't make a slideshow with less than 2 images.");
        }
        
        //There are 2 images at a time on the page, one behind the other, both absolutely positioned
        //To do the crossfade, image 1 fades in or out.  Image 2 is always at 100% opacity
        this.empty();
        var $2 = $('<img>').hide().appendTo(this),
            $1 = $('<img>').hide().appendTo(this),
            $caption = $('<div class="caption">').hide().appendTo(this);

        $1.css('position', 'absolute');
        $2.css('position', 'absolute');
        $caption.css("background-color", "rgba(0,0,0,0.5)")
                .css('color', '#eee')
                .css('padding', '10px ' + captionPadding + 'px')
                .css('position', 'relative')
                .css('text-shadow', '#222 0 0 5px');


        //Set the initial images
	$2.attr('src', images[1]['src']).attr('caption', images[1]['caption']);
	$1.attr('src', images[0]['src']).attr('caption', images[0]['caption'])
            .fadeIn(settings.transitionDelay, function() {
                    //show the second one now, which is behind the first one
                    $2.show();
            });

        if ( images[0]['caption'] ) {
            $caption.text(images[0]['caption']);
            $caption.css('width', ($1.outerWidth()-2*captionPadding) + 'px');
        }
				
        //Show/hide caption
	this.hover( 
            function(){
                    if ( $caption.is(":animated") ) {
                            $caption.stop();
                    }
                    $caption.fadeTo(600, $caption.text() ? 1 : 0 );
                    
            },
            function() {
                    if ( $caption.is(":animated") ) {
                            $caption.stop();
                    }
                    $caption.fadeTo(400, 0);
            }
        );
	
        //Start the slideshow
	setInterval(function() {
		
		//Hide the first image, show the second one.
		if ( currImg % 2 == 0 ) {
			$1.fadeOut(settings.transitionDelay,
				function(idx){
					return function() {
						//Load next image #1
                                                var caption = images[idx].caption || ""; 
						$1.attr('src', images[idx]['src']).attr('caption', caption);
						//Set caption on image 2
                                                caption = images[(idx+images.length-1)%images.length].caption || "";
                                                $caption.text(caption);
                                                $caption.css('width', ($2.outerWidth()-2*captionPadding) + 'px');
                                                //If there is no caption, hide it
                                                if ( !caption ) {
                                                    $caption.fadeTo(400,0);
                                                }
					}
				}((currImg+2)%images.length)
			);
		}
		//Hide the second image, show the first one
		else {
			$1.fadeIn(settings.transitionDelay,
				function(idx) {
					return function() {
                                                var caption = images[idx].caption || "";
						$2.attr('src', images[idx]['src']).attr(caption);
                                                caption = images[(idx+images.length-1)%images.length].caption || "";
                                                $caption.text(caption);
                                                $caption.css('width', ($1.outerWidth()-2*captionPadding) + 'px');
                                                if ( !caption ) { 
                                                    $caption.fadeTo(400,0);
                                                }
					}
				}((currImg+2)%images.length)
			);
		}
		
		currImg++;
		
	}, settings.delay);

        
        return this;
    };

})(jQuery);

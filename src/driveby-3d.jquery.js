/*!
 * jQuery lightweight plugin boilerplate
 * Original author: @ajpiano
 * Further changes, comments: @addyosmani
 * Licensed under the MIT license
 */


// the semi-colon before the function invocation is a safety 
// net against concatenated scripts and/or other plugins 
// that are not closed properly.
;(function ( $ ) {
    
    // undefined is used here as the undefined global 
    // variable in ECMAScript 3 and is mutable (i.e. it can 
    // be changed by someone else). undefined isn't really 
    // being passed in so we can ensure that its value is 
    // truly undefined. In ES5, undefined can no longer be 
    // modified.
    
    // window and document are passed through as local 
    // variables rather than as globals, because this (slightly) 
    // quickens the resolution process and can be more 
    // efficiently minified (especially when both are 
    // regularly referenced in your plugin).

    // CHANGE THE BELOW NAME TO REFLECT THE NAME OF THE PLUGIN ( i.e. $('#div').pluginName() )
    var pluginName = 'Driveby3D',
        defaults = {
            buttons: []
        };

    var section
      , video
      , camera
      , scene
      , renderer
      , videoImage;

    // The actual plugin constructor
    function Plugin( element, options ) {
        this.element = element;

        // jQuery has an extend method that merges the 
        // contents of two or more objects, storing the 
        // result in the first object. The first object 
        // is generally empty because we don't want to alter 
        // the default options for future instances of the plugin
        this.options = $.extend( {}, defaults, options) ;
        
        this._defaults = defaults;
        this._name = pluginName;
        
        this.init();
        
    }

    Plugin.prototype.init = function () {
        // Place initialization logic here
        // You already have access to the DOM element and
        // the options via the instance, e.g. this.element 
        // and this.options
        // make our container easily accessible
        var self = this;

        video = self.element;

        video.addEventListener('canplaythrough', function(e) {
            video.muted = true;
            video.play();
            animate();
        });

        scene = new THREE.Scene();
        camera = new THREE.PerspectiveCamera( 60, $(self.element).width() / $(self.element).height(), .1, 1000 );

        renderer = new THREE.WebGLRenderer();
        renderer.setSize( $(self.element).width(), $(self.element).height() );
        $('body').append(renderer.domElement);

        videoImage = document.createElement( 'canvas' );
        videoImage.width = 1920;
        videoImage.height = 1080;

        videoImageContext = videoImage.getContext( '2d' );

        // background color if no video present
        videoImageContext.fillStyle = '#000000';
        videoImageContext.fillRect( 0, 0, videoImage.width, videoImage.height );

        texture = new THREE.Texture( videoImage );
        texture.generateMipmaps = false;
        texture.format = THREE.RGBFormat;

        var movieMaterial = new THREE.MeshBasicMaterial( { map: texture, overdraw: true, side: THREE.DoubleSide } );

        var movieGeometry = new THREE.PlaneGeometry( 240, 100, 4, 4 );
        var movieScreen = new THREE.Mesh( movieGeometry, movieMaterial );
        movieScreen.position.set(0,50,0);
        scene.add(movieScreen);
        
        camera.position.set(0,150,300);
        camera.lookAt(movieScreen.position);

    };

    function animate() 
    {
        requestAnimationFrame( animate );
        render();       
        update();
    }

    function update()
    {

    }

    function render() 
    {   
        if ( video.readyState === video.HAVE_ENOUGH_DATA ) 
        {
            videoImageContext.drawImage( video, 0, 0 );
            if ( texture ) {
                texture.needsUpdate = true; 
            }
                
        }

        renderer.render( scene, camera );
    }

    // A really lightweight plugin wrapper around the constructor, 
    // preventing against multiple instantiations
    $.fn[pluginName] = function ( options ) {
        return this.each(function () {
            if (!$.data(this, 'plugin_' + pluginName)) {
                $.data(this, 'plugin_' + pluginName, 
                new Plugin( this, options ));
            }
        });
    }

})(jQuery);
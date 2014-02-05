/*!
 * jQuery lightweight plugin boilerplate
 * Original author: @ajpiano
 * Further changes, comments: @addyosmani
 * Licensed under the MIT license
 */

var camera
, texture
, movieScreen
, movieMaterial;
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
      , scene
      , renderer
      , videoImage
      , videoImageContext
      , tempImage
      , controls;

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
            video.loop = "loop";
            video.play();
            animate();
        });

        var w = $(self.element).width();
        var h = $(self.element).height()

        scene = new THREE.Scene();
        camera = new THREE.OrthographicCamera( w / -2, w / 2, h / 2, h / -2 );

        renderer = new THREE.WebGLRenderer();
        renderer.setSize( $(self.element).width(), $(self.element).height() );
        $('body').append(renderer.domElement);

        //controls = new THREE.OrbitControls( camera, renderer.domElement );

        // CURRENT IMAGE
        tempImage = document.createElement( 'canvas' );
        tempImage.width = 1280;
        tempImage.height = 960;

        tempImageContext = tempImage.getContext( '2d' );

        // CURRENT IMAGE
        videoImage = document.createElement( 'canvas' );
        videoImage.width = 1280;
        videoImage.height = 960;

        videoImageContext = videoImage.getContext( '2d' );

        // background color if no video present
        videoImageContext.fillStyle = '#000000';
        videoImageContext.fillRect( 0, 0, videoImage.width, videoImage.height );

        texture = new THREE.Texture( videoImage );
        texture.generateMipmaps = false;
        texture.format = THREE.RGBFormat;



        movieMaterial = new THREE.MeshBasicMaterial( { map: texture, blending: THREE.AdditiveBlending, transparent: true, side: THREE.DoubleSide } );
        movieMaterial.opacity = 1;
        movieMaterial.color.r = 0;
        var movieGeometry = new THREE.PlaneGeometry( w, h, 4, 4 );
        movieScreen = new THREE.Mesh( movieGeometry, movieMaterial );
        movieScreen.position.set(0,0,-1);
        scene.add(movieScreen);
        
        camera.rotation.z = 90 * 0.0174532925;
        //camera.position.set(1,1,1);
        //camera.lookAt(movieScreen.position);

        // PREV IMAGE
        videoPrevImage = document.createElement( 'canvas' );
        videoPrevImage.width = 1280;
        videoPrevImage.height = 960;

        
        videoPrevImageContext = videoPrevImage.getContext( '2d' );
        
        // background color if no video present
        videoPrevImageContext.fillStyle = '#000000';
        videoPrevImageContext.fillRect( 0, 0, videoPrevImage.width, videoPrevImage.height ); 
          
        texturePrev = new THREE.Texture( videoPrevImage );
        texturePrev.generateMipmaps = false;
        texturePrev.format = THREE.RGBFormat;

        prevMaterial = new THREE.MeshBasicMaterial( { map: texturePrev, blending: THREE.AdditiveBlending, transparent: true, side: THREE.DoubleSide } );
        prevMaterial.opacity = 1;
        prevMaterial.color.g = 0;
        prevMaterial.color.b = 0;
        var prevGeometry = new THREE.PlaneGeometry( w, h, 4, 4 );
        prevScreen = new THREE.Mesh( movieGeometry, prevMaterial );
        prevScreen.position.set(0,100,-1);

        scene.add(prevScreen);
        
       

    };

    function animate() 
    {
        requestAnimationFrame( animate );
        render();       
        update();
    }

    function update()
    {
        if(controls) {
         controls.update();  
        }
        
    }

    function render() 
    {   
        if ( video.readyState === video.HAVE_ENOUGH_DATA && videoImageContext) 
        {
            videoImageContext.drawImage( video, 0, 0 );

            if ( texture ) {
                texture.needsUpdate = true;
                texturePrev.needsUpdate = true; 
            }

            videoPrevImageContext.drawImage( tempImage, 0, 0);
            tempImageContext.drawImage(video, 0, 0)
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
/*jshint browser: true, jquery:true, devel: true, undef:true */
/*global  */

var Deck = new Slidedeck();

$(init);

function init() {
    var TICK_PERIOD = 1 * 1000,
        DATA_CHECK_TICKS_INTERVAL = 20, //check for new data interval 
        ticks = 0;

    // DEBUGGING ONLY ================
    var paused = false;
    window.onkeypress = function(evt) {
        //console.debug("k:"+"p".charCodeAt(0),evt.charCode);
        if ("p".charCodeAt(0) === evt.charCode) {
            paused = !paused;
        }
    };
    //===============================
    
    console.log("starting ticker...");
    
    Deck.getPlugins().forEach(function(x) {
        x.init();
    });
    
    // ye olde traditional mainloop
    setInterval(
        function mainLoop() {            
            //console.log("tick"+ticks);    
            if (paused) {
                return;
            }            
            pollPlugins();
            Deck.show(ticks);
            ticks++;
        }, TICK_PERIOD);
        
    function pollPlugins() {
        if ((ticks % DATA_CHECK_TICKS_INTERVAL) === 0) {
            console.debug("check for new data");
            Deck.getPlugins().forEach(function(x) {
                x.poll();
            }); 
        }
    }
}


function Slidedeck() {
    var slides = [],
        // plugins in external JS file will add themselves
        plugins = [],
        slideCounter = 0,
        nextSlideTick = 0;
    
    this.show = function(tick) {
        //console.log("show"+tick); 
        if (tick >= nextSlideTick) {
            slideCounter = (slideCounter < (slides.length - 1)) ? slideCounter+1 : 0;
            showNextSlide();
            nextSlideTick = tick + slides[slideCounter].duration;
            console.debug("dur:"+nextSlideTick);
        }
    };
    
    this.registerPlugin = function(PluginCons) {
        var plugin = new PluginCons();
        if (Slidedeck.validatePlugin(plugin)) {
            plugins.push(plugin);
        } else {
            console.error("Invalid Plugin: "+PluginCons.name);
        }
    };        
    
    this.getPlugins = function(plugin) {
        return plugins;
    };        
    
    /**
     * @param slideSet {String} Name of slideset
     * @param duration {Number} duration in seconds ot display each slide in set
     * @param slideDOMs {Array} of HTML DOM objects, each representing 1 slide
     */
    this.setSlideSet = function(slideSet, duration, slideDOMs) {
        var newSlides = [];
        
        //strip out any existing slides for this slideSet name
        for(var i in slides) {
            if (slides[i].slideSet != slideSet) {
                newSlides.push(slides[i]);
            }
        }
        
        //now add the new slides
        slideDOMs.forEach( function (x) {
            console.debug("add slide:"+x);
            newSlides.push( { "slideSet": slideSet, "duration" : duration, "dom" : x } );        
        });
        slides = newSlides;
    };
        
    function showNextSlide() {
        $(".slide_display").empty().append(slides[slideCounter].dom);
    }
}

/**
 * Valid plugins MUST implement the following Inteface:
 * 
 * function init()
 * function poll() 
 */
Slidedeck.validatePlugin = function(p) {
    return ((typeof p != 'undefined') && Slidedeck.isAFunction(p.init) && Slidedeck.isAFunction(p.poll));
};
    
Slidedeck.isAFunction = function(f) {
    return ((typeof f != 'undefined') && (f instanceof Function)); 
};

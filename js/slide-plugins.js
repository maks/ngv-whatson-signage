/*jshint browser: true, jquery:true, devel: true, undef:true */
/*global Mustache: true, Deck: true */

//slide creation plugins

Deck.registerPlugin(ImagePlugin);
Deck.registerPlugin(WhatsonPlugin);

/**
 * Simple plugin that just uses a list of images as slide content
 */
function ImagePlugin() {
    var domList = [];
    
    this.init = function() {
        console.debug("init Images plugin");
        
        var element = $('<img />', {
          src: 'images/Napoleon03_info.jpg'
        });
        Deck.append(5, element.get(0));
        
        element = $('<img />', {
          src: 'images/Napoleon09_info.jpg'
        });
        Deck.append(5, element.get(0));
        
    };
    
    this.poll = function() {
    };
}


/**
 * Simple plugin that just uses a list of images as slide content
 */
function WhatsonPlugin() {
    var domList = [],
        playList = null,
        dataRequestPending = false;
    
    
    this.init = function() {
        console.debug("init WhatsOn plugin");
        this.poll();
    };
    
    this.poll = function() {
        var DATA_URL = "docs/ngvi-sample.xml";
        if (dataRequestPending) {
            return;
        }
        
        if (playList === null ) {
            dataRequestPending = true;
            console.log("fetching "+DATA_URL);
            $.get(DATA_URL, null, gotXml, 'xml');
        }    
    };

    function gotXml(data) {
        dataRequestPending = false;
        playList = {}; //TODO
            
        console.log('xml data:', data);
        $(data).find("program").each( function() {
            var prog = { 
                title : $(this).find("title").text(),
                time: $(this).find("start_time").text(),
                venue: $(this).find("venue").text()
            };
            console.log('program:'+ prog.title);
            var output = Mustache.render(
                "<li>{{time}} {{title}} <br/> {{venue}}</li>",
                prog);
            $("#program_list").append(output);
        });
        
        $(data).find("tour").each( function() {
            var prog = { 
                title : $(this).find("title").text(),
                time: $(this).find("start_time").text(),
                venue: $(this).find("venue").text()
            };
            console.log('program:'+ prog.title);
            var output = Mustache.render(
                "<li>{{time}} {{title}} <br/> {{venue}}</li>",
                prog);
            $("#tour_list").append(output);
        });
        
    }
}


 
 
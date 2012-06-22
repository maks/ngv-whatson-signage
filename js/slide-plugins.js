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
        var slides = [];

        var element = $('<img />', {
          src: 'images/Napoleon03_info.jpg'
        });
        slides.push(element.get(0));

        element = $('<img />', {
          src: 'images/Napoleon09_info.jpg'
        });
        slides.push(element.get(0));
        Deck.setSlideSet("images", 5, slides);

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
        var DATA_URL = "docs/infoscreens-ngvi-sample.xml";
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
        var slides = [];

        console.log('xml data:', data);
        //~ $(data).find("program").each( function() {
            //~ var prog = {
                //~ title : $(this).find("title").text(),
                //~ time: $(this).find("start_time").text(),
                //~ venue: $(this).find("venue").text()
            //~ };
            //~ console.log('program:'+ prog.title);
            //~ var output = Mustache.render(
                //~ "<li>{{time}} {{title}} <br/> {{venue}}</li>",
                //~ prog);
            //~ $("#program_list").append(output);
        //~ });

        //~ $(data).find("tour").each( function() {
            //~ var prog = {
                //~ title : $(this).find("title").text(),
                //~ time: $(this).find("start_time").text(),
                //~ venue: $(this).find("venue").text()
            //~ };
            //~ console.log('program:'+ prog.title);
            //~ var output = Mustache.render(
                //~ "<li>{{time}} {{title}} <br/> {{venue}}</li>",
                //~ prog);
            //~ $("#tour_list").append(output);
        //~ });

        $(data).find("exhibition").each( function() {
            var exhib = {
                EXHIBITION_TITLE : $(this).find("title").text(),
                EXHIBITION_SUBTITLE : $(this).find("subtitle").text(),
                OPENING_DATE: $(this).find("opening_date").text(),
                CLOSING_DATE: $(this).find("closing_date").text(),
                LEVEL: $(this).find("level").text()
            };

            $(this).find("img").each( function() {
                    console.log('exhib:'+ exhib.EXHIBITION_TITLE+"-"+$(this).attr("src"));

                    exhib.EXHIBITION_IMAGE = $(this).attr("src");

                    var template = $(".exhibition_template").html();
                    var output = Mustache.render(template, exhib);
                    var element = $(output);

                    slides.push(element.get(0));
                    //~ console.debug("EXH template:"+template);
                    console.debug("exi html:"+output);
            });
        });

        Deck.setSlideSet("exhibs", 5, slides);
    }
}




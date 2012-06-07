/*jshint browser: true, jquery:true, devel: true, undef:true */
/*global Mustache: true */


var dataRequestPending = false,
    playList = null;


$(init);

function init() {
    var TICK = 1 * 1000;
    
    console.log("starting ticker...");

    setInterval(mainLoop, TICK);
}

/**
 * ye olde traditional mainloop - in this case called once per TICK.
 */
function mainLoop() {
    //console.log("tick");    
    checkForData();
}


function checkForData() {
    var DATA_URL = "docs/ngvi-sample.xml";
    if (dataRequestPending) {
        return;
    }
    
    if (playList === null ) {
        dataRequestPending = true;
        console.log("fetching "+DATA_URL);
        $.get(DATA_URL, null, gotXml, 'xml');
    }    
}

function gotXml(data) {
    dataRequestPending = false;
    playList = {}; //TODO
        
    console.log('xml data:', data);
    $(data).find("program").each( function() {
        var prog = { 
            title : $(this).find("title").text() 
        };
        console.log('program:'+ prog.title);
        var output = Mustache.render("<li>{{title}}</li>", prog);
        $("#programs").append(output);
    });
    
}
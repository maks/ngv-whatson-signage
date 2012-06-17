/*jshint browser: true, jquery:true, devel: true, undef:true */
/*global Mustache: true */


var dataRequestPending = false,
    playList = null
    deck = new Slidedeck();


$(init);

function init() {
    var TICK = 1 * 1000,
        count = 0;
    
    console.log("starting ticker...");
    
    // ye olde traditional mainloop
    setInterval(
        function mainLoop() {            
            //console.log("tick"+count);    
            checkForData();
            deck.show(count);
            count++;
        }, TICK);
}


function Slidedeck() {
    this.show = function(tick) {
        //console.log("show"+tick); 
    }
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
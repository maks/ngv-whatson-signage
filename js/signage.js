jQuery(init);

function init() {
    console.log("init");

    jQuery.get("../docs/ngvi-sample.xml", null, gotXml, 'xml');
}

function gotXml(data) {
    console.log('xml data:', data);
}
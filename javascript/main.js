/* Settings */

displayAllPath = "http://localhost:8083/display_all";
displayRecentPath = "http://localhost:8083/display_recent";
updatePath = "http://localhost:8083/update";
firstLoad = true

/* Arrays */

imgList = []

/* Init */
$(document).ready(function(){
    
    /* Gets all images in the first run */
    getAllImages();
    
    /* Sets Interval for getting images every 5 seconds */
    setInterval(getNewImages,5000);
    
});

/* Functions */

function getAllImages() {
    
    /* Requests JSON with all images from DataStore makes them into objects */
    
    $.getJSON(displayAllPath, function(data){
        $.each(data, function(index,value){
            imgList[index] = new Image(value.key_name,value.url);
        });  
        
        slideshow = new Slideshow()
    });
    
}

function getNewImages() {
    
    /* Requests JSON with all images from DataStore makes them into objects */
    
    $.getJSON(displayRecentPath, function(data){       
        $.each(data, function(index,value){
                imgList[index] = new Image(value.key_name,value.url);
            
        })
    }); 
}

/* Objects */
function Image(key_name,url) {
    
    /* Image object has a shorturl and URL */
    
    this.key_name = key_name;
    this.url = url;
    
    // Add Image
    $('.slideshow').append('<div id="img_'+key_name+'"><img src='+url+'></div>');
    
    // Toggle Status
    $.get(updatePath, { keyname: key_name }, function(response){
        //console.debug(response)
    });
}

function Slideshow() {
    
    $('.slideshow').cycle({
        fx: 'fade',
        startingSlide: 4, // zero-based 
        before:   onBefore 
    }); 
    
    var slidesAdded = false; 
    
    function onBefore(curr, next, opts) { 

        // make sure we don't call addSlide before it is defined 
        if (!opts.addSlide || slidesAdded) 
            return; 

        // add slides for images 3 - 8 
        // slides can be a DOM element, a jQuery object, or a string 
        for (var i=3; i < 9; i++) 
            opts.addSlide('<img src="images/beach'+i+'.jpg" width="200" height="200" />'); 
        slidesAdded = true; 
    };
}

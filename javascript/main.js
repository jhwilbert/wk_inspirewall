/* Settings */

displayAllPath = "http://localhost:8083/display_all";
displayRecentPath = "http://localhost:8083/display_recent";
updatePath = "http://localhost:8083/update";

/* Arrays */
imgList = []

/* Init */
$(document).ready(function(){
    
    /* Gets all images in the first run */
    getAllImages();
    
    //$(".image").css("left", 200+"px");
    //$(".image").css("top", 300+"px");

    
});

/* Functions */

function getAllImages() {
    
    /* Requests JSON with all images from DataStore makes them into objects */
    
    $.getJSON(displayAllPath, function(data){
        $.each(data, function(index,value){
            imgList[index] = new Image(value.key_name,value.url);         
             $('.slideshow').append(imageObject);
        });  
        
        /* Creates a slideshow instance */
        slideshow = new Slideshow();
    });
    
}

/* Objects */

function Image(key_name,url) {
    
    /* Image object has a shorturl and URL */    
    this.key_name = key_name;
    this.url = url;
    
    // Toggle Status
    $.get(updatePath, { keyname: key_name }, function(response){
        //console.debug(response)
    });
    
    imageObject = '<div id="img_'+key_name+'"><img class="image" src='+url+'></div>';
    
    return imageObject;
}

function Slideshow() {

    /* Starts slideshow on div class based on jquery.cycle plugin */
    
    $('.slideshow').cycle({
        fx: 'fade',
        startingSlide: 0, // zero-based 
        before:   onBefore 
    });

    /* Called before every slide and adds new images to the queue if there are new ones */
    function onBefore(curr, next, opts) {
        
        $.getJSON(displayRecentPath, function(data){
            if(data.empty == true) {
                //console.debug("No New Images")                
            } else {
                $.each(data, function(index,value){    
                    //console.debug("New Image" + value.url);
                    imgList[index] = new Image(value.key_name,value.url);
                    opts.addSlide(imageObject);
                });
            }
        });
    };
}

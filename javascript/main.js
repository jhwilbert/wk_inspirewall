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
             
             $('.slideshow').append(imageObject);
        });  
        
        slideshow = new Slideshow()
    });
    
}

function getNewImages() {
    
    /* Requests JSON with all images from DataStore makes them into objects */
    

}

/* Objects */
function Image(key_name,url) {
    
    /* Image object has a shorturl and URL */
    
    this.key_name = key_name;
    this.url = url;
    
    // Add Image
  
    
    // Toggle Status
    $.get(updatePath, { keyname: key_name }, function(response){
        //console.debug(response)
    });
    
    imageObject = '<div id="img_'+key_name+'"><img src='+url+'></div>';
    
    return imageObject;
}

function Slideshow() {
    
    $('.slideshow').cycle({
        fx: 'fade',
        startingSlide: 4, // zero-based 
        before:   onBefore 
    }); 

    var slidesAdded = false; 

    function onBefore(curr, next, opts) {

        /* Runs Before Every Slide and adds new images to the queue if there are new ones */
        
        // make sure we don't call addSlide before it is defined 
        //if (!opts.addSlide || slidesAdded) 
        //    return; 

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
            //slidesAdded = true; 
        });
    };
}

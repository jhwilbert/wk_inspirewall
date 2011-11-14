/* Arrays */
imgList = []
max_size = 150;

/* Init */
$(document).ready(function(){
    
    /* Gets all images in the first run */
    getAllImages();
    
});

/* Functions */
function getAllImages() {
    
    /* Requests JSON with all images from DataStore makes them into objects */
    $.getJSON(displayAllPath, function(data){
        
        // add elements
        $.each(data, function(index,value){
            imgList[index] = new Image(value.key_name,value.url);         
             $('.admin').append(imageObject);

             // add remove action
             $('#'+value.key_name).click(function() {
                 $(this).parent().remove();
                 $.get(deletePath, { keyname: $(this).attr('id') }, function(response){
                     //console.debug(response)
                 })  
             });
        }); // end of each

        $(".group").css("height", 2*max_size+"px");
        $(".group").css("width", max_size+"px");
    });
}

/* Objects */

function Image(key_name,url) {    
    /* Image object has a shorturl and URL */    
    this.key_name = key_name;
    this.url = url;
    
                 
    imageObject = '<div id="img_'+key_name+'" class="group"><div id="'+key_name+'" class="delete">X</div><img width="'+max_size+'px" class="image" src='+url+'></div>';
        
    return imageObject;
}
    

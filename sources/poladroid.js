/**
 * Poladroid 0.1.1
 */
(function () {
    
    var Poladroid = function (shutter,options,callback) {
        return new Library(shutter,options,callback);
    };
     
    var Library = function (shutter,options,callback) {

        //private variables
        var callback = callback;
        var shutter = shutter;
        var width = options.width;
        var height = options.height;
        var quality = options.quality;
		
        var base64data = null;
		var fileObject = null;
		var input = null;
		
		//private methodes
		var resize = function(orientation){
			
			//orientation can be
			//mainly on iOS device...
			//1 : Normal
			//3 : bottom up
			//6 : rotated to the left
			//8 : rotated to the right
			
			var img = new Image();
			img.onload = function () {
			
				var ratio = img.width / img.height;
				//in case of picture oriented to the left or right we use 1/ratio
				if (orientation == 6 || orientation == "6" || orientation == 8 || orientation == "8")
				ratio = 1/ratio;

			    var oc = document.createElement('canvas'),
			        octx = oc.getContext('2d');

					
				if (ratio >= 1.0){
					oc.width = width;
					if (img.width < width)
					oc.height = height;
					else
					oc.height = Math.round(height / ratio);
				} else {
					if (img.height < height)
					oc.width = width;
					else
					oc.width = Math.round(width * ratio);
					oc.height = height;
				}
				
				if (orientation == 6 || orientation == "6"){
					var bak = oc.width;
					oc.width = oc.height;
					oc.height = bak;
					octx.translate(oc.height * 0.5, oc.width * 0.5);
					octx.rotate(Math.PI/2);
					octx.translate(-oc.height * 0.5, -oc.width * 0.5);
					octx.drawImage(img, 0, 0, oc.height, oc.width);
				}

				else if (orientation == 8 || orientation == "8"){
					var bak = oc.width;
					oc.width = oc.height;
					oc.height = bak;
					octx.translate(oc.height * 0.5, oc.width * 0.5);
					octx.rotate(-Math.PI/2);
					octx.translate(-oc.height * 0.5, -oc.width * 0.5);
					octx.drawImage(img, 0, 0, oc.height, oc.width);
				}			
				
				else if (orientation == 3 || orientation == "3"){
					octx.translate(oc.width * 0.5, oc.height * 0.5);
					octx.rotate(Math.PI);
					octx.translate(-oc.width * 0.5, -oc.height * 0.5);
					octx.drawImage(img, 0, 0, oc.width, oc.height);
				}
				
				else
			    octx.drawImage(img, 0, 0, oc.width, oc.height);
				
				
				base64data = oc.toDataURL("image/jpeg", Math.round(quality * 100) / 10000);
						   
                if (callback != null)
				callback(base64data);
			};
			img.src = base64data;
		};

        //listener on the shutter element
        document.getElementById(shutter).addEventListener("click",function(){
			
			if (input != null)
			{
				input.remove();
				input = null;
			}
        	input = document.createElement("input");
			input.setAttribute("type","file");
			input.addEventListener("change",function(event){
				
				var files = event.target.files;
				if (files && files.length > 0) {
					fileObject = files[0];
				}

				if (fileObject != null){
				
					var fileReader = new FileReader();
					fileReader.onload = function (event) {
                            base64data = event.target.result;
                            
                            //check if the EXIF reader exists
                            if (!window.EXIF)
                            resize(1); 
                            else
                            EXIF.getData(fileObject, function () {
                            	var orientation = 1;
                            	if (this.hasOwnProperty("exifdata"))
                            	if (this["exifdata"].hasOwnProperty("Orientation"))
                            	orientation = this["exifdata"]["Orientation"];
                            	
	    						
	    						resize(orientation);                        
							});
                            
                            

                    };
                    fileReader.readAsDataURL(fileObject);
				}				
				this.remove();
				
			}, true);
			//simulate a click on the shutter element
			input.click();
			
        });
                
        // Return as object
        return this;        
    };
    
    //Library.prototype    
 
     if(!window.Poladroid) {
        window.Poladroid = Poladroid;
    }
    
})();
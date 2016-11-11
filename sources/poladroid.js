/**
 *Poladroid v 0.1 
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
		var resize = function(){

			var img = new Image();
			img.onload = function () {
			
				
				var ratio = img.width / img.height;

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
                            resize();

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
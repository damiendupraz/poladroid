# what is poladroid ?
Poladroid is a very light and crossbrowser library to take and resize pictures on smartphones and tablets.
It weights less than 1KB minified.

# dependencies ?
Poladroid is made of vanilla javascript only so it has no dependency toward Jquery or any other JS library.

# how to use ?

```javascript

Poladroid("shutter",{width:640,height:480,quality:70},function(data){

			//handle the picture data after resize here (base64)
			//see examples folder for details
	
}); 

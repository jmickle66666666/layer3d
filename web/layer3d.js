console.log('layer3d.js');

getLayers("garage.png",117,66, function (layers) {

    drawIt(layers[0],0.1);

});

function drawIt(dataURL,angle){
  var canvas = document.getElementById("canvas-id");
  if(canvas.getContext){
    var ctx= canvas .getContext('2d');
    ctx.rotate(angle);
    var img = new Image;
    img.onload = function(){
      ctx.drawImage(img,0,0);
    };
    img.crossOrigin="Anonymous";
    img.src = dataURL;
    
  }
}



function getLayers(srcPath,width,height,callback) {
    var objImg = new Image();
    var layers = 0;
    var output = [];
    objImg.crossOrigin="Anonymous";
    objImg.onload = function () {
        layers = objImg.height/height;
        for (var i = 0; i < layers; i++) {
            var canvas = document.createElement('canvas');
            canvas.width = width;
            canvas.height = height;
            var context = canvas.getContext('2d');
            context.drawImage(objImg,0,-(height * i),width,height,0,0,canvas.width,canvas.height);
            output.push(canvas.toDataURL());
            callback(output);
        }
    }
    objImg.src = srcPath;
}
console.log('layer3d.js');

getLayers("web/garage.png",117,66, function (layers) {

    drawIt(layers[0],0.1);

});

function drawIt(canvas,dataURL,angle){
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
            context.drawImage(objImg,0,(height * i),width,height,0,0,canvas.width,canvas.height);
            output.push(canvas.toDataURL('image/png'));
        }
        callback(output);
    }
    objImg.src = srcPath;
}

///////////////////////////

rotFrames = [];
angles = 64;
rendered = 0;

for (var i = 0; i < angles; i++) {
    
    var newFrame = document.createElement('canvas');
    newFrame.width = 200;
    newFrame.height = 200;
    rotFrames.push(newFrame);

    renderImage({
        width : 117,
        height : 66,
        spread : 3,
        layers : [0, 1, 1, 1, 2, 3, 3, 2, 3, 3, 2, 4, 4, 5, 6, 6, 6, 7],
        texture : "garage.png"
    }, newFrame, (Math.PI * 2) * (i / angles), function () {
        
        rendered += 1;
        if (rendered == angles) {
            gifshot.createGIF({
                'gifWidth': 200,
                'gifHeight': 200,
                'interval': 1/30,
                'images': rotFrames
            },function(obj) {
                if(!obj.error) {
                    var image = obj.image,
                    animatedImage = document.createElement('img');
                    animatedImage.src = image;
                    document.body.appendChild(animatedImage);
                }
            });
        }

    }    );

}

function renderImage(config, canvasTarget, angle,callback) {
    //load layers of image
    getLayers("garage.png", config.width, config.height, function (layers) {
        
        //draw according to config
        var context = canvasTarget.getContext('2d');
        
        context.rect(0,0,200,200);
        context.fillStyle="white";
        context.fill();
        context.translate((canvasTarget.width - config.width)/2,canvasTarget.height * 0.5);
        
        var i = 0;
        
        function drawLayer(i) {
            if (i >= config.layers.length) return;
            
            var img = new Image;
            img.onload = function(){
                context.translate(0,-config.spread);
                context.translate(config.width/2,config.height/2);
                context.rotate(angle);
                context.translate(-config.width/2,-config.height/2);
                
                context.drawImage(img,0,0);
                
                context.translate(config.width/2,config.height/2);
                context.rotate(-angle);
                context.translate(-config.width/2,-config.height/2);
                if ((i+1) < config.layers.length) {
                    drawLayer(i + 1);
                } else {
                    if (callback != null) callback();
                }
            };
            img.src = layers[config.layers[i]];
        }
        
        
        drawLayer(0);
    });
    
}




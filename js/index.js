(function() {
  var DragDrop, Kaleidoscope, c, dragger, gui, image, kaleidoscope, onChange, onMouseMoved, options, tr, tx, ty, update, _i, _len, _ref,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  Kaleidoscope = (function() {
    Kaleidoscope.prototype.HALF_PI = Math.PI / 2;

    Kaleidoscope.prototype.TWO_PI = Math.PI * 2;

// Kaleidoscope defaults
    function Kaleidoscope(options) {
      var key, val, _ref, _ref1;
      this.options = options != null ? options : {};
      this.defaults = {
        offsetRotation: 0.0,
        offsetScale: 1.0,
        offsetX: 0.0,
        offsetY: 0.0,
        radius: 1000,
        slices: 20,
        zoom:0.5
		
		
      };
      _ref = this.defaults;
      for (key in _ref) {
        val = _ref[key];
        this[key] = val;
      }
      _ref1 = this.options;
      for (key in _ref1) {
        val = _ref1[key];
        this[key] = val;
      }
      if (this.domElement == null) {
        this.domElement = document.createElement('canvas');
		
      }
      if (this.context == null) {
        this.context = this.domElement.getContext('2d');
      }
      if (this.image == null) {
        this.image = document.createElement('img');
      }
    }

    Kaleidoscope.prototype.draw = function() {
      var cx, index, scale, step, _i, _ref, _results;
	  
      this.domElement.width = this.domElement.height = this.radius * 2;
      this.context.fillStyle = this.context.createPattern(this.image, 'repeat');
      scale = this.zoom * (this.radius / Math.min(this.image.width, this.image.height));
      step = this.TWO_PI / this.slices;
	
      cx = this.image.width / 2;
	 
	      _results = [];
    for (index = _i = 0, _ref = this.slices; 0 <= _ref ? _i <= _ref : _i >= _ref; index = 0 <= _ref ? ++_i : --_i) {
        this.context.save();
        this.context.translate(this.radius, this.radius);
        this.context.rotate(index * step);
        this.context.beginPath();
        this.context.moveTo(-0.5, -0.5);
       // this.context.arc(0, 0, this.radius, step * -0.51, step * 0.51);
		 this.context.arc(0, 0, 100000, step * -0.51, step * 0.51);
        this.context.lineTo(0.5, 0.5);
        this.context.closePath();
        this.context.rotate(this.HALF_PI);
        this.context.scale(scale, scale);
        this.context.scale([-1, 1][index % 2], 1);
        this.context.translate(this.offsetX - cx, this.offsetY);
        this.context.rotate(this.offsetRotation);
        this.context.scale(this.offsetScale, this.offsetScale);
        this.context.fill();
        _results.push(this.context.restore());
      }
	  
	  
      return _results;
    };

    return Kaleidoscope;

  })();


// DragDrop Functions
  DragDrop = (function() {
    function DragDrop(callback, context, filter) {
      var disable;
      this.callback = callback;
      this.context = context != null ? context : document;
      this.filter = filter != null ? filter : /^image/i;
      this.onDrop = __bind(this.onDrop, this);
      disable = function(event) {
        event.stopPropagation();
        return event.preventDefault();
      };
      this.context.addEventListener('dragleave', disable);
      this.context.addEventListener('dragenter', disable);
      this.context.addEventListener('dragover', disable);
      this.context.addEventListener('drop', this.onDrop, false);
    }

    DragDrop.prototype.onDrop = function(event) {
      var file, reader;
      event.stopPropagation();
      event.preventDefault();
      file = event.dataTransfer.files[0];
      if (this.filter.test(file.type)) {
        reader = new FileReader;
        reader.onload = (function(_this) {
          return function(event) {
            return typeof _this.callback === "function" ? _this.callback(event.target.result) : void 0;
          };
        })(this);
        return reader.readAsDataURL(file);
      }
    };

    return DragDrop;

  })();

  image = new Image;

  image.onload = (function(_this) {
    return function() {
      return kaleidoscope.draw();
    };
  })(this);
  
// Default Image
  image.src = 'img/sc-bg2.jpg';

  kaleidoscope = new Kaleidoscope({
    image: image,
   slices: 10
    //slices: 4
  });

 //kaleidoscope.domElement.style.width = 100 + '%';
  //kaleidoscope.domElement.style.height = 100 + '%';
  
 var r = window.innerWidth/window.innerHeight;
 kaleidoscope.domElement.style.width = window.innerWidth + 'px';
 kaleidoscope.domElement.style.height = window.innerHeight * r + 'px';
 
  
  kaleidoscope.domElement.style.position = 'fixed';
  
  //kaleidoscope.domElement.style.marginLeft = -8 + 'px';
  //kaleidoscope.domElement.style.marginTop = -8 + 'px';
  kaleidoscope.domElement.style.margin = '0px'
 
	var r = window.innerWidth/window.innerHeight;
		if(r>1){
		 kaleidoscope.domElement.style.width = window.innerWidth + 'px';
		 kaleidoscope.domElement.style.height = window.innerWidth + 'px';
		 kaleidoscope.domElement.style.top =  -1*(window.innerWidth/2-window.innerHeight/2)+'px';
		 kaleidoscope.domElement.style.left = 0 + 'px';
		}else{
			kaleidoscope.domElement.style.height = window.innerHeight + 'px';
		 	kaleidoscope.domElement.style.width = window.innerHeight + 'px';
			kaleidoscope.domElement.style.top =  -1*(window.innerHeight/2 - window.innerHeight/2 )+'px';
			kaleidoscope.domElement.style.left =  -1*(window.innerHeight/2 - window.innerWidth/2) + 'px';
		}
  document.body.appendChild(kaleidoscope.domElement);

  dragger = new DragDrop(function(data) {
    return kaleidoscope.image.src = data;
  });

  tx = kaleidoscope.offsetX;

  ty = kaleidoscope.offsetY;

  tr = kaleidoscope.offsetRotation;

  onMouseMoved = (function(_this) {
    return function(event) {
      var cx, cy, dx, dy, hx, hy;
      cx = window.innerWidth / 2;
      cy = window.innerHeight / 2;
	   dx = event.pageX / window.innerWidth;
      dy = event.pageY / window.innerHeight;
      hx = dx - 0.5;
      hy = dy - 0.5;
      tx = hx * kaleidoscope.radius * -2;
      ty = hy * kaleidoscope.radius * 2;
      return tr = Math.atan2(hy, hx);
    };
  })(this);

  window.addEventListener('mousemove', onMouseMoved, false);

  options = {
    interactive: true,
    ease: .08
  };

  (update = (function(_this) {
    return function() {
      var delta, theta;
      if (options.interactive) {
        delta = tr - kaleidoscope.offsetRotation;
        theta = Math.atan2(Math.sin(delta), Math.cos(delta));
        kaleidoscope.offsetX += (tx - kaleidoscope.offsetX) * options.ease;
        kaleidoscope.offsetY += (ty - kaleidoscope.offsetY) * options.ease;
        kaleidoscope.offsetRotation += (theta - kaleidoscope.offsetRotation) * options.ease;
        kaleidoscope.draw();
      }
      return setTimeout(update, 1000 / 60);
    };
  })(this))();
	
	function onResize(){
		var r = window.innerWidth/window.innerHeight;
		if(r>1){
		 kaleidoscope.domElement.style.width = window.innerWidth + 'px';
		 kaleidoscope.domElement.style.height = window.innerWidth + 'px';
		 kaleidoscope.domElement.style.top =  -1*(window.innerWidth/2-window.innerHeight/2)+'px';
		 kaleidoscope.domElement.style.left = 0 + 'px';
		}else{
			kaleidoscope.domElement.style.height = window.innerHeight + 'px';
		 	kaleidoscope.domElement.style.width = window.innerHeight + 'px';
			kaleidoscope.domElement.style.top =  -1*(window.innerHeight/2 - window.innerHeight/2 )+'px';
			kaleidoscope.domElement.style.left =  -1*(window.innerHeight/2 - window.innerWidth/2) + 'px';
		}
	}
	 window.addEventListener('resize',onResize, false);

// GUI Controllers
  // gui = new dat.GUI;

  // gui.add(kaleidoscope, 'zoom').min(0.25).max(2.0);

  // gui.add(kaleidoscope, 'slices').min(10).max(10).step(2);

  // gui.add(kaleidoscope, 'radius').min(200).max(500);

  // gui.add(kaleidoscope, 'offsetX').min(-kaleidoscope.radius).max(kaleidoscope.radius).listen();

  // gui.add(kaleidoscope, 'offsetY').min(-kaleidoscope.radius).max(kaleidoscope.radius).listen();

  // gui.add(kaleidoscope, 'offsetRotation').min(-Math.PI).max(Math.PI).listen();

  // gui.add(kaleidoscope, 'offsetScale').min(0.5).max(4.0);

  // gui.add(options, 'interactive').listen();

  // gui.close();
  
  
  
  
  
  

  // onChange = (function(_this) {
  //   return function() {
  //     kaleidoscope.domElement.style.marginLeft = -kaleidoscope.radius + 'px';
  //     kaleidoscope.domElement.style.marginTop = -kaleidoscope.radius + 'px';
  //     options.interactive = false;
  //     return kaleidoscope.draw();
  //   };
  // })(this);
  
  
  
  
  
  
  
  
  

  // _ref = gui.__controllers;
  // for (_i = 0, _len = _ref.length; _i < _len; _i++) {
  //   c = _ref[_i];
  //   if (c.property !== 'interactive') {
  //     c.onChange(onChange);
  //   }
  // }

}).call(this);

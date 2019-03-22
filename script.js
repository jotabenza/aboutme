var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
* MELTING PICS CLASS
**/
var MeltingPics = function () {
  function MeltingPics(canvas, images, displacement) {
    _classCallCheck(this, MeltingPics);

    this.canvas = canvas;
    this.imagesList = images;
    this.displacementImage = displacement;
    this.resizeCanvas = this.resizeCanvas.bind(this);
    window.addEventListener('resize', this.resizeCanvas);

    this.createPixi();
    this.resizeCanvas();
    this.createImages();
    this.resizeImages();
    this.repositeContainers();
    // this.app.stop();
    this.app.render();
    TweenMax.fromTo(this.canvas, 1, { opacity: 0 }, { opacity: 1, delay: 0.8, onComplete: this.app.start, onCompleteScope: this.app });

    this.dispText = PIXI.Texture.from(this.displacementImage);
    this.dispSprite = new PIXI.Sprite();
    this.dispSprite.texture = this.dispText;

    this.dispFilter = new PIXI.filters.DisplacementFilter(this.dispSprite);
    this.dispFilter.autoFit = true;
    this.dispFilter.scale.x = this.dispFilter.scale.y = 0;
    this.dispSprite.texture.baseTexture.wrapMode = PIXI.WRAP_MODES.REPEAT;
    this.container.filters = [this.dispFilter];
    window.releases = this;
    window.filter = this.dispFilter;
    this.direction = null;
    this.lastCoef = null;
  }

  _createClass(MeltingPics, [{
    key: "updateScrollPosition",
    value: function updateScrollPosition(coef, animated) {
      var finy = -coef * this.HEIGHT * (this.images.length - 1);
      var dif = Math.abs(finy - this.container.position.y);
      TweenMax.killTweensOf(this.dispFilter.scale);

      if (animated) {
        this.dispFilter.scale.y = dif * 4 * (this.WIDTH / this.HEIGHT / 3);
        this.dispFilter.scale.x = -dif / 20;
        TweenMax.to(this.container.position, 1, { y: finy, ease: Expo.easeOut });
        TweenMax.to(this.dispFilter.scale, 1.2, { y: 0, x: 0, ease: Expo.easeOut });
      } else {
        this.dispFilter.scale.y = 0;
        this.dispFilter.scale.x = 0;
        TweenMax.set(this.container.position, { y: finy, ease: Back.easeOut });
      }
    }
  }, {
    key: "createPixi",
    value: function createPixi() {
      var options = {};
      PIXI.utils.skipHello();
      options.width = this.WIDTH;
      options.height = this.HEIGHT;
      options.view = this.canvas;
      options.transparent = false;
      options.antialias = true;
      options.resolution = window.devicePixelRatio;
      options.backgroundColor = 0xf1f1f1;
      options.forceFXAA = true;
      this.app = new PIXI.Application(options);
      this.app.renderer.autoResize = false;
    }
  }, {
    key: "createImages",
    value: function createImages() {
      this.images = [];
      this.container = new PIXI.Container();
      this.app.stage.addChild(this.container);
      var num = 0;

      for (var s in this.imagesList) {
        var data = this.imagesList[s];
        var texture = PIXI.Texture.from(data);
        var image = new PIXI.Sprite();
        image.texture = texture;

        var imageContainer = new PIXI.Container();
        imageContainer.addChild(image);

        this.container.addChild(imageContainer);
        image.iniWidth = image.width;
        image.iniHeight = image.height;
        image.iniScale = image.iniWidth / image.iniHeight;
        this.images.push(imageContainer);
      }
      window.app = this.app;
    }
  }, {
    key: "resizeImages",
    value: function resizeImages() {
      var num = 0;
      console.log("resize images");
      for (var i = 0; i < this.images.length; i++) {
        var image = this.images[i].children[0];

        if (image.iniScale < this.ASPECT) {
          image.width = this.WIDTH;
          image.height = image.width * (1 / image.iniScale);
        } else {
          image.height = this.HEIGHT;
          image.width = image.iniScale * image.height;
        }

        image.position.x = this.WIDTH / 2 - image.width / 2;
        image.position.y = this.HEIGHT / 2 - image.height / 2;

        num++;
      }
    }
  }, {
    key: "repositeContainers",
    value: function repositeContainers() {
      for (var i = 0; i < this.images.length; i++) {
        this.images[i].position.y = this.HEIGHT * i;
      }
    }
  }, {
    key: "resizeCanvas",
    value: function resizeCanvas() {
      this.WIDTH = window.innerWidth;
      this.HEIGHT = window.innerHeight;
      this.ASPECT = this.WIDTH / this.HEIGHT;
      this.app.renderer.resize(this.WIDTH, this.HEIGHT);
      //
      // this.app.renderer.width = this.WIDTH;
      // this.app.renderer.height = this.HEIGHT;
      if (!this.images) return;

      this.repositeContainers();
      this.resizeImages();
    }
  }, {
    key: "destroy",
    value: function destroy() {
      window.removeEventListener("resize", this.resizeCanvas);
      this.app.destroy(true);
      this.app = null;
    }
  }]);

  return MeltingPics;
}();

/**
* END MELTING PICS
**/

var images = [];
var displacementImg;

var queue = new createjs.LoadQueue(true);
queue.loadFile({ src: 'https://recreatorus.ru/img/distortion/displacement/displacement.jpg', id: 'displacement', type: createjs.AbstractLoader.IMAGE });

queue.loadFile({ src: 'https://recreatorus.ru/img/slideshow/slideshow-1.jpg', id: 'image', type: createjs.AbstractLoader.IMAGE }, false);
queue.loadFile({ src: 'https://recreatorus.ru/img/slideshow/slideshow-2.jpg', id: 'image', type: createjs.AbstractLoader.IMAGE }, false);
queue.loadFile({ src: 'https://recreatorus.ru/img/slideshow/slideshow-3.jpg', id: 'image', type: createjs.AbstractLoader.IMAGE }, false);
queue.loadFile({ src: 'https://recreatorus.ru/img/slideshow/slideshow-4.jpg', id: 'image', type: createjs.AbstractLoader.IMAGE }, false);
queue.loadFile({ src: 'https://recreatorus.ru/img/slideshow/slideshow-5.jpg', id: 'image', type: createjs.AbstractLoader.IMAGE }, false);

queue.on('fileload', function (evt) {
  if (evt.item.id == 'displacement') {
    displacementImg = evt.result;
  } else {
    images.push(evt.result);
  }
});

queue.on('complete', function (evt) {
  var pics = new MeltingPics(document.getElementsByTagName('canvas')[0], images, displacementImg);

  document.getElementById('fakescroll').style.height = (images.length * 100).toString() + "%";

  window.addEventListener('scroll', function (evt) {
    pics.updateScrollPosition(window.scrollY / (window.innerHeight * images.length - window.innerHeight), true);
  });

  document.getElementById("scrolldown").style.display = "block";
  TweenMax.from(document.getElementById("scrolldown"), 1, { opacity: 0 });
});

queue.load();

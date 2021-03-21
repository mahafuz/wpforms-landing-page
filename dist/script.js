"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var extractVideoID = function extractVideoID(e) {
  var t = e.match(/^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#\&\?]*).*/);
  return !(!t || 11 != t[7].length) && t[7];
},
    injectScript = function injectScript(_ref) {
  var e = _ref.id,
      t = _ref.src;
  if (document.querySelector("#".concat(e))) return;
  var i = document.createElement("script");
  i.src = t, i.id = e;
  var n = document.getElementsByTagName("script")[0];
  n.parentNode.insertBefore(i, n);
};

var VideoPlayerYoutube = /*#__PURE__*/function () {
  function VideoPlayerYoutube(e) {
    _classCallCheck(this, VideoPlayerYoutube);

    return this.isScriptInjected = !1, this.isScriptLoaded = !1, this.config = e, this.events = {
      onEnd: []
    }, {
      addEventListener: this.addEventListener.bind(this),
      init: this.init.bind(this),
      play: this.play.bind(this)
    };
  }

  _createClass(VideoPlayerYoutube, [{
    key: "addEventListener",
    value: function addEventListener(e, t) {
      this.events[e] ? this.events[e].push(t) : this.events[e] = [t];
    }
  }, {
    key: "injectIframe",
    value: function injectIframe() {
      this.player = new YT.Player(this.config.root, {
        height: "390",
        width: "640",
        videoId: extractVideoID(this.config.url),
        playerVars: {
          showinfo: 0,
          modestbranding: 1,
          playsinline: 1,
          rel: 0
        },
        enablejsapi: 1,
        events: {
          onStateChange: this.onPlayerStateChange.bind(this)
        }
      });
    }
  }, {
    key: "onPlayerStateChange",
    value: function onPlayerStateChange(e) {
      0 === e.data && this.events.onEnd.forEach(function (e) {
        e();
      });
    }
  }, {
    key: "init",
    value: function init() {
      var _this = this;

      if (this.isScriptInjected) return;
      injectScript({
        id: "video-player-iframe-youtube",
        src: "https://www.youtube.com/iframe_api"
      }), this.isScriptInjected = !0;
      var e = window.setInterval(function () {
        window.YT && window.YT.Player && (_this.isScriptLoaded = !1, clearInterval(e), _this.injectIframe());
      }, 100);
    }
  }, {
    key: "play",
    value: function play() {
      return !!this.player.playVideo && (this.player.playVideo(), !0);
    }
  }]);

  return VideoPlayerYoutube;
}();

var VideoPlayer = /*#__PURE__*/function () {
  function VideoPlayer(e, t) {
    _classCallCheck(this, VideoPlayer);

    this.element = e, this.previewContainer = e.querySelector('[data-js="preview"]'), this.videoContainer = e.querySelector('[data-js="video"]');
    var i = e.querySelector('[data-js="video-root"]'),
        n = e.getAttribute("data-player-type"),
        r = e.getAttribute("data-player-url");
    "youtube" === n ? (this.Player = new VideoPlayerYoutube({
      root: i,
      url: r
    }), this.Player.init(), this.Player.addEventListener("onEnd", this.reset.bind(this)), this.addEventlisteners()) : console.error("Invalid video type. Things aren't going to work.");
  }

  _createClass(VideoPlayer, [{
    key: "show",
    value: function show(e) {
      e.setAttribute("data-hidden", "false");
    }
  }, {
    key: "hide",
    value: function hide(e) {
      e.setAttribute("data-hidden", "true");
    }
  }, {
    key: "play",
    value: function play() {
      this.Player.play() ? (this.hide(this.previewContainer), this.show(this.videoContainer)) : this.handleNotReady();
    }
  }, {
    key: "reset",
    value: function reset() {
      this.show(this.previewContainer), this.hide(this.videoContainer);
    }
  }, {
    key: "handleNotReady",
    value: function handleNotReady() {
      console.log("Video isn't ready yet to be viewed. Try again in a few seconds.");
    }
  }, {
    key: "addEventlisteners",
    value: function addEventlisteners() {
      this.previewContainer.addEventListener("click", this.play.bind(this));
    }
  }]);

  return VideoPlayer;
}();

var player = document.querySelector(".video-player");
new VideoPlayer(player);
//# sourceMappingURL=script.js.map
'use strict';
var File = require('./sound-common').File;
var timer = require('timer');

var Sound = (function(_super) {
    __extends(Song, _super);

    function Song() {
        _super.apply(this, arguments);
        this._url = NSURL.fileURLWithPath( this._path );
        this._player = new AVAudioPlayer();
        this._player.initWithContentsOfURLError( this._url );
        this._player.prepareToPlay();
    }
    Song.prototype.getTimeLeft = ()=>{return this._player.duration - this._player.currentTime;};
    Song.prototype.getTime = ()=>{return this._player.currentTime;};
    Song.prototype.getDur = ()=>{return this._player.duration;};
    Song.prototype.getVol = ()=>{return this._player.volume;};

    Song.prototype.play = ()=>{
        this._player.play();
        this._player.volume = 1.0;
    };
    Song.prototype.stop = ()=>{
        this._player.stop();
        this._player.prepareToPlay();
        this._player.currentTime = 0;
        this._player.volume = 1.0;
    };

    Song.prototype.skipTo = (time)=>{
        this._player.currentTime = time;
    };

    Song.prototype.fadeout = (inc)=>{
        var that = this;
        this.run = ()=>{
            if (that._player.volume >= 0.001){
                that._player.volume = that._player.volume - inc;
                timer.setTimeout(that.run, 10);
            }else{
                that.stop();
            }
        };
        this.run();
    };

    Song.prototype.fadeinAt = (start)=>{
        var that = this;
        this._player.play();
        this._player.currentTime = start;
        this._player.volume = 0.0;
        this.run = ()=>{
            if (that._player.volume < 1.0){
                that._player.volume = that._player.volume + 0.001;
                timer.setTimeout(that.run, 10);
            }
        };
        this.run();
    };

    return Song;

})(File);

exports.Sound = Sound;

exports.create = (path)=>{
    return new Sound(path);
};

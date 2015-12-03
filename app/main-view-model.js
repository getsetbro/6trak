'use strict';
var observable = require('data/observable');
var timer = require('timer');
//var dialogsModule = require('ui/dialogs');
//var sound = require('nativescript-sound');
var sound = require('./sound-ios');
var pad = require('./padsList').padsList;
var DriveSufx = '_Drive';
var Curr = '';

var Padkey = (function (_super) {
    __extends(Padme, _super);

    function Padme(){
        _super.call(this);
        this.set('sVIdx', '');
        this.set('plybtn', '');
        this.set('drvbtn', '');

        this.set('info', '');
        this.set('info2', '');
    }
    var timeoutVar;
    var quitLooper = ()=>{
        timer.clearTimeout(timeoutVar);
        Curr = '';
    };

    //fadeout(0.002) 05 second fade out
    //fadeout(0.001) 10 second fade out

    Padme.prototype.Start = (args)=>{
        // dialogsModule.alert({message: args.object.song,okButtonText: 'OK'});

        var song = args.view.song;
        pad[song].play();//start song
        if(Curr){
            pad[Curr].fadeout(0.002);//fade what was playing
            quitLooper();//clear its timer
        }
        Curr = song;
        this.Loop();
        this.set('plybtn', 'on');//play btn color
        this.set('sVIdx', args.view.tag);//pad btn color
        this.set('drvbtn', '');//drive btn color
    };

    Padme.prototype.Stop = ()=>{
        if(Curr){
            pad[Curr].fadeout(0.002);
        }
        this.set('sVIdx', '');//pad btn color
        this.set('plybtn', '');
        this.set('drvbtn', '');
        quitLooper();
    };

    Padme.prototype.Drive = ()=>{
        if(!Curr){return false;}
        var toPlay = Curr;
        var drvbtnClass = '';
        if( Curr.indexOf(DriveSufx) >= 0 ){//if curr is Drive
            //turn off drive
            toPlay = Curr.split(DriveSufx)[0];//get nonDrive
        }else{
            //turn on drive
            toPlay = Curr.split('Dupe')[0] + DriveSufx;//get drive pad
            drvbtnClass ='on';
        }
        pad[toPlay].play();
        pad[Curr].fadeout(0.002);//fade stop Curr
        Curr = toPlay;
        this.set('drvbtn', drvbtnClass);
        this.set('info2', Curr);
    };

    Padme.prototype.skipToEnd = ()=>{
        if(!Curr){return false;}
        pad[Curr].skipTo( pad[Curr].getDur() - 25 );
    };
    Padme.prototype.Loop = ()=>{
        var that = this;
        that.set('info2', Curr);
        that.run = ()=>{
            //dialogsModule.alert({message: Curr,okButtonText: 'OK'});
            if(!Curr){return false;}

            that.tl =  pad[Curr].getTimeLeft();
            that.set('info', parseInt(that.tl) );

            if (that.tl < 20){//check if under 20
                pad[Curr].fadeout(0.001);
                
                if( Curr.indexOf('Dupe') >= 0 ){//if playing dupe

                    Curr = Curr.split('Dupe')[0];
                    //play non dupe
                    pad[Curr].play();

                }else{//if not playing dupe
                    var track = Curr.split('_').join(' ');
                    if(!pad[Curr+'Dupe']){//create dupe if needed
                        pad[Curr+'Dupe'] = sound.create('~/tracks/'+track+'.mp3');
                    }
                    pad[Curr+'Dupe'].play();//play dupe
                    Curr = Curr+'Dupe';
                }
                that.set('info2', Curr);
                that.Loop();
            }else{
                timeoutVar = timer.setTimeout(that.run, 5000);//every 5 seconds
            }
        };
        that.run();
    };

    return Padme;

})(observable.Observable);

exports.Padkey = Padkey;
exports.mainViewModel = new Padkey();

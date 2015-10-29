'use strict';
var observable = require("data/observable");
var sound = require("nativescript-sound");

var timer = require("timer");
//=var dialogsModule = require("ui/dialogs");

var Curr = '';
var paused = false;
var pad = {
    "Ab_Major":       sound.create( "~/tracks/Ab Major.mp3" ),
    "Ab_Major_Drive": sound.create( "~/tracks/Ab Major Drive.mp3" ),
    "Ab_Minor":       sound.create( "~/tracks/Ab Minor.mp3" ),
    "Ab_Minor_Drive": sound.create( "~/tracks/Ab Minor Drive.mp3" ),
    "A_Major":        sound.create( "~/tracks/A Major.mp3" ),
    "A_Major_Drive":  sound.create( "~/tracks/A Major Drive.mp3" ),
    "A_Minor":        sound.create( "~/tracks/A Minor.mp3" ),
    "A_Minor_Drive":  sound.create( "~/tracks/A Minor Drive.mp3" ),
    "Bb_Major":       sound.create( "~/tracks/Bb Major.mp3" ),
    "Bb_Major_Drive": sound.create( "~/tracks/Bb Major Drive.mp3" ),
    "Bb_Minor":       sound.create( "~/tracks/Bb Minor.mp3" ),
    "Bb_Minor_Drive": sound.create( "~/tracks/Bb Minor Drive.mp3" ),
    "B_Major":        sound.create( "~/tracks/B Major.mp3" ),
    "B_Major_Drive":  sound.create( "~/tracks/B Major Drive.mp3" ),
    "B_Minor":        sound.create( "~/tracks/B Minor.mp3" ),
    "B_Minor_Drive":  sound.create( "~/tracks/B Minor Drive.mp3" ),
    "C_Major":        sound.create( "~/tracks/C Major.mp3" ),
    "C_Major_Drive":  sound.create( "~/tracks/C Major Drive.mp3" ),
    "C_Minor":        sound.create( "~/tracks/C Minor.mp3" ),
    "C_Minor_Drive":  sound.create( "~/tracks/C Minor Drive.mp3" ),
    "Db_Major":       sound.create( "~/tracks/Db Major.mp3" ),
    "Db_Major_Drive": sound.create( "~/tracks/Db Major Drive.mp3" ),
    "Db_Minor":       sound.create( "~/tracks/Db Minor.mp3" ),
    "Db_Minor_Drive": sound.create( "~/tracks/Db Minor Drive.mp3" ),
    "D_Major":        sound.create( "~/tracks/D Major.mp3" ),
    "D_Major_Drive":  sound.create( "~/tracks/D Major Drive.mp3" ),
    "D_Minor":        sound.create( "~/tracks/D Minor.mp3" ),
    "D_Minor_Drive":  sound.create( "~/tracks/D Minor Drive.mp3" ),
    "Eb_Major":       sound.create( "~/tracks/Eb Major.mp3" ),
    "Eb_Major_Drive": sound.create( "~/tracks/Eb Major Drive.mp3" ),
    "Eb_Minor":       sound.create( "~/tracks/Eb Minor.mp3" ),
    "Eb_Minor_Drive": sound.create( "~/tracks/Eb Minor Drive.mp3" ),
    "E_Major":        sound.create( "~/tracks/E Major.mp3" ),
    "E_Major_Drive":  sound.create( "~/tracks/E Major Drive.mp3" ),
    "E_Minor":        sound.create( "~/tracks/E Minor.mp3" ),
    "E_Minor_Drive":  sound.create( "~/tracks/E Minor Drive.mp3" ),
    "F_Major":        sound.create( "~/tracks/F Major.mp3" ),
    "F_Major_Drive":  sound.create( "~/tracks/F Major Drive.mp3" ),
    "F_Minor":        sound.create( "~/tracks/F Minor.mp3" ),
    "F_Minor_Drive":  sound.create( "~/tracks/F Minor Drive.mp3" ),
    "Gb_Major":       sound.create( "~/tracks/Gb Major.mp3" ),
    "Gb_Major_Drive": sound.create( "~/tracks/Gb Major Drive.mp3" ),
    "Gb_Minor":       sound.create( "~/tracks/Gb Minor.mp3" ),
    "Gb_Minor_Drive": sound.create( "~/tracks/Gb Minor Drive.mp3" ),
    "G_Major":        sound.create( "~/tracks/G Major.mp3" ),
    "G_Major_Drive":  sound.create( "~/tracks/G Major Drive.mp3" ),
    "G_Minor":        sound.create( "~/tracks/G Minor.mp3" ),
    "G_Minor_Drive":  sound.create( "~/tracks/G Minor Drive.mp3 ")
};
var Padkey = (function (_super) {
    __extends(Padme, _super);
    function Padme() {
        _super.call(this);
        this.set("sVIdx", "");
        this.set("plybtn", "");
        this.set("drvbtn", "");
        //this.set("info", "");
        //this.set("info2", "");
    }

    Padme.prototype.Start = function (args) {
        // dialogsModule.alert({message: args.object.song,okButtonText: "OK"});

        this.set("sVIdx", args.view.tag);
        this.set("plybtn", "on");
        this.set("drvbtn", "");
        var song = args.view.song;
        this.Reset();//stop Curr
        pad[song].play();
        Curr = song;
        this.Loop();
        paused = false;

    };

    Padme.prototype.Stop = function () {
        if(Curr !== ''){
            if(!paused){
                pad[Curr].stop();
                paused = true;
                this.set("plybtn", "pbpaused");
            }else{
                pad[Curr].play();                
                paused = false;
                this.set("plybtn", "on");
            }
        }
    };
    Padme.prototype.Reset = function () {
        if(Curr !== ''){
            pad[Curr].reset();
            Curr = '';
            paused = false;
        }
    };
    Padme.prototype.Drive = function () {
        if(Curr !== ''){
            if( Curr.indexOf("_Drive") < 0 ){
                var currTime = pad[Curr].getTime();
                var driver = Curr.split('dup')[0] + "_Drive";
                pad[driver].fadeinAt(currTime);
                pad[Curr].fadeout();//fade stop Curr
                Curr = driver;
                paused = false;
                this.set("plybtn", "on");
                this.set("drvbtn", "on");

            }else if( Curr.indexOf("_Drive") >= 0 ){
                var currTime2 = pad[Curr].getTime();
                var CurrNonDrive = Curr.split("_Drive")[0];
                pad[CurrNonDrive].fadeinAt(currTime2);
                pad[Curr].fadeout();//fade stop "CurrNonDrive"
                Curr = CurrNonDrive;
                paused = false;
                this.set("plybtn", "on");
                this.set("drvbtn", "");
            }
            //this.set("info2", Curr);
        }
    };

    Padme.prototype.skipToEnd = function () {
        if(Curr !== ''){
            pad[Curr].skipTo( pad[Curr].getDur() - 25 );
        }
    };

    Padme.prototype.Loop = function () {
        var that = this;
        if(Curr !== ''){
            //that.set("info2", Curr);
            that.run = function () {
                that.tl =  pad[Curr].getTimeLeft();
                //that.set("info", parseInt(that.tl) );

                if (that.tl < 20){
                    pad[Curr].fadeout();
                    if( Curr.indexOf('dup') >= 0 ){
                        Curr = Curr.split('dup')[0];
                        pad[Curr].fadeinAt("15");
                    }else{
                        var track = Curr.split('_').join(' ');
                        if(!pad[Curr+"dup"]){
                            pad[Curr+"dup"] = sound.create("~/tracks/"+track+".mp3");
                        }
                        pad[Curr+"dup"].fadeinAt("15");
                        Curr = Curr+"dup";
                    }
                    //that.set("info2", Curr);
                    that.Loop();
                }else{
                    var self = that;
                    timer.setTimeout(self.run, 5000);
                }
            };
            that.run();
        }
    };
    // Padme.prototype.vol = function (args) {
    //     if(Curr !== ''){
    //         this.set("info", pad[Curr].getVol() );
    //     }
    // };
    // Padme.prototype.Fadeout = function () {
    //     if(Curr !== ''){
    //         this.set("info", pad[Curr].getTime() );
    //         var trim = Curr.split('dup')[0];
    //         var track = trim.split('_').join(' ');
    //         pad[Curr].fadeout();
    //         pad[Curr+"dup"] = sound.create("~/tracks/"+track+".mp3");
    //         pad[Curr+"dup"].fadeinAt("5");
    //         Curr = Curr+"dup";
    //         // Curr = Curr+"i";

    //     }
    // };

    return Padme;
})(observable.Observable);
exports.Padkey = Padkey;
exports.mainViewModel = new Padkey();

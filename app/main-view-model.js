'use strict';
var observable = require("data/observable");
var sound = require("nativescript-sound");

var timer = require("timer");
//var dialogsModule = require("ui/dialogs");

var Curr = '';
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

        this.set("info", "");
        this.set("info2", "");
    }
    var timeoutVar;
    function quitLooper () {
        timer.clearTimeout(timeoutVar);
        Curr = '';
    }
    Padme.prototype.Start = function (args) {
        // dialogsModule.alert({message: args.object.song,okButtonText: "OK"});

        var song = args.view.song;
        pad[song].play();//start song
        if(Curr !== ''){
            pad[Curr].fastout();//fade what was playing
            quitLooper();//clear its timer
        }
        Curr = song;
        this.Loop();
        this.set("plybtn", "on");//play btn color
        this.set("sVIdx", args.view.tag);//pad btn color
        this.set("drvbtn", "");//drive btn color
    };

    Padme.prototype.Stop = function () {
        if(Curr !== ''){
            pad[Curr].fastout();
        }
        this.set("sVIdx", "");//pad btn color
        this.set("plybtn", "");
        this.set("drvbtn", "");
        quitLooper();
    };

    Padme.prototype.Drive = function () {
        if(Curr !== ''){
            if( Curr.indexOf("_Drive") >= 0 ){//if curr is Drive
                //turn off drive
                var CurrNonDrive = Curr.split("_Drive")[0];//get nonDrive
                pad[CurrNonDrive].play();
                pad[Curr].fastout();//fade stop Curr
                Curr = CurrNonDrive;
                this.set("drvbtn", "");
            }else{
                //turn on drive
                var Drive = Curr.split("Dupe")[0] + "_Drive";//get drive pad
                pad[Drive].play();
                pad[Curr].fastout();//fade stop Curr
                Curr = Drive;
                this.set("drvbtn", "on");
            }
            this.set("info2", Curr);
        }
    };

    Padme.prototype.skipToEnd = function () {
        if(Curr !== ''){
            pad[Curr].skipTo( pad[Curr].getDur() - 25 );
        }
    };
    Padme.prototype.Loop = function () {
        var that = this;
        that.set("info2", Curr);
        that.run = function () {
            //dialogsModule.alert({message: Curr,okButtonText: "OK"});
            if(Curr !== ''){

                that.tl =  pad[Curr].getTimeLeft();
                that.set("info", parseInt(that.tl) );

                if (that.tl < 20){
                    pad[Curr].fadeout();
                    if( Curr.indexOf("Dupe") >= 0 ){//if playing dupe
                        Curr = Curr.split("Dupe")[0];
                        //play non dupe
                        pad[Curr].play();
                    }else{//if not playing dupe
                        var track = Curr.split('_').join(' ');
                        if(!pad[Curr+"Dupe"]){//create dupe if needed
                            pad[Curr+"Dupe"] = sound.create("~/tracks/"+track+".mp3");
                        }
                        pad[Curr+"Dupe"].play();//play dupe
                        Curr = Curr+"Dupe";
                    }
                    that.set("info2", Curr);
                    that.Loop();
                }else{
                    timeoutVar = timer.setTimeout(that.run, 5000);
                }
            }
        };
        that.run();
    };

    // Padme.prototype.vol = function (args) {
    //     if(Curr !== ''){
    //         this.set("info", pad[Curr].getVol() );
    //     }
    // };
    // Padme.prototype.Fadeout = function () {
    //     if(Curr !== ''){
    //         this.set("info", pad[Curr].getTime() );
    //         var trim = Curr.split("Dupe")[0];
    //         var track = trim.split('_').join(' ');
    //         pad[Curr].fadeout();
    //         pad[Curr+"Dupe"] = sound.create("~/tracks/"+track+".mp3");
    //         pad[Curr+"Dupe"].fadeinAt("5");
    //         Curr = Curr+"Dupe";
    //         // Curr = Curr+"i";

    //     }
    // };

    return Padme;
})(observable.Observable);
exports.Padkey = Padkey;
exports.mainViewModel = new Padkey();

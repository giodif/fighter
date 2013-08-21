ig.module( 
    'injections.animationstopped' 
)
.requires(
    'impact.animation'
)
.defines( function(){

    ig.Animation.inject({

        stopped : false,
    
        update : function() {

            var frameTotal = Math.floor( this.timer.delta() / this.frameTime );
            this.loopCount = Math.floor( frameTotal / this.sequence.length );
            
            if( this.stop && this.loopCount > 0 ){
                this.frame = this.sequence.length - 1;
                this.stopped = true;
            }
            else {
                this.frame = frameTotal % this.sequence.length;
            }
            this.tile = this.sequence[ this.frame ];
        },

        rewind : function() {

            this.timer.set();
            this.loopCount  = 0;
            this.tile       = this.sequence[0];
            this.stopped    = false;

            return this;
        },
        
        gotoFrame : function( f ){

            this.stopped = false;
            this.timer.set( this.frameTime * -f );
            this.update();
        }
    });
});
        
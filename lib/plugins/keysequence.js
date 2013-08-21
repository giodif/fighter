ig.module( 
    'plugins.keysequence' 
)
.requires(
    'impact.input'
)
.defines( function(){

    KeySequence = function( name, keylist, delta ){

        this.name               = name;                         // string name of the sequence used by client
        this.delta              = delta;                        // amount of time before the sequence times out
        this.keylist            = this.mapKeyList( keylist );   // array of key values that represent each input
        this.activeindex        = -1;                           // -1 = sequence is inactive, 0-n = index of keys that have been pressed
        this.active             = false;                        // are keys being pressed that match the sequence?
        this.timer              = undefined;                    // timer to end sequence if the player takes too long
        this.sequenceComplete   = false;                        // flag if sequence has been satisfied
    };

    KeySequence.prototype.update = function(){

        // reset everything except the sequenceComplete flag
        if( this.sequenceComplete ){
            this.deactivate();
        }

        //if sequence times out, abort
        if( this.timer !== undefined && this.timer.delta() >= 0 ){
            this.reset();
        }
    };
    KeySequence.prototype.evalKeySequence = function( key ){

        var isArray     = key instanceof Array,
            isActive    = this.activeindex >= 0,
            listItemIsArray;

        if( isActive ){

            if( isArray ){

                listItemIsArray = this.keylist[ this.activeindex + 1 ] instanceof Array;

                if( !listItemIsArray ){

                    this.reset(); // ones an array and the other isn't, abort
                }
                else if( key.isEqualTo( this.keylist[ this.activeindex + 1 ] ) ){
                        
                    this.activeindex++; //if next input matches sequence, advance to the next value for testing
                }
                else{
                    this.reset(); //don't match, abort
                }
            }
            else{
                if( key === this.keylist[ this.activeindex + 1 ] ){

                    this.activeindex++; //if next input matches sequence, advance to the next value for testing
                }
                else{
                    this.reset(); // don't match, abort
                }
            }

            if( this.activeindex === this.keylist.length - 1 ){
                
                this.sequenceComplete = true; //if the sequence has been satisfied, halt everything and set flag
            }
        }
        else{
            if( isArray && this.keylist[ 0 ] instanceof Array && key.isEqualTo( this.keylist[ 0 ] ) ){

                this.activate(); // both are arrays and they are equal, activate
            }
            else if( key === this.keylist[ 0 ] ){

                this.activate(); // neither are arrays and they are the same number, activate
            } 
        }

        return this.activeindex;
    };
    KeySequence.prototype.reset = function(){

        this.deactivate();
        this.sequenceComplete = false;
    };
    KeySequence.prototype.activate = function(){

        this.active         = true;
        this.activeindex    = 0;
        this.timer          = new ig.Timer( this.delta );

        return 1;
    };
    KeySequence.prototype.deactivate = function(){

        this.active             = false;
        this.activeindex        = -1;
        this.timer              = undefined;

        return -1;
    };
    KeySequence.prototype.mapKeyList = function( keyliststring ){

        var kls     = keyliststring.replace( /\s+/g, "" ),
            keylist = kls.split( "," ),

            i       = 0,
            len     = keylist.length,
            newlist = [],
            split,
            slen,
            multi,
            j;

        for( i; i < len; i++ ){

            split   = keylist[ i ].split( "+" );
            slen    = split.length;
            multi   = [];
            j       = 0;

            if( slen > 1 ){
                
                for( j; j < slen; j++ ){
                    multi.push( ig.KEY[ split[ j ] ] );
                }

                newlist.push( multi.sort( function( a, b ){
                    return a > b ? 1 : a < b ? -1 : 0;
                } ) );
            }
            else{
                newlist.push( ig.KEY[ keylist[ i ] ] ); 
            }
        }
        return newlist;
    };
    KeySequence.prototype.size = function(){

        return this.keylist.length;
    };
    KeySequence.prototype.status = function(){

        return this.sequenceComplete ? 1000 : this.activeindex;
    };
});
        
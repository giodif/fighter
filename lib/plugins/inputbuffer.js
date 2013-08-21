ig.module( 
    'plugins.inputbuffer' 
)
.requires(
    'impact.input'
)
.defines( function(){

    InputBuffer = ig.Class.extend({

        report          : undefined,
        inputmap        : undefined,
        lastpack        : undefined,    // the last valid input that was sent to all the KeySequences
        inputsequences  : [],           // list of KeySequence objects
        responselist    : [],           // list of names of input keys
        activesequences : [],           // sequences that are currently being evaluated but are incomplete
        pressedlist     : [],           // list of keys currently 'pressed' just like ig.input
        statelist       : [],           // list of keys currently held down just like ig.input
        listeners       : [],           // anyone who is listening for broadcasts from the input buffer


        init : function( map, listeners ){
            
            var len = listeners ? listeners.length : -1,
                i   = 0;

            if( len > i ){
                for( i; i < len; i++ ){
                    this.addListener( listeners[ i ].listener, listeners[ i ].func );
                }
            }

            //console.log( "inputbuffer", map );
            
            this.inputmap = map;
            this.loadInputs();
        },
        //doesn't automatically update every frame, update cycle is handled by the ig.game object
        update : function(){

            var len = this.inputsequences.length,
                i;

            this.updateInputLists();
            this.validatePackages();

            for( i = 0; i < len; i++ ){
                this.inputsequences[ i ].update();
            }
            
            this.report = this.buildActiveSequenceReport();

            if( this.report ){
                this.broadcastReport();
                this.resetInputSequences();
            }
        },


        //braodcasts any valid report to whomever is listening
        broadcastReport : function(){

            var len = this.listeners.length,
                i;

            for( i = 0; i < len; i++ ){      
                this.listeners[ i ].listener[ this.listeners[ i ].func ]( this.report );
            }

            this.report = undefined;
        },
        // adds to the list of object that will be notified if the buffer creates a report
        // also caches the name ( string ) of the function to use to send the message
        addListener : function( listener, func ){

            this.listeners.push({
                'listener'  : listener,
                'func'      : func
            });
        },


        // calls reset on all currently active KeySequences
        resetInputSequences : function(){

            var len = this.inputsequences.length,
                i;
                
            for( i = 0; i < len; i++ ){
                this.inputsequences[ i ].reset();
            }
        },
        // update active Key Sequences in the activesequences array and create report if necessary
        buildActiveSequenceReport : function(){

            var len     = this.activesequences.length,
                size    = 0,
                slen,
                i,
                j,
                activemembers,
                report,
                group,
                gstatus,
                glen,
                completelist;
            
            // build the report and ensure that it is the name of the longest KeySequence in the group
            for( i = 0; i < len; i++ ){

                //cache each group of KeySequences
                group = this.activesequences[ i ];

                // if the group only has one member, decide if it can be reported
                if( group.length === 1 ){

                    if( group[ 0 ].status() === 1000 ){ // a report of 1000 means that the sequence is complete

                        group[ 0 ].reset();
                        report          = group[ 0 ].name;
                        group.length    = 0;
                        i               = len;
                    }
                    else if( group[ 0 ].status() === -1 ){ // a report of -1 means that the sequence failed

                        group.length = 0;
                    }
                }

                //if the group has multiple members, seperate them by status and remove the KeySequenes that have failed
                else if( group.length > 1 ){

                    glen            = group.length - 1;
                    activemembers   = false;
                    completelist    = [];

                    // separate inputs based on status reports
                    for( glen; glen >= 0; glen-- ){

                        gstatus = group[ glen ].status();

                        if( gstatus === -1 ){ // -1 means that the sequence failed, get rid of it
                            group.splice( glen, 1 );
                        }
                        else if( gstatus >= 0 && gstatus < 1000 ){ // a number 0-999 is a status of active, let it ride but not its existence
                            activemembers = true;
                        }
                        else if( gstatus === 1000 ){ // 1000 means that the keysequence has been satisfied and is ready to report
                            completelist.push( group[ glen ] );
                        }
                    }

                    // if other key sequences are pending, wait until no conflicts before building a report
                    if( ( activemembers === false ) && completelist.length > 0 ){

                        for( j = 0; j < completelist.length; j++ ){

                            if( completelist[ j ].size() > size ){

                                size    = completelist[ j ].size();
                                report  = completelist[ j ].name;
                            }
                        }
                    }
                }
            }

            // cleanup, remove empty groups from the activesequence list
            slen = this.activesequences.length - 1;

            if( slen >= 0 ){
                for( slen; slen >= 0; slen-- ){

                    group = this.activesequences[ slen ];

                    if( group.length <= 0 ){
                        this.activesequences.splice( slen, 1 );
                    }
                }
            }

            return report;
        },
        // validate packages of inputs and determine whether or not to send them to KeySequence objects
        validatePackages : function(){

            var pack = this.packageInputs();

            if( this.shouldQueueSequences( pack, this.lastpack ) ){
                this.queueSequences( pack );
                //console.log( pack );
            }

            this.lastpack = pack;
        },
        //update the lists of currently pressed inputs 
        updateInputLists : function(){
            
            var len = this.responselist.length,
                i   = 0;

            this.statelist      = []; //clean slate
            this.pressedlist    = []; //clean slate
            
            for( i; i < len; i++ ){ //iterate through all of the registered inputs

                //if just pressed add the the pressed list
                if( this.pressed( this.responselist[ i ].name ) ){
                    this.pressedlist.push( this.responselist[ i ].key );
                }
                //if holding this button down add to the statelist
                else if( this.state( this.responselist[ i ].name ) ){
                    this.statelist.push( this.responselist[ i ].key );
                }
            }
        },
        //packages the currenly pressed and held down inputs appropriately for
        //into a format that the KeySequences will understand
        packageInputs : function(){

            var pl  = this.pressedlist,
                sl  = this.statelist,
                pack,
                key,
                shouldAdd,
                i, j, k;

            // combine both keylist to simplify the pack for comparison with the last sent package
            for( i = 0; i < sl.length; i++ ){
                pl.push( sl[ i ] );
            }

            // do nothing if no keys are pressed
            if( pl.length > 0 ){

                // if only one key pressed, the pack is a single number
                if( pl.length === 1 ){
                    pack = pl[ 0 ];
                }
                //if multiple keys are pressed, the pack is an array
                else{
                    pack = [];

                    // removing duplicates, * may be unnecessary *
                    for( j = 0; j < pl.length; j++ ){

                        key         = pl[ j ];
                        shouldAdd   = true;

                        for( k = 0; k < pack.length; k++ ){

                            if( key === pack[ k ] ){
                                shouldAdd = false;
                            }
                        }

                        if( shouldAdd ){
                            pack.push( key );
                        }
                    }
                }
            }

            // sort the array of numbers in ascending order for easier comparison with other packs
            if( pack instanceof Array ){

                pack.sort( function( a, b ){
                    return a > b ? 1 : a < b ? -1 : 0;
                } );
            }

            return pack;
        },
        //compares current input sequence with the last one
        //will only pass it on if the two differ appropriately
        shouldQueueSequences : function( pack, lastpack ){

            var p       = pack,   
                lp      = lastpack,
                should  = false,
                i, len;

            // safety check
            if( p !== undefined ){

                // if both packs are arrays, only allow the sequence to be queued if they differ in members
                if( p instanceof Array ){
                    if( lp instanceof Array ){

                        if( !p.isEqualTo( lp ) ){

                            should = true;
                        }
                    }
                    // if one is an array but not the other, allow pack to be queued
                    else{
                        should = true;
                    }
                }
                // if pack is a number, pass it on if it differs in any way form the lastpack
                else if( typeof p === 'number' ){

                    if( typeof lp === 'number'){

                        if( p !== lp ){
                            
                            should = true;
                        }
                    } 
                    else{
                        should = true;
                    }
                }
            }

            return should;
        },
        //reviews the status of KeySequences and queues them for potential delivery to client
        queueSequences : function( pack ){

            var i               = 0,
                len             = this.inputsequences.length,
                newactivegroup  = [],
                status;

            //create and cache a an active group of KeySequences if they report a status of 0
            for( i; i < len; i++ ){

                this.inputsequences[ i ].evalKeySequence( pack );
                status = this.inputsequences[ i ].status();

                //0 means that the KeySequence has just initialized itself based upon the current pack
                //already active or complete KeySequences will not be added to a new activegroup
                if( status === 0 ){
                    newactivegroup.push( this.inputsequences[ i ] );
                }
            }

            if( newactivegroup.length > 0 ){
                this.activesequences.push( newactivegroup );
            }
        },
        addSequence : function( sequence ){

            this.inputsequences.push( sequence );
        },
        removeSequence : function( name ){

            var i   = 0,
                len = this.inputsequences.length;

            for( i; i < len; i++ ){
                if( this.inputsequences[ i ].name === name ){

                    this.inputsequences.splice( i, 1 );
                    break;
                }
            }
        },
        
        state : function( type ){       return ig.input.state( type ); }, // convenience method for ig.input.state
        pressed : function( type ){     return ig.input.pressed( type ); }, // convenience method for ig.input.pressed
        released : function( type ){    return ig.input.released( type ); }, // convenience method for ig.input.released


        // loads all inputs via the inputmap
        loadInputs : function(){

            var name,
                key,
                i   = 0,
                len = this.inputmap.length;

            for( i; i < len; i++ ){

                name    = this.inputmap[ i ].name;
                key     = this.inputmap[ i ].key;

                this.addInput( name, key );
            }
        },
        // binds input and saves it's data
        addInput : function( name, key ){

            ig.input.bind( ig.KEY[ key ], name );
            this.responselist.push( { 'name' : name, 'key' : ig.KEY[ key ] } );
        },
        //removes an input using its name
        removeInput : function( name ){

            var i   = 0,
                len = this.inputmap.length;

            for( i; i < len; i++ ){
                if( this.inputmap[ i ].name === name ){

                    ig.input.unbind( this.inputmap[ i ].key );
                    break;
                }
            }
        }
    });
});
        
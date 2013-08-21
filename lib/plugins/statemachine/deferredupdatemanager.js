ig.module( 
    'plugins.statemachine.deferredupdatemanager' 
)
.defines( function(){

    DeferredUpdateManager = ig.Class.extend({

        owner               : undefined,
        currentDeferred     : undefined,
        currentDeferredName : undefined,
        defaultDeferred     : undefined,
        deferredUpdates     : [],

        //Registers the object to be updated
        init : function( owner ){
            // this.owner is the entity in question, either the player or the bad guy
            this.owner = owner;
        },

        //updates this.owner by deferring update to currently running deferred
        update : function(){

            this.currentDeferred.updateEntity( this.owner );
        },

        //adds an DeferredUpdate instance to the pool of deferred updates
        //and defined a string identifier for that instance
        //should is a flag that determines whether to overwrite an existing 
        //instance if the identifier is already used, defaults to 'false'
        addDeferred : function( identifier, deferred, should ){

            var shouldOverwrite = should || false,
                shouldAdd       = true,
                len             = this.deferredUpdates.length,
                x,
                i;

            if( !shouldOverwrite ){

                for( i = 0; i < len; i++ ){
                    if( this.deferredUpdates[ i ].hasOwnProperty( identifier ) ){
                        shouldAdd = false;
                        break;
                    }
                }
            }

            if( shouldAdd ){

                x = {};
                x[ identifier ] = deferred;

                this.deferredUpdates.push( x );
                deferred.defineOwner( this );
            }

            //the first deferred that gets added is the default state
            //this will switch the deferred update instance to the default
            if( this.deferredUpdates.length === 1 ){

                this.defaultDeferred = identifier;
                this.goTo( identifier );
            }
        },

        removeDeferred : function( identifier ){

            var len = this.deferredUpdates.length,
                i;

            for( i = 0; i < len; i++ ){
                if( this.deferredUpdates[ i ].hasOwnProperty( identifier ) ){
                    this.deferredUpdates.splice( i, 1 );
                    break;
                }
            }
        },

        //just returns the identifier for the currently active deferred update
        current : function(){

            return this.currentDeferredName;
        },
        //returns the type
        currentType : function(){

            return this.currentDeferred.type;
        },

        //checks to see if a deferred is registered under the provided identifier
        //return a bool
        has : function( identifier ){

            var has = false,
                len = this.deferredUpdates.length,
                i;

            for( i = 0; i < len; i++ ){
                if( this.deferredUpdates[ i ][ identifier ] !== undefined ){
                    has = true;
                    break;
                }
            }
            return has;
        },
        
        //switches off the currently running deferred update instance and turns on the new one,
        //takes a string 'identifier'
        goTo : function( identifier ){

            var id  = identifier || this.defaultDeferred,
                len = this.deferredUpdates.length,
                ob,
                i;

            for( i = 0; i < len; i++ ){

                ob = this.deferredUpdates[ i ][ id ];

                if( ob !== undefined ){

                    if( this.currentDeferred ){
                        this.currentDeferred.sleep( this.owner );
                    }
                    this.currentDeferred        = ob;
                    this.currentDeferredName    = id;
                    this.currentDeferred.awake( this.owner );
                    break;
                }
            }
        }
    });
});
        
ig.module( 
    'plugins.ai.aiinputmanager' 
)
.defines( function(){

    AIInputManager = ig.Class.extend({

        //list of actions that the bot can take
        currentlyActive : [], //actions that have been active for more than one update cycle
        justActivated   : [], //actions that were initiated in the last update cycle
        justReleased    : [], //actions that were just released in the last update cycle
        actions         : {}, //list of all possible actions that the bot can take
        map             : undefined,

        init : function( map ){
            //list of inputs and actions
            this.map = map;
        },

        update : function(  ){

            this.currentlyActive = this.currentlyActive.concat( this.justActivated ).unique();

            this.justActivated.length   = 0;
            this.justReleased.length    = 0;
        },

        //checks to see if a particular state can go to another state, returns a BOOL
        can : function( current, next ){ return this.map.can( current, next ); },
        //checks to see if an input can be pressed at the same time as another, returns a BOOL
        and : function( current, next ){ return this.map.and( current, next ); },

        //returns true if input 'type' has been pressed for a while
        state : function( type ){

            var i = this.currentlyActive.length - 1;

            for( ; i >= 0; i-- ){ if( this.currentlyActive[ i ] === type ){ return true; } }
            
            return false;
        },
        //returns true if input 'type' has been just been pressed in the last update cycle
        pressed : function( type ){

            var i = this.justActivated.length - 1;
            
            for( ; i >= 0; i-- ){ if( this.justActivated[ i ] === type ){ return true; } }
            return false;
        },
        //returns true if input 'type' has been released in the last update cycle
        released : function( type ){

            var i = this.justReleased.length - 1;

            for( ; i >= 0; i-- ){ if( this.justReleased[ i ] === type ){ return true; } }
            return false; 
        },


        
        
        //removes input 'type' from the currentlyActive list if necessary
        deactivate : function( type ){

            var i;

            if( this.isValidType( type ) && this.isCurrentlyActive( type ) ){

                i = this.currentlyActive.length - 1;

                for( ; i >= 0; i-- ){

                    if( this.currentlyActive[ i ] === type ){
                    
                        this.currentlyActive.splice( i, 1 );
                        break;
                    }
                } 
            }
        },
        //adds input 'type' to the justActivated list or currentlyActive list
        activate : function( type ){

            if( this.isValidType( type ) ){
                
                this.justActivated.push( type );
            }
        },



        //check to see if input 'type' is registered with the AI and available
        isValidType : function( type ){

            var i = this.map.inputs.length - 1;

            for( ; i >= 0; i-- ){ if( this.map.inputs[ i ].name === type ){ return true; } }
            return false;            
        },
        //check to see if input 'type' is in the currentlyActive list
        isCurrentlyActive : function( type ){

            var i = this.currentlyActive.length - 1;

            for( ; i >= 0; i-- ){ if( this.currentlyActive[ i ] === type ){ return true; } }  
            return false;        
        }

    });
});
        
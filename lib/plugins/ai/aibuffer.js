ig.module( 
    'plugins.ai.aibuffer' 
)
.requires(
    'plugins.ai.chronicler',
    'plugins.ai.filter',
    'plugins.ai.aiinputmanager'
)
.defines( function(){

    /*
    TODO: 
        Create Report?
        Evaluate Movement?
        Update Current Inputs?
        Profile Self?
        Classifications?
        Save History by Opponent
        Define and Impliment Significance, Aggression, Confidence
    */

    AIBuffer = ig.Class.extend({

        owner        : undefined, //bot receiving notifications from the AI
        contactOwner : undefined, //function to call when notifying owner
        report       : undefined, //a string name of an action that is sent to the bot
        chronicler   : undefined,
        filter       : undefined,
        inputmanager : undefined,
        aggression   : undefined, //how likely is a response to be attacking vs. defensive
        profile      : undefined, //what the fudge is this?

        init : function( map, owner, Func ){

            var that = this;

            //the bot that needs input
            this.owner = owner;
            //the function that Buffer calls to speak to it's owner
            this.contactOwner = Func;
            this.inputmanager = new AIInputManager( map );
            this.chronicler   = new Chronicler();
            this.filter       = new FILTER();

            $( ".postdata" ).click( function( e ){

                that.chronicler.saveHistory( that.owner.foe.identifier );
                return false;
            });
        },

        //doesn't automatically update every frame, update cycle is handled by the ig.game object
        update : function(){

            // 'events' is a group of Events
            var events = this.filter.findSimilarProfiles(

                    this.chronicler.profile( this.owner, this.owner.foe ), //returns the foe's current profile
                    this.chronicler.getSeedHistory() //returns the foe's complete history
                );

            if( events !== undefined ){

                this.releventEvents = events;
            }

            this.inputmanager.update();
            this.broadcastReport();  // Talk to the bot and tell it what to do: attack or defend ( and how ) or do nothing
        },

        loadSeedHistory : function(){

            this.chronicler.loadSeedHistory( this.owner.foe.identifier );
        },

        //send a message to the bot if needed
        //used to change state and such
        broadcastReport : function(){

            if( this.report ){

                this.owner[ this.contactOwner ]( this.report );
                this.report = undefined;
            }
        },
        
        //returns true if input 'type' has been pressed for a while
        state : function( type ){ return this.inputmanager.state( type ); },
        //returns true if input 'type' has been just been pressed in the last update cycle
        pressed : function( type ){ return this.inputmanager.pressed( type ); },
        //returns true if input 'type' has been released in the last update cycle
        released : function( type ){ return this.inputmanager.released( type ); }
    });
});

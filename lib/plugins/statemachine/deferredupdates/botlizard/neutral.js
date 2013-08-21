ig.module( 
    'plugins.statemachine.deferredupdates.botlizard.neutral' 
)
.requires(
    'plugins.statemachine.deferredupdates.generic.neutral' 
)

.defines( function(){

    Botlizardneutral = Neutral.extend({

        attack : function( entity ){

            var attack  = entity._attack || "",
                flip,
                flipped,
                state;

            if( attack ){

                flip    = entity.faceOther( entity.foe );
                flipped = !attack.match( /right/i );
                state   = attack.replace( flipped ? new RegExp( "left" ) : new RegExp( "right" ), '' );

                if( entity.standing && flip === flipped && this.owner.has( state ) ){
                    this.owner.goTo( state );
                }
                entity._attack = undefined;
            }
        }
    });
});
        
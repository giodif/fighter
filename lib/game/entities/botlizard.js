ig.module(
    'game.entities.botlizard'
)
.requires(
    'game.entities.lizard',
    'plugins.ai.aibuffer',
    'plugins.ai.event',
    'plugins.ai.profile',
    'plugins.statemachine.deferredupdate',
    'plugins.statemachine.deferredupdates.botlizard.neutral'
)
.defines(function (){

    EntityBotlizard = EntityLizard.extend({

        name            : "enemy",
        identifier      : "botlizard",

        //called by the init method
        setup : function(){

            this._inputbuffer = new AIBuffer( BotLizardMap, this, 'defineAttack' );
            this.utilitySetup(); //See EntityLizard for details
        },
        _addDeferredsToInputManager : function(){
            
            this.parent();
            this._manager.addDeferred( 'neutral', new Botlizardneutral( DeferredUpdate.types.NEUTRAL ), true );
        },
        _addInputBufferSequences : function(){ /* overriding parent to prevent errors */ }
    });
});






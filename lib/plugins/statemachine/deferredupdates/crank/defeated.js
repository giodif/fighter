ig.module( 
    'plugins.statemachine.deferredupdates.crank.defeated' 
)
.requires(
    'plugins.statemachine.deferredupdate'
)
.defines( function(){

    Crankdefeated = DeferredUpdate.extend({

        state : undefined,

        awake : function( entity ){
            
            ig.Timer.timeScale = 0.5;
            entity.isInvincible();
        }
    });
});
        
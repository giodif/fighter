ig.module( 
    'plugins.effects.strongcharge' 
)
.requires(
    'plugins.effects.effect'
)
.defines( function(){

    Effectstrongcharge = Effect.extend({

        init : function( x, y, settings ){

            this.parent( x, y, settings );
            
            this.animSheet = new ig.AnimationSheet( 'media/characters/crankeffects.png', 320, 320 );
            this.addAnim( 'strongcharge', 0.06, [ 0,1,2,1,3,0,4,2,1 ], true );
            this.currentAnim = this.anims.strongcharge;
        }
    });
});
        
ig.module( 
    'plugins.overlay' 
)
.requires(
    
    'game.impact.entity'
)
.defines( function(){

    Overlay = ig.entity.extend({

        name : "player",
        size : { x : 40, y : 150 },
        zIndex : 1000,
        gravityFactor : 0,

        init : function( x, y, settings ){

            this.parent( x, y, settings );

            this.animSheet = new ig.AnimationSheet( 'media/characters/girl7.png', 240, 240 );
            this.addAnim( 'bg', 0.2, [ 0 ] );
            this.currentAnim = this.anims.idle;
        },

        update : function(){ /* OVERLAY */ }
    });
});
        
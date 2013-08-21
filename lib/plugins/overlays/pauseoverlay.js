ig.module( 
    'plugins.overlays.overlay' 
)
.requires(
    'game.impact.entity'
)
.defines( function(){

    PauseOverlay = ig.entity.extend({

        pauseText : undefined,

        init : function( x, y, settings ){

            this.parent( x, y, settings );

            this.pauseText = ig.game.spawnEntity( ig.Entity, this.pos.x, this.pos.y );

            this.pauseText.animSheet = new ig.AnimationSheet( 'media/characters/girl7.png', 240, 240 );
            this.pauseText.addAnim( 'bg', 0.4, [ 0 ] );
            this.pauseText.currentAnim = this.anims.bg;
        }


    });
});
        
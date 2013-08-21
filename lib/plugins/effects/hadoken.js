ig.module( 
    'plugins.effects.hadoken' 
)
.requires(
    'plugins.effects.effect'
)
.defines( function(){

    Effecthadoken = Effect.extend({

        xoffset : 70,

        init : function( x, y, settings ){

            this.animSheet = new ig.AnimationSheet( 'media/characters/lizardeffects.png', 310, 240 );
            this.addAnim( 'hadoken', 0.15, [ 100,5,6,7,8,9 ], true );

            this.currentAnim = this.anims.hadoken;
            this.parent( x, y, settings );
        },

        update : function(){

            var flip = this.currentAnim.flip.x = this.owner.currentAnim.flip.x;

            this.parent();

            if( flip ){ this.pos.x -= this.xoffset; }
        }
    });
});
        
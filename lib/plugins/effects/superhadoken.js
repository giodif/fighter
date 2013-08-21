ig.module( 
    'plugins.effects.superhadoken' 
)
.requires(
    'plugins.effects.hadoken'
)
.defines( function(){

    Effectsuperhadoken = Effecthadoken.extend({

        init : function( x, y, settings ){

            this.parent( x, y, settings );
            this.animSheet = new ig.AnimationSheet( 'media/characters/lizardeffects.png', 310, 240 );
            this.addAnim( 'superhadoken', 0.15, [ 100,10,11,12,13,13,14,14 ], true );
            this.currentAnim = this.anims.superhadoken;
        }
    });
});
        
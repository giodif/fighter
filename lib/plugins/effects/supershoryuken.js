ig.module( 
    'plugins.effects.supershoryuken' 
)
.requires(
    'plugins.effects.hadoken'
)
.defines( function(){

    Effectsupershoryuken = Effecthadoken.extend({

        init : function( x, y, settings ){

            this.parent( x, y, settings );
            this.animSheet = new ig.AnimationSheet( 'media/characters/lizardeffects.png', 310, 240 );
            this.addAnim( 'shoryuken', 0.1, [ 0,1,2,3,4,4 ], true ); //standing
            this.currentAnim = this.anims.shoryuken;
        }
    });
});
        
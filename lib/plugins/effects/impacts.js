ig.module( 
    'plugins.effects.impacts' 
)
.requires(
    'impact.entity'
)
.defines( function(){

    ImpactEffect = ig.Entity.extend({

        size            : { x : 10, y : 10 },
        offset          : { x : 55, y : 55 },
        effectType      : "impact",
        zIndex          : 20000,
        gravityFactor   : 0,
        type            : ig.Entity.TYPE.NONE,
        collides        : ig.Entity.COLLIDES.NONE,

        init : function( x, y, settings ){

            this.parent( x, y, settings );

            this.animSheet = new ig.AnimationSheet( 'media/characters/lizardimpacts.png', 120, 120 );

            this.addAnim( 'impact',       0.05, [ 3,3,2,1,0 ], true );
            this.addAnim( 'hadoken',      0.05, [ 7,7,6,5,4 ], true );
            this.addAnim( 'superhadoken', 0.05, [ 11,11,10,9,8 ], true );

            this.currentAnim = this.anims[ this.effectType ].rewind();
        },
        update : function(){

            this.parent();
            if( this.currentAnim.stopped ){ this.kill(); }
        }
    });
});
        
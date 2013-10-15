ig.module( 
    'plugins.lefthealthbar'
)
.requires(
    'impact.entity',
    'impact.image'
)
.defines( function(){

    LeftHealthBar = ig.Entity.extend({

        size          : { x : 200, y : 18 },
        staticPos     : { x : 0, y : 0 },

        healthAmount  : 200,
        lostHealth    : 1,

        healthbg      : new ig.Image( "media/interface/healthbar-bg-left.png" ),
        healthbar     : new ig.Image( "media/interface/healthbar-left.png" ),

        collides      : ig.Entity.COLLIDES.NONE,
        type          : ig.Entity.TYPE.NONE,
        gravityFactor : 0,

        init : function( x, y, settings ){

            this.staticPos = {
                x : ig.system.realWidth / 2  - ( 24 + this.size.x ),
                y : 30
            };
            this.parent( x, y, settings );
        },

        updateHealthAmount : function( h ){
            
            this.lostHealth = h;
        },

        draw : function( ){

            this.healthbg.draw(
                this.staticPos.x,
                this.staticPos.y
            );

            this.healthbar.draw(
                this.staticPos.x,
                this.staticPos.y,
                0, 0,
                this.lostHealth,
                18
            );

            this.parent();
        }
    });
});
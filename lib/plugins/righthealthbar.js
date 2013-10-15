ig.module( 
    'plugins.righthealthbar'
)
.requires(
    'impact.entity',
    'impact.image'
)
.defines( function(){

    RightHealthBar = ig.Entity.extend({

        size          : { x : 200, y : 18 },
        staticPos     : { x : 0, y : 0 },

        healthAmount  : 200,
        lostHealth    : 0,

        healthbg      : new ig.Image( "media/interface/healthbar-bg.png" ),
        healthbar     : new ig.Image( "media/interface/healthbar.png" ),

        collides      : ig.Entity.COLLIDES.NONE,
        type          : ig.Entity.TYPE.NONE,
        gravityFactor : 0,

        init : function( x, y, settings ){

            this.staticPos = {
                x : ig.system.realWidth / 2 + 25,
                y : 30
            };

            this.parent( x, y, settings );
        },

        updateHealthAmount : function( h ){

            this.lostHealth = h;
        },

        draw : function(){

            var lessHealth = this.healthAmount - this.lostHealth;

            this.healthbg.draw(
                this.staticPos.x / ig.system.scale,
                this.staticPos.y / ig.system.scale
            );

            this.healthbar.draw(
                ( this.staticPos.x / ig.system.scale ) + lessHealth,
                this.staticPos.y / ig.system.scale,
                lessHealth, 0,
                this.lostHealth,
                18
            );

            this.parent();
        }
    });
});
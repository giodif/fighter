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

            this.healthAmount = h;
        },

        draw : function(){

            var lostHealth = 130,
                lessHealth = this.healthAmount - lostHealth;

            this.healthbg.draw(
                this.staticPos.x / ig.system.scale,
                this.staticPos.y / ig.system.scale
            );

            this.healthbar.draw(
                ( this.staticPos.x / ig.system.scale ) + lessHealth,
                this.staticPos.y / ig.system.scale,
                lessHealth, 0,
                lostHealth,
                18
            );

            this.parent();
        }
    });
});
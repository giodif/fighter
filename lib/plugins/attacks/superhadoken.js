ig.module( 
    'plugins.attacks.superhadoken' 
)
.requires(
    'plugins.attacks.hadoken'
)
.defines( function(){

    Attacksuperhadoken = Attackhadoken.extend({

        maxVel    : { x : 500, y : 0 },
        strength  : 100,
        speed     : 500,
        distance  : 600,

        init : function( x, y, settings ){

            this.parent( x, y, settings );
            this.addAnim( 'superhadoken', 0.15, [ 5,6,7,8,9 ] );
            this.currentAnim = this.anims.superhadoken;
        },
        check : function( other ){

            Attack.prototype.check.call( this, other );    
            ig.game.spawnEntity( ImpactEffect, this.pos.x + this.size.x / 3, this.pos.y + this.size.y / 3, { effectType : "superhadoken" } );
        }
    });
});
        
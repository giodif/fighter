ig.module( 
    'plugins.attacks.simpleattack' 
)
.requires(
    'plugins.attacks.attack'
)
.defines( function(){

    //general attack for punches and kicks is initialized
    //with strength and owner and follows the owner's attack over time
    //killing it is the owner's responsibility
    SimpleAttack = Attack.extend({
        
        ownerOffset  : undefined,
        zIndex       : 14000,
        showingClash : false,

        registerOwner : function( owner, ownerOffset ){

            this.owner       = owner;
            this.ownerOffset = ownerOffset || { x : 0, y : 0 };
            
            return this;
        },
        check : function( other ){

            this.parent( other );

            if( !this.showingClash ){

                ig.game.spawnEntity( ImpactEffect, this.pos.x + this.size.x / 3, this.pos.y + this.size.y / 3 );
                this.showingClash = true;
            }
        },
        move : function(){

            var t    = {},
                flip = this.owner.currentAnim.flip.x;

            this.vel    = { x : 0, y : 0 };
            this.accel  = { x : 0, y : 0 };
            t.y         = this.owner.pos.y + this.ownerOffset.y;
            t.x         = flip ? ( this.ownerOffset.x + this.size.x ) * -1 : this.owner.size.x + this.ownerOffset.x;
            t.x         += this.owner.pos.x;
            this.pos    = t;
        }
    });
});
        
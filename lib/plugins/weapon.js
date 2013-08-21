ig.module( 
    'plugins.weapon' 
)
.requires(
    'impact.entity'
)
.defines( function(){

    Weapon = ig.Entity.extend({

        slowdown        : false,
        ownerOffset     : { x : 0, y : 0 },
        owner           : undefined,
        attackStrength  : undefined,
        duration        : undefined,
        name            : undefined,
        delay           : undefined,

        type            : ig.Entity.TYPE.A,
        checkAgainst    : ig.Entity.TYPE.B,

        update : function(){

            var o = this.owner,
                s = this.ownerOffset;

            this.pos.x = o.pos.x + s.x;
            this.pos.y = o.pos.y + s.y;

            if( !this.flip ){
                this.pos.x += o.size.x;
            }
        },

        registerOwner : function( newOwner ){

            this.owner = newOwner;
        },

        check : function( other ){

            other.receiveDamage( this.attackStrength );
        },

        //draw                : function(){ /* override default */ },
        receiveDamage       : function( amount, from ){ /* override default */ },
        handleMovementTrace : function(){ /* override default */ }
    });
});
        
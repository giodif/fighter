ig.module( 
    'plugins.attacks.attack' 
)
.requires(
    'impact.entity',
    'plugins.effects.impacts'
)
.defines( function(){

    Attack = ig.Entity.extend({
        
        strength        : 0,
        health          : 1,
        gravityFactor   : 0,
        unblockable     : false,
        owner           : undefined,

        collides        : ig.Entity.COLLIDES.NEVER,
        checkAgainst    : ig.Entity.TYPE.BOTH,
        type            : ig.Entity.TYPE.A,

        check : function( other ){

            if( other.type === ig.Entity.TYPE.A ){ //if other is another attack
                this.clash( other.strength );
            }
        },
        move : function(){},
        handleMovementTrace: function( res ) {
            // This completely ignores the trace result (res) and always
            // moves the entity according to its velocity
            this.pos.x += this.vel.x * ig.system.tick;
            this.pos.y += this.vel.y * ig.system.tick;
        },
        clash : function( strength ){
            
            var d = strength - this.strength;

            if( d > 0 ){
                this.kill();
            }
        }
    });
});
        
ig.module( 
    'plugins.effects.effect' 
)
.requires(
    'impact.entity'
)
.defines( function(){

    Effect = ig.Entity.extend({

        owner           : undefined,
        gravityFactor   : 0,
        type            : ig.Entity.TYPE.NONE,
        collides        : ig.Entity.COLLIDES.NONE,

        registerOwner : function( owner ){

            this.owner  = owner;
            this.pos    = owner.pos;
            this.offset = owner.offset;
            this.size   = owner.size;
            this.zIndex = owner.zIndex * 2;
        },

        update : function(){

            this.pos                = this.owner.pos;
            this.currentAnim.flip.x = this.owner.currentAnim.flip.x;

            if( this.currentAnim.stopped ){ this.kill(); }

            this.parent();
        }
    });
});
        
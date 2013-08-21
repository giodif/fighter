ig.module( 
    'plugins.hittarget' 
)
.requires(
    'impact.entity'
)
.defines( function(){

    HitTarget = ig.Entity.extend({

        name            : "high",
        entity          : undefined,
        state           : undefined,
        padding         : 4,
        gravityFactor   : 0,

        collides        : ig.Entity.COLLIDES.NONE,
        checkAgainst    : ig.Entity.TYPE.A,
        type            : ig.Entity.TYPE.B,

        init : function( x, y, settings ){

            this.isVulnerable();
            this.parent( x, y, settings );
        },
        move : function(){

            this.vel   = this.accel = { x : 0, y : 0 };
            this.pos.x = this.entity.pos.x - this.padding;
            this.pos.y = this.entity.pos.y - this.padding;
        },
        registerEntity : function( entity ){

            this.entity = entity;
            this.size   = { x : entity.size.x + ( this.padding * 2 ), y : ( entity.size.y / 2 ) + this.padding };
            
            return this;
        },
        check : function( other ){ //other is an attack
            
            this.receiveDamage( other.strength, other );
        },
        //'from' is the attack, amount is the attack strength
        receiveDamage : function( amount, from ){

            if( this.state !== HitTarget.states.INVINCIBLE ){
                //if the character is blocking, reduce the damage
                if( this.state === HitTarget.states.BLOCKING ){ amount /= 4; }
                this.entity._manager.currentDeferred.receiveDamage( this.entity, amount, this, from );
            }
        },
        isBlocking   : function(){ this.state = HitTarget.states.BLOCKING; },
        isInvincible : function(){ this.state = HitTarget.states.INVINCIBLE; },
        isVulnerable : function(){ this.state = HitTarget.states.VULNERABLE; }
    });

    HitTarget.states = { BLOCKING : 0, INVINCIBLE : 1, VULNERABLE : 2 };
});
        
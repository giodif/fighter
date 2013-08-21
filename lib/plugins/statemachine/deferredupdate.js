ig.module( 
    'plugins.statemachine.deferredupdate' 
)
.requires(
   'impact.entity',
    'plugins.attacks.simpleattack'
)

.defines( function(){

    DeferredUpdate = ig.Class.extend({

        owner : undefined,
        type  : undefined,
        attack : undefined,
        halfway : false,

        init : function( type ){  this.type = type || DeferredUpdate.types.ATTACK; },
        //the DeferredUpdateManager will call this function to register itself
        //with an DeferredUpdate instance
        defineOwner : function( owner ){ this.owner = owner; },
        //the DeferredUpdateManager will call this every update cycle if an
        //DeferredUpdate instance is active
        updateEntity : function( entity ){
        
            ig.Entity.prototype.update.call( entity );
            
            if( this.attack !== undefined ){ this.attack.move(); }
        },
        receiveDamage: function( entity, amount, from, attack ) {

            //TODO:SPAWN DAMAGE OBJECT
            if( !attack.unblockable ){ attack.kill(); }
            entity.receiveDamage( amount, from );

            if( entity.health <= 0 ){

                this.owner.goTo( "defeated" );
            }
            else if( amount >= 80 ){

                this.owner.goTo( "knockdown" );
            }
            else{
                this.owner.goTo( from.name === "high" ? "highblow" : "lowblow" );
            }
        },
        //stubb: DeferredUpdateManager calls this function
        //one time just before a DefferedUpdate is made active
        awake : function( entity ){},
        //stubb: DeferredUpdateManager calls this function
        //one time just before a DefferedUpdate is made inactive
        sleep : function( entity ){}
    });
    DeferredUpdate.types = {
        ATTACK   : 0,
        DEFENSE  : 1,
        INJURED  : 2,
        NEUTRAL  : 3,
        INACTIVE : 4
    };
    DeferredUpdate.layer = {
        FRONT   : 12000,
        MIDDLE  : 10000,
        BACK    : 80000
    };
});
ig.module( 
    'plugins.attacks.hadoken' 
)
.requires(
    'plugins.attacks.attack'
)
.defines( function(){

    Attackhadoken = Attack.extend({
        
        size            : { x : 30, y : 30 },
        offset          : { x : 45, y : 24 },
        maxVel          : { x : 400, y : 0 },
        strength        : 70,
        speed           : 350,
        distance        : 300,
        flip            : false, 
        origin          : undefined,

        init : function( x, y, settings ){
            
            this.parent( x, y, settings );
            this.animSheet = new ig.AnimationSheet( 'media/characters/lizardattacks.png', 120, 75 );
            this.addAnim( 'hadoken', 0.15, [ 0,1,2,3,4 ] );
            this.currentAnim = this.anims.hadoken;
        },
        getDirection : function( ref ){

            var offset = this.size.x + this.offset.x * 2;

            this.flip   = this.currentAnim.flip.x = ref.currentAnim.flip.x;
            this.pos.x  = this.origin = ref.pos.x;    

            if( this.flip ){
                this.pos.x -= offset;
                this.speed *= -1;
            }
            else{
               this.pos.x += offset; 
            }
            this.vel.x = this.speed;
        },
        check : function( other ){

            this.parent( other );
            ig.game.spawnEntity( ImpactEffect, this.pos.x + this.size.x / 2, this.pos.y, { effectType : "hadoken" } );
        }
    });
});
        
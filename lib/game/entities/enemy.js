ig.module(
	'game.entities.enemy'
)
.requires(
	'data.playerweapons',
	'impact.entity',
	'plugins.delay',
	'plugins.weapon',
	'game.entities.shadow'
)
.defines(function (){

	EntityEnemy = ig.Entity.extend({

		name		: "enemy",
		size		: { x : 50,		y : 110  },
		offset		: { x : 95,		y : 62   },
		maxVel		: { x : 400,	y : 1000 },
		friction	: { x : 2000,	y : 0    },
		jump		: -900,
		gaccel		: 400,
		zIndex		: 10000,
        attacking	: false,
		foe			: undefined,
		shadow		: undefined,
		hittargets	: undefined,
        state		: undefined,
		range		: { CLOSE : 100, MID : 200, LONG : 300 },
        collides	: ig.Entity.COLLIDES.ACTIVE,

		init : function( x, y, settings ){

			this.parent( x, y, settings );
			
			this.animSheet	= new ig.AnimationSheet( 'media/characters/enemy2.png', 240, 240 );
			
			this.addAnim( 'idle', 0.1, [ 0,1,2,2,1,0 ] );

			
			this.currentAnim = this.anims.idle;

			if( !ig.global.wm ){
				this.shadow = ig.game.spawnEntity(
					EntityShadow,
					this.pos.x,
					this.pos.y + this.size.y
				);
				
				this.shadow.defineOwner( this );
			}
		},

		update : function(){

			this.currentAnim.flip.x = this.faceOther( this.foe );
			this.parent();
		}
	});
});






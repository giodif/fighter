ig.module(
	'game.entities.shadow'
)
.requires(
	'impact.entity'
)
.defines( function (){

	EntityShadow = ig.Entity.extend({

		size			: { x : 99, y : 14 },
		offset			: { x : 0,  y : 0 },
		
		gravityFactor	: 0,
		owner			: undefined,
		zIndex			: 1000,

		init : function( x, y, settings ){

			this.initAnimations();
			this.parent( x, y, settings );
		},

		defineOwner : function( owner ){

			this.owner = owner;
		},

		initAnimations : function(){

			this.animSheet	= new ig.AnimationSheet( 'media/characters/shadow.png', 99, 14 );
			this.addAnim( 'idle', 0.5, [ 0 ] );
			this.currentAnim = this.anims.idle;
		},

		update : function(){

			if( this.owner ){
				
				var dx	= ( this.owner.size.x - this.size.x ) / 2,
					dy	= this.owner.pos.y + this.owner.size.y;

				this.pos.x = this.owner.pos.x + dx;
				if( this.pos.y < dy ){ this.pos.y = dy; }
			}
			else{
				throw new Error( "Haven't set owner. use defineOwner( owner )." );
			}
		}
	});
});






/*global ig */

ig.module(
	'plugins.camera'
)
.requires(
	'impact.entity'
)
.defines( function(){


	Camera = ig.Class.extend({

		yoffset			: 20,
		xoffset			: 15,
		limitViewport	: true,
		bounds			: undefined,

		init: function( xoffset, yoffset ) {

			this.yoffset	= yoffset || this.yoffset;
			this.xoffset	= xoffset || this.xoffset;
			this.bounds		= ig.game.spawnEntity( Bounds, 0, 200, { size : { x : this.xoffset, y : this.yoffset } } );
		},

		update : function( target, frame ){

			var t		= target,	//object that camera is following
				f		= frame,	//the canvas viewport

				tc		= { x : 0, y : 0 },
				
				rLimit	= ( f._bgMap.width * f._bgMap.tilesize ) - ig.system.width,
				bLimit	= ( f._bgMap.height * f._bgMap.tilesize ) - ig.system.height;

			if( this.bounds.pos.x > t.pos.x ){
				this.bounds.pos.x = t.pos.x;
			}
			else if( this.bounds.pos.x + this.bounds.size.x < t.pos.x + t.size.x ){
				this.bounds.pos.x = t.pos.x + t.size.x - this.bounds.size.x;
			}

			if( this.bounds.pos.y > t.pos.y ){
				this.bounds.pos.y = t.pos.y;
			}
			else if( this.bounds.pos.y + this.bounds.size.y < t.pos.y + t.size.y ){
				this.bounds.pos.y = t.pos.y + t.size.y - this.bounds.size.y;
			}

			tc.x = this.bounds.pos.x + this.bounds.size.x/2;
			tc.y = this.bounds.pos.y + this.bounds.size.y/2;

			//get the screen position
			f.screen.x = tc.x - ig.system.width/2;
			f.screen.y = tc.y - ig.system.height/2;

			if( this.limitViewport ){

				//limit screen movement so that it doesn't show black around the edges
				if( f.screen.x < 0 ){
					f.screen.x = 0;
				}
				else if( f.screen.x > rLimit ){
					f.screen.x = rLimit;
				}
				if( f.screen.y < 0 ){
					f.screen.y = 0;
				}
				else if( f.screen.y > bLimit ){
					f.screen.y = bLimit;
				}
			}
		}
	});

	Bounds = ig.Entity.extend({
		gravityFactor : 0
	});
});





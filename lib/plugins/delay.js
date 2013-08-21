ig.module (
	'plugins.delay'
)
.requires(
	'impact.timer',
	'impact.game'
)
.defines ( function() {

	Delay = ig.Class.extend({

		dx			: 3,			//delay amount
		cBCaller	: undefined,	//object to call cB on
		timer		: undefined,	//timer object
		cBArgs		: undefined,	//arguments for cB, Array!
		cB			: undefined,	//function to call
		name		: undefined,
		hasFired	: undefined,

		/* instance methods are used by the static Delay object to handle instance behavior */

		//don't use this, will throw errors.
		//use the static method Delay.delay( target, dx, callback, args ) 
		init : function( target, dx, callback, args ){

			//Must use Delay.delay( target, dx, callback, [ args ] )
			if( !Delay.shouldCreate ){
				throw new Error( "Improper Initialization : use Delay.delay( target, dx, callback, [ args ] ) to create delays." );
			}

			//delay won't initialize without these
			if( typeof target === "object" ){
				this.cBCaller = target;
			}
			else{
				throw new Error( "Improper Initialization : Specify a object for the callback to act upon. Delay.delay( >>target<<, dx, callback, [ args ] )" );
			}

			if( typeof callback === "function" ){
				this.cB = callback;
			}
			else{
				throw new Error( "Improper Initialization : You need to specify a callback function. Delay.delay( target, dx, >>callback<<, [ args ] )" );
			}

			//these have defaults
			this.dx		= dx	|| this.dx;
			this.cBArgs	= args	|| this.cBArgs;
			this.timer	= new ig.Timer( this.dx );
		},
		//update is handled by the static Delay object
		update : function(){

			if( this.timer.delta() >= 0 || this.hasFired ){

				this.cB.apply( this.cBCaller, this.cBArgs );
				this.hasFired = true;
				this.cleanup();
			}
		},
		//does whatever needed to cleanup and delete itself
		//right now just defers to removeSelfFromActiveList()
		cleanup : function(){

			this.removeSelfFromActiveList();
		},
		//Asks the Delay object to be deleted
		removeSelfFromActiveList : function(){

			Delay.cancelDelay( this.name );
		}
	});

	Delay.active		= [];
	Delay.cancelled		= [];
	Delay.shouldCreate	= false;

	//update all instances of the object
	Delay.updateActive = function(){

		var len = Delay.active.length,
			i;

		if( len === 0 ){ Delay.delayindex = 0; }

		for( i = 0; i < len; i++ ){
			Delay.active[ i ].update();
		}
		Delay.removeCancelledDelays();
	};
	//loop through all of the cancellations during the last update cycle and delete them
	Delay.removeCancelledDelays = function(){

		var len = Delay.cancelled.length,
			alen,
			i,
			j;

		for( i = 0; i < len; i++ ){

			alen = Delay.active.length;

			for( j = alen - 1; j >= 0; j-- ){

				if( Delay.cancelled[ i ] === Delay.active[ j ] || Delay.active[ j ].hasFired ){
					Delay.active.splice( j, 1 );
				}
			}
		}
		Delay.cancelled.length = 0;
	};
	//Save the cancellation until the update cycle is complete
	Delay.cancelDelay = function( delayname ){

		var len = Delay.active.length,
			i;

		for( i = 0; i < len; i++ ){

			if( Delay.active[ i ].name === delayname ){
				
				Delay.cancelled.push( Delay.active[ i ] );
				return 1;
			}
		}
		return 0;
	};
	//Static function to creat a new delay istance
	Delay.delay = function( target, dx, callback, args ){

		var newInstance;

		Delay.shouldCreate	= true;
		newInstance			= new Delay( target, dx, callback, args );
		newInstance.name	= "d" + Delay.delayindex;
		Delay.active.push( newInstance );
		Delay.delayindex ++;
		Delay.shouldCreate	= false;

		return newInstance.name;
	};
	//used for naming delays internally
	Delay.delayindex = 0;
	//updated by the game object.
	ig.Game.inject({

        update : function(){

            Delay.updateActive();
            this.parent();
        }
    });
});
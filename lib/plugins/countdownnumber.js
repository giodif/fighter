ig.module( 
    'plugins.countdownnumber'
)
.defines( function(){

    CountdownNumber = ig.Entity.extend({

        size          : { x : 49, y : 40 },
        collides      : ig.Entity.COLLIDES.NONE,
        type          : ig.Entity.TYPE.NONE,
        gravityFactor : 0,

        init : function( x, y, settings ){

            var digits = settings.count.toString().split( "" );

            this.animSheet = new ig.AnimationSheet( 'media/characters/countdown-bg.png', 49, 40 );
            this.addAnim( 'idle', 1, [ 0 ] );
            this.currentAnim = this.anims.idle;

            this.left  = new CountdownNumber( x, y, { digit : digits[ 0 ] } );
            this.right = new CountdownNumber( x, y, { digit : digits[ 1 ] } );
            
            this.parent( x, y, settings );
        },

        update : function( x, y, settings ){

            var digits = this.count.toString().split( "" );

            this.right.update( settings.digits[ 0 ] );
            this.left.update( settings.digits[ 1 ] );

            this.parent();
        }
    });



    CountdownNumber = ig.Entity.extend({

        size          : { x : 18, y : 28 },
        collides      : ig.Entity.COLLIDES.ACTIVE,
        type          : ig.Entity.TYPE.NONE,
        gravityFactor : 0,

        init : function( digit ){

            this.animSheet = new ig.AnimationSheet( 'media/fonts/countdown.png', 18, 28 );

            this.addAnim( 'digit1', 1, [ 1 ] );
            this.addAnim( 'digit2', 1, [ 2 ] );
            this.addAnim( 'digit3', 1, [ 3 ] );
            this.addAnim( 'digit4', 1, [ 4 ] );
            this.addAnim( 'digit5', 1, [ 5 ] );
            this.addAnim( 'digit6', 1, [ 6 ] );
            this.addAnim( 'digit7', 1, [ 7 ] );
            this.addAnim( 'digit8', 1, [ 8 ] );
            this.addAnim( 'digit9', 1, [ 9 ] );
            this.addAnim( 'digit0', 1, [ 0 ] );

            this.update( digit );
        },

        update : function( digit ){

            this.currentAnim = this.anims[ "digit" + digit ];
            this.parent();
        }

    });
});
        
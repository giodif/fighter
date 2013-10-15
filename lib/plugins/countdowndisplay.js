ig.module( 
    'plugins.countdowndisplay'
)
.defines( function(){

    CountdownDisplay = ig.Entity.extend({

        size          : { x : 49, y : 40 },
        staticPos     : { x : 0, y : 0 },
        right         : undefined,
        left          : undefined,
        timer         : undefined,
        collides      : ig.Entity.COLLIDES.ACTIVE,
        type          : ig.Entity.TYPE.NONE,
        gravityFactor : 0,

        init : function( x, y, settings ){

            var digits  = settings.count.toString().split( "" ),
                that    = this;

            this.animSheet = new ig.AnimationSheet( 'media/interface/countdown-bg.png', 49, 40 );
            
            this.addAnim( 'idle', 1, [ 0 ] );
            this.currentAnim = this.anims.idle;

            this.staticPos = { 
                x : ( ig.system.realWidth - this.size.x ) / 2,
                y : 20
            };

            //The lefthand digit in the counter
            this.left  = ig.game.spawnEntity(
                CountdownNumber, 0, 0,
                {
                    digit       : digits[ 0 ],
                    owner       : that,
                    ownerOffset : { x : 6, y : 6 }
                }
            );
            
            //The righthand digit in the counter
            this.right = ig.game.spawnEntity(
                CountdownNumber, 0, 0,
                {
                    digit       : digits[ 1 ],
                    owner       : that,
                    ownerOffset : { x : 25, y : 6 }
                }
            );
            
            this.parent( x, y, settings );
        },

        updateCount : function( count ){

            var digits = count.toString().split( "" ),
                temp;

            if( digits.length < 2 ){

                temp = digits[ 0 ];
                digits = [ '0', temp ];
            }

            this.left.updateDigit( digits[ 0 ] );
            this.right.updateDigit( digits[ 1 ] );
        },

        draw : function(){

            if( this.currentAnim ) {
                this.currentAnim.draw(
                    this.staticPos.x,
                    this.staticPos.y
                );
            }
        }
    });

    CountdownNumber = ig.Entity.extend({

        size          : { x : 18, y : 28 },
        collides      : ig.Entity.COLLIDES.ACTIVE,
        type          : ig.Entity.TYPE.NONE,
        owner         : undefined,
        gravityFactor : 0,

        init : function( x, y, settings ){

            this.animSheet = new ig.AnimationSheet( 'media/fonts/countdown.png', 18, 28 );

            this.addAnim( 'digit0', 1, [ 9 ] );
            this.addAnim( 'digit1', 1, [ 0 ] );
            this.addAnim( 'digit2', 1, [ 1 ] );
            this.addAnim( 'digit3', 1, [ 2 ] );
            this.addAnim( 'digit4', 1, [ 3 ] );
            this.addAnim( 'digit5', 1, [ 4 ] );
            this.addAnim( 'digit6', 1, [ 5 ] );
            this.addAnim( 'digit7', 1, [ 6 ] );
            this.addAnim( 'digit8', 1, [ 7 ] );
            this.addAnim( 'digit9', 1, [ 8 ] );

            this.updateDigit( settings.digit );
            this.parent( x, y, settings );
        },

        updateDigit : function( digit ){

            this.currentAnim = this.anims[ "digit" + digit ];
        },

        draw : function(){

            if( this.currentAnim ) {
                this.currentAnim.draw(
                    this.owner.staticPos.x + this.ownerOffset.x,
                    this.owner.staticPos.y + this.ownerOffset.y
                );
            }
        }
    });
});
        










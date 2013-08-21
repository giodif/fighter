ig.module( 
    'plugins.ai.chronicler' 
)
.requires(
    'plugins.ai.profile'
)
.defines( function(){

    //all dimensions that are used to evaluate the actions of a foe.
    //TODO: update to decide how to handle confidence, aggression and significance
    var DIMENSIONS = {
            confidence   : { VERYLOW : 0,   LOW : 1,     NEUTRAL : 2,   HIGH : 3,    VERYHIGH : 4 }, //changes the belief that a particular response move will work
            aggression   : { VERYLOW : 0.5, LOW : 1,     NEUTRAL : 1.5, HIGH : 2,    VERYHIGH : 2.5 }, //changes the probability that a response action will be defensive or aggressive
            significance : { LOWEST : 0,    VERYLOW : 1, LOW : 2,       NEUTRAL : 3, HIGH : 4, VERYHIGH : 5, HIGHEST : 6 }, //used to weigh one profile against another
            //data about horizontal position and movement in relation to the other fighter
            x : {
                pos       : { CLOSE : 0,  MID : 200,  LONG : 400 },
                direction : { TOWARD : 1, STATIC : 0, AWAY : -1 }
            },
            //data about vertical position and movement in relation to the other fighter
            y : {
                pos       : { BELOW : -1,  EVEN : 0,  ABOVE : 1 },
                direction : { FALLING : -1, STATIC : 0, RISING : 1 }
            }
        };

    Chronicler = ig.Class.extend({

        root            : window.location.protocol.replace(/\:/g,'') + "://" + window.location.host + "/",
        history         : [],
        seedHistory     : [], 
        intervalTime    : 0, //keeps a steady count of the duration of each fight round
        saveTo          : "phplib/savefighterhistory.php",
        getFrom         : "phplib/getfighterseedhistory.php",
        currentProfile  : undefined, //current record of the foe's behavior for this game tick
        lastProfile     : undefined, //last record of the foe's behavior

        //does what it says. Profiles the foe and determines whether or not
        //to save the profile to histroy based upon its uniqueness
        profile : function( bot, foe ){
            
            var dt    = ig.system.tick,
                model = {},
                //gets the position of foe in relation to the bot
                //for the pos.x value it returns a range: SHORT, MID, LONG
                //for pox.y it returns: ABOVE, EVEN, BELOW
                getStaticPositionData = function( b, f, d ){
                        
                    var pos     = {},
                        bcenter = { x : b.pos.x + ( b.size.x / 2 ),          y : b.pos.y + ( b.size.y / 2 ) },
                        fcenter = { x : f.pos.x + ( f.size.x / 2 ),          y : f.pos.y + ( f.size.y / 2 ) },
                        dist    = { x : Math.abs( bcenter.x - fcenter.x ),   y : Math.abs( bcenter.y - fcenter.y ) },
                        distvar = { x : 0, y : ( b.size.y + f.size.y ) / 4 }, //allowable variances
                        x       = d.x.pos,
                        y       = d.y.pos;

                    //get return 'x' value, this is the horizontal distance to the enemy in ranges
                    pos.x = dist.x >= x.LONG - distvar.x ? x.LONG : dist.x >= x.MID - distvar.x ? x.MID : x.CLOSE;
                    //get return 'y' value, is the enemy above the bot, below it, or even with it?
                    pos.y = dist.y < distvar.y ? pos.y = y.EVEN : bcenter.y > fcenter.y ? y.ABOVE : y.BELOW;
                    return pos;
                },
                //returns the direction foe is moving in relation to bot
                //dyn.x returns: TOWARD, STATIC, AWAY
                //dyn.y returns: FALLING, STATIC, RISING
                getDynamicPositionData = function( b, f, d ){

                    var x   = d.x.direction,
                        y   = d.y.direction,
                        dyn = {};

                    //is the foe moving toward or away from the bot?
                    dyn.x = f.vel.x === 0 ? dyn.x = x.STATIC : b.currentAnim.flip.x ? f.vel.x < 0 ? x.AWAY : x.TOWARD : f.vel.x > 0 ? x.AWAY : x.TOWARD;
                    
                    //is the foe falling, jumping or standing?
                    dyn.y = f.vel.y === 0 ? dyn.y = y.STATIC : f.vel.y > 0 ? dyn.y = y.FALLING : dyn.y = y.RISING;
                    
                    return dyn;
                },
                //If the current profile is exactly like the last profile,
                //then the only relevent piece of info is time, so don't save this profile
                shouldAddToHistory = function( l, c ){

                    var should = false,
                        current,
                        last;
                    
                    if( l === undefined ){
                        should = true;
                    }
                    else{

                        last    = l.toObj();
                        current = c.toObj();

                        if( 
                            current.pos.x       !== last.pos.x ||
                            current.direction.x !== last.direction.x ||
                            current.pos.y       !== last.pos.y ||
                            current.direction.y !== last.direction.y ||
                            current.state       !== last.state /*||
                            current.stateType !== last.stateType ||
                            current.standing !== last.standing*/
                        ){
                            should = true;
                        }
                    }
                    return should;
                };

            this.intervalTime += dt;

            model = {
                pos         : getStaticPositionData( bot, foe, DIMENSIONS ),
                direction   : getDynamicPositionData( bot, foe, DIMENSIONS ),
                state       : foe._manager.current(),
                stateType   : foe._manager.currentType(),
                chainCount  : foe.attackChain,
                delta       : Math.round( ( this.intervalTime - ( this.lastProfile !== undefined ? this.lastProfile.dimensions.time : 0 ) ) * 1000 ) / 1000,
                time        : Math.round( this.intervalTime * 1000 ) / 1000,
                standing    : foe.standing
            };

            this.currentProfile = new PROFILE( model );

            if( shouldAddToHistory( this.lastProfile, this.currentProfile ) ){

                this.lastProfile = this.currentProfile;
                this.history.push( this.currentProfile ); //or this.currentProfile.toString();
            }

            return this.currentProfile;
        },
        
        //zeros out the history and intervalTime
        reset : function(){

            HISTORY.length = this.intervalTime = 0;
        },

        //returns the history array
        getHistory : function(){
        
            return this.history.length > 0 ? this.history : 0;
        },
        
        //parses returns the seedHistory if it exists,
        //returns the currently accumulating history if it does not
        getSeedHistory: function(){

            return this.seedHistory.length > 0 ? this.seedHistory : this.history;
        },
        
        //grabs a complete history from the server
        loadSeedHistory : function( identifier ){

            var that = this,
                data = { name : identifier };
            
            $.post(
                this.getFrom,
                data,
                function( a ){

                    var models = JSON.parse( a ),
                        len    = models.length,
                        i      = 0;

                    for( ; i < len; i++ ){

                        that.seedHistory[ i ] = new PROFILE( models[ i ] );
                    }
                }
            );
        },

        //saves history to the server
        saveHistory : function( identifier ){

            var that     = this,
                profiles = [],
                history  = this.getHistory(),
                len      = history.length,
                form,
                i;

            for( i = 0; i < len; i++ ){
                profiles.push( history[ i ].dimensions );
            }

            form = $( '<form>', {
                'action' : this.saveTo,
                'method' : 'post'
            }).append( $( '<input>', {
                'type'  : 'hidden',
                'name'  : 'history',
                'value' : JSON.stringify({ 'name' : identifier, 'history' : profiles })
            }));

            //$( "body" ).append( form );

            //console.log( form );
            form.submit();
        }
    });
});

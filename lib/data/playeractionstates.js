ig.module( 
    'data.playeractionstates' 
)
.defines( function(){

    /*
        STATES :
            prepping,
            neutral,
            attacking,
            blocking,
            injured,
            stunned,
            knockeddown,
            gettingup,
            victorious,
            defeated

        EVENTS:
            start,
            relax,
            stun,
            attack,
            block,
            wound,
            knockdown,
            getup,
            lose,
            restart,  
    */

    PlayerActionStates = {
        
        events : [
            {
                name    : "start",
                from    : "none",
                to      : "prepping"
            },{
                name    : "relax",
                from    : [ "prepping", "attacking", "blocking", "resetting", "injured", "stunned", "knockeddown", "gettingup" ],
                to      : "neutral"
            },{
                name    : "stun",
                from    : [ "neutral", "attacking", "blocking" ],
                to      : "stunned"
            },{
                name    : "attack",
                from    : "neutral",
                to      : "attacking"
            },{
                name    : "block",
                from    : "neutral",
                to      : "victorious"
            },{
                name    : "wound",
                from    : [ "neutral", "attacking", "blocking", "stunned" ],
                to      : "injured"
            },{
                name    : "knockdown",
                from    : [ "neutral", "attacking", "blocking", "stunned", "injured" ],
                to      : "knockeddown"
            },{
                name    : "getup",
                from    : "knockeddown",
                to      : "gettingup"
            },{
                name    : "lose",
                from    : [ "neutral", "attacking", "blocking", "stunned", "injured" ],
                to      : "defeated"
            },{
                name    : "restart",
                from    : "victorious",
                to      : "prepping"
            },{
                name    : "restart",
                from    : "defeated",
                to      : "prepping"
            }
        ],
        callbacks: {

            onattack : function( event, from, to, msg ){ console.log( "attacking" ); }
        }
    };
});
        
ig.module( 
    'data.playermovementstates' 
)
.defines( function(){

    /*
    idling,
    advancing,
    retreating,
    jumping,
    falling,
    crouching
    */
    
    PlayerMovementStates = {
                
        events : [
            {
                name    : "start",
                from    : "none",
                to      : "idling"
            },{
                name    : "reset",
                from    : [ "advancing", "retreating", "falling", "crouching" ],
                to      : "idling"
            },{
                name    : "jump",
                from    : [ "idling", "airadvancing", "airretreating" ],
                to      : "jumping"
            },{
                name    : "fall",
                from    : "jumping",
                to      : "falling"
            },{
                name    : "crouch",
                from    : [ "idling", "advancing", "retreating" ],
                to      : "crouching"
            },{
                name    : "advance",
                from    : "idling",
                to      : "advancing"
            },{
                name    : "advance",
                from    : "jumping",
                to      : "airadvancing"
            },{
                name    : "retreat",
                from    : "idling",
                to      : "retreating"
            },{
                name    : "retreat",
                from    : "jumping",
                to      : "airretreating"
            }
        ]
    };
});
        
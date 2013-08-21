ig.module( 
    'data.playerweapons' 
)
.defines( function(){

    PlayerWeapons = [
        {
            name            : 'hardpunch',
            attackStrength  : 30,
            slowdown        : false,
            ownerOffset     : { x : 30, y : 0 },
            size            : { x : 10, y : 10 },
            delay           : 0.2  
        },
        {
            name            : 'mediumpunch',
            attackStrength  : 20,
            slowdown        : false,
            ownerOffset     : { x : 35, y : 30 },
            size            : { x : 10, y : 10 },
            delay           : 0.2  
        },
        {
            name            : 'lightpunch',
            attackStrength  : 10,
            slowdown        : false,
            ownerOffset     : { x : 45, y : 20 },
            size            : { x : 10, y : 10 },
            delay           : 0.2  
        },
        {
            name            : 'hardkick',
            attackStrength  : 30,
            slowdown        : false,
            ownerOffset     : { x : 70, y : 10 },
            size            : { x : 10, y : 10 },
            delay           : 0.2  
        },
        {
            name            : 'mediumkick',
            attackStrength  : 20,
            slowdown        : false,
            ownerOffset     : { x : 50, y : 50 },
            size            : { x : 10, y : 10 },
            delay           : 0.2  
        },
        {
            name            : 'lightkick',
            attackStrength  : 10,
            slowdown        : false,
            ownerOffset     : { x : 55, y : 60 },
            size            : { x : 10, y : 10 },
            delay           : 0.2  
        }
    ];
});
        
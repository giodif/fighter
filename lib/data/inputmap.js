ig.module( 
    'data.inputmap' 
)
.defines( function(){

    //basic player movement. same for all player characters, not for bots
    LizardMap = [
        { name : 'jump',         key : 'W',             type : 'movement'   },
        { name : 'crouch',       key : 'S',             type : 'movement'   },
        { name : 'left',         key : 'A',             type : 'movement'   },
        { name : 'right',        key : 'D',             type : 'movement'   },
        { name : 'lightpunch',   key : 'LEFT_ARROW',    type : 'attack'     },
        { name : 'hardpunch',    key : 'UP_ARROW',      type : 'attack'     },
        { name : 'lightkick',    key : 'DOWN_ARROW',    type : 'attack'     },
        { name : 'hardkick',     key : 'RIGHT_ARROW',   type : 'attack'     }
    ];


    //Map for the BotLizard AI
    BotLizardMap = {
        inputs : [
            { name : 'jump',    and : [ 'left', 'right' ] },
            { name : 'crouch',  and : [ 'left', 'right' ] },
            { name : 'left',    and : [ 'crouch', 'jump' ] },
            { name : 'right',   and : [ 'crouch', 'jump' ] }
        ],

        //list of possible states and the states that it can transition to
        actions : {
            
            'neutral' :              { from : [ 'prepping','highblow','lowblow','highblock','lowblock','lightpunch','cross','uppercut','hardpunch','shoryuken','supershoryuken','hardkick','tatsumakisenpuukyaku','hadoken','superhadoken' ], to : 'neutral' },
            'default' :              { from : [ 'none' ],                  to : 'prepping' },
            'reset' :                { from : [ 'victorious','defeated' ], to : 'prepping' },
            'lose' :                 { from : [ 'neutral' ],               to : 'defeated' },
            'win' :                  { from : [ 'neutral' ],               to : 'victorious' },
            'highblow' :             { from : [ 'neutral' ],               to : 'highblow' },
            'lowblow' :              { from : [ 'neutral' ],               to : 'lowblow' },
            'highblock' :            { from : [ 'neutral' ],               to : 'highblock' },
            'lowblock' :             { from : [ 'neutral' ],               to : 'lowblock' },
            'lightpunch' :           { from : [ 'neutral' ],               to : 'lightpunch' },
            'cross' :                { from : [ 'lightpunch' ],            to : 'cross' },
            'uppercut' :             { from : [ 'cross','lightpunch' ],    to : 'uppercut' },
            'hardpunch' :            { from : [ 'neutral' ],               to : 'hardpunch' },
            'shoryuken' :            { from : [ 'neutral' ],               to : 'shoryuken' },
            'supershoryuken' :       { from : [ 'neutral' ],               to : 'supershoryuken' },
            'lightkick' :            { from : [ 'neutral' ],               to : 'lightkick' },
            'mediumkick' :           { from : [ 'lightkick' ],             to : 'mediumkick' },
            'hardkick' :             { from : [ 'neutral' ],               to : 'hardkick' },
            'tatsumakisenpuukyaku' : { from : [ 'neutral' ],               to : 'tatsumakisenpuukyaku' },
            'hadoken' :              { from : [ 'neutral' ],               to : 'hadoken' },
            'superhadoken' :         { from : [ 'neutral' ],               to : 'superhadoken' }
        },

        //can 'currentState' transition to 'nextState'? returns a BOOL
        can : function( currentState, nextState ){

            var allowed = this.actions[ nextState ].from,
                len     = allowed.length,
                i       = 0;

            for( ; i < len; i++ ){
                if( allowed[ i ] === currentState ){
                    return true;
                }
            }
            return false;
        },

        //can an input be given at the same time as another? returns a BOOL
        // for instance: can 'Jump' and 'Crouch' happen at the same time? No, returns false
        and : function( currentInput, otherInput ){

            var allowed = this.inputs[ otherInput ].and,
                len     = allowed.length,
                i       = 0;

            for( ; i < len; i++ ){
                if( allowed[ i ] === currentInput ){
                    return true;
                }
            }
            return false;
        }
    };
});
        
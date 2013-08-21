ig.module( 
    'plugins.ai.profile' 
)
.defines( function(){

    PROFILE = ig.Class.extend({

        dimensions : undefined,

        init : function( obj ){

            if( obj !== undefined && obj !== null ){
                if( Object.prototype.toString.call( obj ) == '[object String]' ){
                    this.fromString( obj );
                }
                else{
                    this.fromObj( obj );
                }
            }
        },
        fromString : function( newstring ){

            var arr = newstring.split( ',' );
            
            this.dimensions = {
                pos          : { x : arr[ 0 ], y : arr[ 1 ] }, //in relation to the bot, where in space is the fighter
                direction    : { x : arr[ 2 ], y : arr[ 3 ] }, //in relation to the bot, what direction is the fighter moving
                state        : arr[ 4 ], //name of state as provided by the _manager
                stateType    : arr[ 5 ], //attack, defense, neutral, inactive etc.
                chainCount   : arr[ 6 ], //is the attack part of an attack chain ie: unblockable
                delta        : arr[ 7 ], //time since the last recorded profile
                time         : arr[ 8 ],  //time since the beginning of the fight
                standing     : arr[ 9 ]
            };

            return this.dimensions;
        },
        toString : function(){

            var str =  this.dimensions.pos.x + ",";
                str += this.dimensions.pos.y + ",";
                str += this.dimensions.direction.x + ",";
                str += this.dimensions.direction.y + ",";
                str += this.dimensions.state + ",";
                str += this.dimensions.stateType + ",";
                str += this.dimensions.chainCount + ",";
                str += this.dimensions.delta + ",";
                str += this.dimensions.time + ",";
                str += this.dimensions.standing;
            
            return str;
        },
        fromObj : function( newobj ){
        
            this.dimensions = newobj;   
            return this.dimensions;
        },
        toObj : function(){
        
            return this.dimensions;
        }
    });
});
        
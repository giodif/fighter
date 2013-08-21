ig.module( 
    'plugins.ai.filter'
)
.requires(
    'plugins.ai.event'
)
.defines( function(){

    var WEIGHTMAP = {
            pos         : { x : 3, y : 2 },
            direction   : { x : 4, y : 3 },
            state       : 2,
            stateType   : 3,
            chainCount  : 1
        };

    FILTER = ig.Class.extend({

        events               : [],
        compatibilityQuotent : 8,
        historyIndex         : -1,
        weightMap            : undefined,
        spread               : undefined,

        init : function( weightMap, spread ){

            this.weightMap = weightMap || WEIGHTMAP;
            this.spread    = spread || 5;
        },
        findSimilarProfiles : function( instance, history ){

            var i,
                ret,
                len = history.length - 1,
                e   = [];

            if( history.length > this.historyIndex ){
                
                this.historyIndex = len + 1;

                for( i = 0; i < len; i++ ){       
                    if( this.isSimilarTo( instance, history[ i ] ) ){
                    
                        e.push( this.constructEvent( i, history ) );
                        i += ( this.spread - 1 );
                    }
                }
                ret = this.events = e.length <= 0 ? this.events : e;
            }
            return ret;
        },
        //is a profile 'self' similar to another profile 'other'? 
        //is a product returns a BOOl that depends on the sum of values
        //determined by the weightMap
        isSimilarTo : function( instance, other ){
            
            var s   = instance.dimensions,  //instance in object form
                o   = other.dimensions,     //other in object form //or ( AI.PROFILE( other ) ).dimensions,
                map = this.weightMap,       //cache the weightmap
                val = 0,                    //comparison value
                p, pp;                      //placeholder for property keys

            for( p in map ){
                if( map.hasOwnProperty( p ) ){

                    if( Object( map[ p ] ) &&
                        typeof map[ p ] !== "string" &&
                        typeof map[ p ] !== "number"
                    ){
                        for( pp in map[ p ] ){
                            if( map[ p ].hasOwnProperty( pp ) ){
                                val += s[ p ][ pp ] == o[ p ][ pp ] ? map[ p ][ pp ] : map[ p ][ pp ] * -1;
                            }
                        }
                    }
                    else{
                        val += s[ p ] == o[ p ] ? map[ p ] : map[ p ] * -1;
                    }
                }
            }
            return ( val / this.compatibilityQuotent ) >= 1;
        },
        //Neighbors to a particular profile are other profiles that, chronologically
        //precede and follow the profile in question. These neighbors are packaged with the
        //profile to form an 'event'
        constructEvent : function( eventKey, history ){

            var lowbound      = eventKey - this.spread > 0 ? eventKey - this.spread : 0,
                highbound     = eventKey + this.spread >= history.length ? history.length - 1 : eventKey + this.spread,
                eventProfiles = [],
                i;

            for( i = lowbound; i <= highbound; i++ ){
                eventProfiles.push( history[ i ] );
            }
            return new EVENT( eventKey, eventProfiles );
        }
    });
});
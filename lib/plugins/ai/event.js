ig.module( 
    'plugins.ai.event' 
)
.defines( function(){

    //collection of profiles
    EVENT = ig.Class.extend({

        eventkey : undefined,
        profiles : undefined,

        init : function( key, profiles ){

            this.eventkey = key || 0;
            this.profiles = profiles || [];

            if( this.profiles.length === 0 ){ return undefined; }
        },
        getPast : function(){

            var i   = 0,
                arr = [];

            for( ; i < this.eventkey ; i++ ){
                arr.push( this.profiles[ i ] );
            }
            return arr;
        },
        getFuture : function(){
            
            var i   = this.eventkey + 1,
                len = this.profiles.length,
                arr = [];

            for( ; i < len ; i++ ){
                arr.push( this.profiles[ i ] );
            }
            return arr;
        },
        getKeyEvent : function(){
            
            return this.profiles[ this.eventkey ];
        }
    });
});

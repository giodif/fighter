ig.module( 
    'plugins.nativeextensions' 
)
.defines( function(){

    Array.prototype.isEqualTo = function ( compareTo ){
          
        var that    = this,
            length  = that.length,
            i;
          
        if( length !== compareTo.length ){
            
            return false; // compare numbers, strict equalty isn't necessary
        }
        for( i = 0; i < length; i++ ){

            if( that[ i ] !== compareTo[ i ] ){
             
                return false;
            }
        }
          
        return true;
    };
    Array.prototype.unique = function() {
        
        var i, j, a = this.concat();
        
        for( i = 0; i < a.length; ++i ){
        
            for( j = i + 1 ; j < a.length; ++j){
        
                if( a[ i ] === a[ j ] ){
        
                    a.splice( j--, 1 ); 
                }
            }
        }
        return a;
    };
});
        
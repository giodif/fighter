ig.module( 
    'injections.entityfaceother' 
)
.requires(
    'impact.entity'
)
.defines( function(){

    ig.Entity.inject({
        faceOther : function( other ){
            return this.pos.x > other.pos.x;
        }
    });
});
        
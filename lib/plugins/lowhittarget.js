ig.module( 
    'plugins.lowhittarget' 
)
.requires(
    'plugins.hittarget'
)
.defines( function(){

    LowHitTarget = HitTarget.extend({

        name : "low",

        move : function(){

            this.parent();
            this.pos.y = this.entity.pos.y + this.entity.size.y / 2;
        }
    });
});
        
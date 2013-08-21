ig.module( 
	'plugins.settingsmap' 
)
.requires(
	'data.settings'
)
.defines( function(){

	SettingsMap = ig.Class.extend({

		get : function( modename ){

			var m = modename || "default",
                s = SettingsMap.settings[ m ],
				n = ig.copy( s );
				
			return n;
		} 
	});

	SettingsMap.settings = Settings;
});
		
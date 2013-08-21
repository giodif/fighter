ig.module(
    'game.entities.lizard'
)
.requires(
    'data.inputmap',
    'impact.entity',
    'plugins.delay',
    'plugins.inputbuffer',
    'plugins.keysequence',
    'plugins.hittarget',
    'plugins.lowhittarget',
    'plugins.statemachine.deferredupdatemanager',
    'plugins.statemachine.deferredupdate',
    'plugins.statemachine.deferredupdates.generic.hardkick',
    'plugins.statemachine.deferredupdates.generic.highblock',
    'plugins.statemachine.deferredupdates.generic.highblow',
    'plugins.statemachine.deferredupdates.generic.jumphardkick',
    'plugins.statemachine.deferredupdates.generic.jumphardpunch',
    'plugins.statemachine.deferredupdates.generic.jumplightpunch',
    'plugins.statemachine.deferredupdates.generic.lowblock',
    'plugins.statemachine.deferredupdates.generic.lowblow',
    'plugins.statemachine.deferredupdates.generic.lowlightkick',
    'plugins.statemachine.deferredupdates.generic.neutral',
    'plugins.statemachine.deferredupdates.generic.prepping',
    'plugins.statemachine.deferredupdates.generic.victorious',
    'plugins.statemachine.deferredupdates.generic.getup',
    'plugins.statemachine.deferredupdates.lizard.defeated',
    'plugins.statemachine.deferredupdates.lizard.knockdown',
    'plugins.statemachine.deferredupdates.lizard.lightpunch',
    'plugins.statemachine.deferredupdates.lizard.hardpunch',
    'plugins.statemachine.deferredupdates.lizard.jumplightkick',
    'plugins.statemachine.deferredupdates.lizard.lowhardkick',
    'plugins.statemachine.deferredupdates.lizard.lowhardpunch',
    'plugins.statemachine.deferredupdates.lizard.lowlightpunch',
    'plugins.statemachine.deferredupdates.lizard.cross',
    'plugins.statemachine.deferredupdates.lizard.uppercut',
    'plugins.statemachine.deferredupdates.lizard.shoryuken',
    'plugins.statemachine.deferredupdates.lizard.supershoryuken',
    'plugins.statemachine.deferredupdates.lizard.lightkick',
    'plugins.statemachine.deferredupdates.lizard.mediumkick',
    'plugins.statemachine.deferredupdates.lizard.tatsumakisenpuukyaku',
    'plugins.statemachine.deferredupdates.lizard.hadoken',
    'plugins.statemachine.deferredupdates.lizard.superhadoken',
    'game.entities.shadow'
)
.defines(function (){

    EntityLizard = ig.Entity.extend({

        name            : "player",
        identifier      : "lizard",
        health          : 1000,
        size            : { x : 40,   y : 150  },
        offset          : { x : 100,  y : 57   },
        maxVel          : { x : 400,  y : 1000 },
        friction        : { x : 2000, y : 0    },
        jump            : -900,
        gaccel          : 400,
        zIndex          : 10000,
        collides        : ig.Entity.COLLIDES.ACTIVE,
        type            : ig.Entity.TYPE.NONE,
        attackChain     : 0,
        highHitTarget   : undefined,
        lowHitTarget    : undefined,
        foe             : undefined,
        _manager        : undefined, //handles player state and deferred update objects
        _inputbuffer    : undefined, //interprets key combos and spits out the string name of a combo if it is sucessfully completed
        _shadow         : undefined, //visual entity just to create the player's shadow
        _hittargets     : undefined, //three objects that represent the player's vulnerable areas: head, torso, legs
        _attack         : undefined, //string that is set by the input buffer whenever a key combination is successfully completed

        init : function( x, y, settings ){
            
            this.parent( x, y, settings );
            this.setup();
        },
        setup : function(){
            
            this._inputbuffer   = new InputBuffer( LizardMap, [ { 'listener' : this, 'func' : 'defineAttack' } ] );
            this.utilitySetup();    
        },
        utilitySetup : function(){

            this.animSheet      = new ig.AnimationSheet( 'media/characters/lizard.png', 240, 240 );
            this._manager       = new DeferredUpdateManager( this );
            
            this._makeHitTargets();             //makes hittargets if not in weltmeister
            this._makeShadow();                 //makes a shadow if not in weltmeister
            this._initAnimations();             //visual animation stuff
            this._addDeferredsToInputManager(); //adds all the DeferredUpdate objects to the updateManager
            this._addInputBufferSequences();    //adds KeySequences, identifiers, and timeout values
        },
        update : function(){

            this._inputbuffer.update(); //InputBuffer doesn't update itself, has to be added to the update cycle by it's owner
            this._manager.update();     //defers all update stuff to the manager
            this.hittarget.move();
            this.lowhittarget.move(); 
        },
        //only lower the health, the deferred updates will deal with everything else
        receiveDamage: function( amount, from ){

            if( amount !== undefined && amount > 0 ){
                this.health -= amount;
            }
        },
        //the input buffer calls this function when it needs to notify the player of a successfully completed input sequence
        defineAttack : function( attack ){ this._attack = attack; },


        isBlocking : function(){
            this.hittarget.isBlocking();
            this.lowhittarget.isBlocking();
        },
        isInvincible : function(){
            this.hittarget.isInvincible();
            this.lowhittarget.isInvincible();
        },
        isVulnerable : function(){   
            this.hittarget.isVulnerable();
            this.lowhittarget.isVulnerable();
        },


        toBack : function(){
            this.zIndex = 8000;
            ig.game.sortEntitiesDeferred();
        },
        toMiddle : function(){
            this.zIndex = 10000;
            ig.game.sortEntitiesDeferred();
        },
        toFront : function(){
            this.zIndex = 12000;
            ig.game.sortEntitiesDeferred();
        },


        //helper functions to setup stuff, not really functions, just more organized and easier to read
        _makeHitTargets : function(){

            if( !ig.global.wm ){
                this.hittarget    = ( ig.game.spawnEntity( HitTarget, 0, 0 ) ).registerEntity( this );
                this.lowhittarget = ( ig.game.spawnEntity( LowHitTarget, 0, 0 ) ).registerEntity( this );
            }
        },
        _makeShadow : function(){
            if( !ig.global.wm ){
                this._shadow = ig.game.spawnEntity( EntityShadow, this.pos.x, this.pos.y + this.size.y );
                this._shadow.defineOwner( this );
            }
        },
        //creates animation sequences
        _initAnimations : function(){

            //visual animations for everything
            this.addAnim( 'idle',           0.08, [ 1,2,3,4,3,2 ] );
            this.addAnim( 'walk',           0.1,  [ 7,8,9,10,11,12 ] );
            this.addAnim( 'crouch',         0.2,  [ 13 ] );
            this.addAnim( 'prepping',       0.15, [ 28,29,29,30,31,32,31,32,0,1 ], true );
            this.addAnim( 'victorious',     0.15, [ 33,34,35,36,35,34,35,36,35,34,35,36,35,34,35,36,35,34,35,36,35,34 ] );
            this.addAnim( 'defeatedrise',   0.15, [ 79,80 ], true );
            this.addAnim( 'defeatedfall',   0.15, [ 81,82 ], true );
            this.addAnim( 'defeatedcrash',  0.15, [ 83,84,85,84,85 ], true );
            this.addAnim( 'knockdowncrash', 0.15, [ 83,84,85,85,85 ], true );
            this.addAnim( 'getup',          0.07, [ 13,14,15,16 ], true );
            this.addAnim( 'jump',           0.1,  [ 14 ] ); //rising
            this.addAnim( 'float',          0.2,  [ 15,16 ] ); //peaking
            this.addAnim( 'fall',           0.1,  [ 17 ] ); //falling
            this.addAnim( 'highblow',       0.08, [ 58,59,60,59,58 ], true ); //received damage to upper body
            this.addAnim( 'lowblow',        0.08, [ 56,57,57,56 ], true ); //received damage to lower body
            this.addAnim( 'lowblock',       0.1,  [ 62 ] ); //crouching
            this.addAnim( 'highblock',      0.1,  [ 61 ] ); //standing
            
            this.addAnim( 'lowlightkick',   0.07, [ 66,67,67,66 ], true ); //crouching
            this.addAnim( 'lowhardkick',    0.1,  [ 72,71,70,69,68 ], true ); //crouching
            this.addAnim( 'jumplightkick',  0.06, [ 76,77,78,78,77 ], true ); //jumping
            this.addAnim( 'jumphardkick',   0.1,  [ 76,77,78,78,77 ], true ); //jumping
            this.addAnim( 'lightkick',      0.05, [ 10,11,21,22,22,21 ], true ); //standing
            this.addAnim( 'mediumkick',     0.08, [ 33,54,18,23,24,25,26,27,18 ], true ); //standing
            this.addAnim( 'hardkick',       0.12, [ 18,27,26,25,24,23,54,33 ], true ); //standing
            this.addAnim( 'tetjump',        0.08, [ 52,53,54,55 ], true ); //rising, falling
            this.addAnim( 'tetspin',        0.04, [ 48,49,50,51 ] ); //horizontal spinning movement
            this.addAnim( 'lowlightpunch',  0.1,  [ 73,74,75,74,73 ], true ); //crouching
            this.addAnim( 'lowhardpunch',   0.1,  [ 73,74,75,74,73 ], true ); //crouching
            this.addAnim( 'jumplightpunch', 0.06, [ 64,63,65,65,63,64 ], true ); //jumping
            this.addAnim( 'jumphardpunch',  0.1,  [ 64,63,65,65,63,64 ], true ); //jumping
            this.addAnim( 'lightpunch',     0.08, [ 19,20,19 ], true ); //standing
            this.addAnim( 'cross',          0.07, [ 5,18,6,6,18,5 ], true ); //standing
            this.addAnim( 'uppercut',       0.06, [ 37,38,38,38,38,37 ], true ); //standing
            this.addAnim( 'shoryuken',      0.1,  [ 37,38,39,40,41,42,37 ], true ); //standing
            this.addAnim( 'hadoken',        0.15, [ 43,44,45,46,47,46,47,46,45,44 ], true ); //standing
            
            this.currentAnim = this.anims.idle;
        },
        //the manager needs to register all of the the update objects that will update the player based upon the current state
        //the identifier for each deferredUpdate should match the name of a particular state ie. 'prepping' will be awakened by the 'prepping' state    
        _addDeferredsToInputManager : function(){

            var inactive    = DeferredUpdate.types.INACTIVE,
                neutral     = DeferredUpdate.types.NEUTRAL,
                defense     = DeferredUpdate.types.DEFENSE,
                injured     = DeferredUpdate.types.INJURED;

            //the identifiers and the objects don't don't need to match in name,
            //I just did this way because it was easier= 'foo' could be the identifier for new Bar()
            this._manager.addDeferred( 'prepping',              new Prepping( inactive ) );
            this._manager.addDeferred( 'hardkick',              new Hardkick() );
            this._manager.addDeferred( 'highblock',             new Highblock( defense ) );
            this._manager.addDeferred( 'highblow',              new Highblow( injured ) );
            this._manager.addDeferred( 'jumplightpunch',        new Jumplightpunch() );
            this._manager.addDeferred( 'jumphardkick',          new Jumphardkick() );
            this._manager.addDeferred( 'jumphardpunch',         new Jumphardpunch() );
            this._manager.addDeferred( 'lowblock',              new Lowblock( defense ) );
            this._manager.addDeferred( 'lowblow',               new Lowblow( injured ) );
            this._manager.addDeferred( 'lowlightkick',          new Lowlightkick() );
            this._manager.addDeferred( 'neutral',               new Neutral( neutral ) );
            this._manager.addDeferred( 'victorious',            new Victorious( inactive ) );
            this._manager.addDeferred( 'getup',                 new Getup( injured ) );

            this._manager.addDeferred( 'defeated',              new Lizarddefeated( inactive ) );
            this._manager.addDeferred( 'knockdown',             new Lizardknockdown( inactive ) );
            this._manager.addDeferred( 'lightpunch',            new Lizardlightpunch() );
            this._manager.addDeferred( 'cross',                 new Lizardcross() );
            this._manager.addDeferred( 'uppercut',              new Lizarduppercut() );
            this._manager.addDeferred( 'hardpunch',             new Lizardhardpunch() );
            this._manager.addDeferred( 'shoryuken',             new Lizardshoryuken() );
            this._manager.addDeferred( 'supershoryuken',        new Lizardsupershoryuken() );
            this._manager.addDeferred( 'jumplightkick',         new Lizardjumplightkick() );
            this._manager.addDeferred( 'lightkick',             new Lizardlightkick() );
            this._manager.addDeferred( 'lowhardkick',           new Lizardlowhardkick() );
            this._manager.addDeferred( 'lowhardpunch',          new Lizardlowhardpunch() );
            this._manager.addDeferred( 'lowlightpunch',         new Lizardlowlightpunch() );
            this._manager.addDeferred( 'mediumkick',            new Lizardmediumkick() );
            this._manager.addDeferred( 'tatsumakisenpuukyaku',  new Lizardtatsumakisenpuukyaku() );
            this._manager.addDeferred( 'hadoken',               new Lizardhadoken() );
            this._manager.addDeferred( 'superhadoken',          new Lizardsuperhadoken() );
        },
        _addInputBufferSequences : function(){
            //Complex Attacks - Multi Key
            this._inputbuffer.addSequence( new KeySequence( "hadokenright",                 "S,S+D,D,D+LEFT_ARROW",         0.4 ) );
            this._inputbuffer.addSequence( new KeySequence( "hadokenleft",                  "S,S+A,A,A+LEFT_ARROW",         0.4 ) );
            this._inputbuffer.addSequence( new KeySequence( "shoryukenright",               "A,A+S,S,S+D,D,D+LEFT_ARROW",   0.5 ) );
            this._inputbuffer.addSequence( new KeySequence( "shoryukenleft",                "D,D+S,S,S+A,A,A+LEFT_ARROW",   0.5 ) );
            this._inputbuffer.addSequence( new KeySequence( "tatsumakisenpuukyakuright",    "S,S+A,A,A+RIGHT_ARROW",        0.4 ) );
            this._inputbuffer.addSequence( new KeySequence( "tatsumakisenpuukyakuleft",     "S,S+D,D,D+RIGHT_ARROW",        0.4 ) );

            this._inputbuffer.addSequence( new KeySequence( "superhadokenright",            "S,S+D,D,D+UP_ARROW",           0.4 ) );
            this._inputbuffer.addSequence( new KeySequence( "superhadokenleft",             "S,S+A,A,A+UP_ARROW",           0.4 ) );
            this._inputbuffer.addSequence( new KeySequence( "supershoryukenright",          "A,A+S,S,S+D,D,D+UP_ARROW",     0.5 ) );
            this._inputbuffer.addSequence( new KeySequence( "supershoryukenleft",           "D,D+S,S,S+A,A,A+UP_ARROW",     0.5 ) );
        }
    });
});






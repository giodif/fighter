ig.module(
    'game.entities.crank'
)
.requires(
    'plugins.statemachine.deferredupdates.generic.jumphardpunch',
    'plugins.statemachine.deferredupdates.generic.jumplightkick',

    'plugins.statemachine.deferredupdates.crank.cannonballforward',
    'plugins.statemachine.deferredupdates.crank.cannonballupward',
    'plugins.statemachine.deferredupdates.crank.cannonballdiagonal',
    'plugins.statemachine.deferredupdates.crank.defeated',
    'plugins.statemachine.deferredupdates.crank.hardpunch',
    'plugins.statemachine.deferredupdates.crank.jumphardkick',
    'plugins.statemachine.deferredupdates.crank.lightkick',
    'plugins.statemachine.deferredupdates.crank.lightpunch',
    'plugins.statemachine.deferredupdates.crank.lowlightkick',
    'plugins.statemachine.deferredupdates.crank.mediumkick',
    'plugins.statemachine.deferredupdates.crank.mediumpunch',
    'plugins.statemachine.deferredupdates.crank.strongcharge',
    'plugins.statemachine.deferredupdates.crank.weakcharge',
    'game.entities.shadow',
    'game.entities.lizard'
)
.defines(function (){

    EntityCrank = EntityLizard.extend({

        identifier : "crank",
        size       : { x : 70,   y : 140 },
        offset     : { x : 120,  y : 100 },
        health     : 1100,

        setup : function(){ //called by init method

            this.animSheet      = new ig.AnimationSheet( 'media/characters/crank.png', 320, 320 );
            this._inputbuffer   = new InputBuffer( InputMap, [ { 'listener' : this, 'func' : 'defineAttack' } ] );
            this._manager       = new DeferredUpdateManager( this );
            this.utilitySetup(); //See EntityLizard for details
        },


        //creates animation sequences
        _initAnimations : function(){

            this.addAnim( 'idle',           0.1,  [ 0,1,2,2,1,0 ] );
            this.addAnim( 'walk',           0.1,  [ 3,4,5,6,7,6,5,4 ] );
            this.addAnim( 'highblow',       0.1,  [ 46,45,46 ], true );
            this.addAnim( 'lowblow',        0.1,  [ 47,48,49,48,47 ], true );
            this.addAnim( 'jump',           0.1,  [ 8,12,12,12,12 ] ); //needs more frames
            this.addAnim( 'float',          0.2,  [ 9 ] );
            this.addAnim( 'fall',           0.1,  [ 12,8,8,8,8,8 ] ); //needs more frames
            this.addAnim( 'highblock',      0.1,  [ 58 ] );
            this.addAnim( 'lowblock',       0.1,  [ 59 ] );
            this.addAnim( 'crouch',         0.25, [ 11,67,10,67 ] );
            this.addAnim( 'prepping',       0.2,  [ 58,59,66,67,58,59,66,67 ], true );
            this.addAnim( 'defeated',       0.1,  [ 47,48,49,47,48,47,46,45,50,51,52,53,54 ], true );
            this.addAnim( 'victory',        0.1,  [ 55,55,56,57,56,57,56,57,56,57 ], true );
            this.addAnim( 'lightpunch',     0.05, [ 16,15,14,15,16 ], true );
            this.addAnim( 'mediumpunch',    0.08, [ 19,17,18,19 ], true );
            this.addAnim( 'hardpunch',      0.12, [ 19,20,21,22,21,20 ], true );
            this.addAnim( 'lowlightpunch',  0.1,  [ 64,65,66,65,64 ], true );
            this.addAnim( 'lowhardpunch',   0.25, [ 31,32,32,31 ], true );
            this.addAnim( 'jumplightpunch', 0.06, [ 60,61,62,63,63 ], true );
            this.addAnim( 'jumphardpunch',  0.12, [ 60,61,62,63,63 ], true );
            this.addAnim( 'lightkick',      0.08, [ 23,24,23 ], true );
            this.addAnim( 'mediumkick',     0.08, [ 8,13,13,12,8 ], true ); //needs more frames
            this.addAnim( 'hardkick',       0.08, [ 12,9,27,28,29,30,31 ], true );
            this.addAnim( 'lowlightkick',   0.09, [ 33,34,35,34,33 ], true );
            this.addAnim( 'lowhardkick',    0.15, [ 25,26,25 ], true );
            this.addAnim( 'jumplightkick',  0.08, [ 36,37,38,37,36 ], true );
            this.addAnim( 'jumphardkick',   0.08, [ 39,40,40,40,39 ], true );
            this.addAnim( 'cannonballjump', 0.05, [ 31,30,43 ], true );
            this.addAnim( 'cannonballspin', 0.05, [ 41,42,43,44 ] );
            this.addAnim( 'charge',         0.04, [ 67,68,70,68,71,69,67,71,67,68,70,68,67,70,71 ], true );
        },
        //the manager needs to register all of the the update objects that will update the player based upon the current state
        //the identifier for each deferredUpdate should match the name of a particular state ie. 'prepping' will be awakened by the 'prepping' state    
        _addDeferredsToInputManager : function(){

            var inactive    = DeferredUpdate.types.INACTIVE,
                neutral     = DeferredUpdate.types.NEUTRAL,
                defense     = DeferredUpdate.types.DEFENSE,
                injured     = DeferredUpdate.types.INJURED;

            //the identifiers and the objects don't don't need to match in name,
            //I just did this way because it was easier: 'foo' could be the identifier for new Bar()
            this._manager.addDeferred( 'prepping',          new Prepping( inactive ) ); //first in is the default

            this._manager.addDeferred( 'highblock',         new Highblock( defense ) );
            this._manager.addDeferred( 'highblow',          new Highblow( injured ) );
            this._manager.addDeferred( 'hardkick',          new Hardkick() );
            this._manager.addDeferred( 'jumplightpunch',    new Jumplightpunch() );
            this._manager.addDeferred( 'jumphardpunch',     new Jumphardpunch() );
            this._manager.addDeferred( 'jumplightkick',     new Jumplightkick() );
            this._manager.addDeferred( 'lowblock',          new Lowblock( defense ) );
            this._manager.addDeferred( 'lowblow',           new Lowblow( injured ) );
            this._manager.addDeferred( 'lowhardkick',       new Lowhardkick() );
            this._manager.addDeferred( 'lowhardpunch',      new Lowhardpunch() );
            this._manager.addDeferred( 'lowlightpunch',     new Lowlightpunch() );
            this._manager.addDeferred( 'neutral',           new Neutral( neutral ) );
            this._manager.addDeferred( 'victorious',        new Victorious( inactive ) );

            this._manager.addDeferred( 'defeated',          new Crankdefeated( inactive ) );
            this._manager.addDeferred( 'lightpunch',        new Cranklightpunch() );
            this._manager.addDeferred( 'mediumpunch',       new Crankmediumpunch() );
            this._manager.addDeferred( 'hardpunch',         new Crankhardpunch() );
            this._manager.addDeferred( 'lightkick',         new Cranklightkick() );
            this._manager.addDeferred( 'mediumkick',        new Crankmediumkick() );
            this._manager.addDeferred( 'weakcharge',        new Crankweakcharge() );
            this._manager.addDeferred( 'strongcharge',      new Crankstrongcharge() );
            this._manager.addDeferred( 'cannonballforward', new Crankcannonballforward() );
            this._manager.addDeferred( 'cannonballupward',  new Crankcannonballupward() );
            this._manager.addDeferred( 'cannonballdiagonal',new Crankcannonballdiagonal() );
            this._manager.addDeferred( 'jumphardkick',      new Crankjumphardkick() );
            this._manager.addDeferred( 'lowlightkick',      new Cranklowlightkick() );
        },
        _addInputBufferSequences : function(){
            //Complex Attacks - Multi Key
            this._inputbuffer.addSequence( new KeySequence( "weakcharge",               "S+LEFT_ARROW,S,S+LEFT_ARROW,S,S+LEFT_ARROW", 0.4 ) );
            this._inputbuffer.addSequence( new KeySequence( "cannonballforwardright",   "S,S+D,D,D+LEFT_ARROW",         0.4 ) );
            this._inputbuffer.addSequence( new KeySequence( "cannonballforwardleft",    "S,S+A,A,A+LEFT_ARROW",         0.4 ) );
            this._inputbuffer.addSequence( new KeySequence( "cannonballupwardright",    "S,S+A,A,A+UP_ARROW",           0.4 ) );
            this._inputbuffer.addSequence( new KeySequence( "cannonballupwardleft",     "S,S+D,D,D+UP_ARROW",           0.4 ) );
            this._inputbuffer.addSequence( new KeySequence( "cannonballdiagonalright",  "A,A+S,S,S+D,D,D+UP_ARROW",     0.5 ) );
            this._inputbuffer.addSequence( new KeySequence( "cannonballdiagonalleft",   "D,D+S,S,S+A,A,A+UP_ARROW",     0.5 ) );
        }
    });
});






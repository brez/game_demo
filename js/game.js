/* game namespace */
var game = {
	/**
	 * an object where to store game global data
	 */
	data : {
		score : 0,
		total_baddies : 4,
		playerEntity : null
	},

	// Run on page load.
	onload : function () {
		// Initialize the video.
		if (!me.video.init(640, 480, {wrapper : "screen", scale : "auto", scaleMethod : "flex-width"})) {
			alert("Your browser does not support HTML5 canvas.");
			return;
		}

		// add "#debug" to the URL to enable the debug Panel
		if (me.game.HASH.debug === true) {
			window.onReady(function () {
				me.plugin.register.defer(this, me.debug.Panel, "debug", me.input.KEY.V);
			});
		}

		// Initialize the audio.
		me.audio.init("mp3,ogg");

		// Set a callback to run when loading is complete.
		me.loader.onload = this.loaded.bind(this);

		// Load the resources.
		me.loader.preload(game.resources);

		// Initialize melonJS and display a loading screen.
		me.state.change(me.state.LOADING);
	},

	/**
	 * callback when everything is loaded
	 */
	loaded : function () {
		// set the "Title" Screen Object
		me.state.set(me.state.MENU, new game.TitleScreen());

		// set the "Play/Ingame" Screen Object
		me.state.set(me.state.PLAY, new game.PlayScreen());

		// fade in with White
		me.state.transition('fade', '#FFFFFF', 250);

		// register our player entity in the object pool
		me.pool.register("mainPlayer", game.PlayerEntity, true);
		me.pool.register("CoinEntity", game.CoinEntity, true);
		me.pool.register("EnemyEntity", game.EnemyEntity, true);
		me.pool.register("projectile", game.AttackEntity, false);

		// enable the keyboard
		me.input.bindKey(me.input.KEY.A,  "left");
		me.input.bindKey(me.input.KEY.D, "right");
		me.input.bindKey(me.input.KEY.W, "up");
		me.input.bindKey(me.input.KEY.S, "down");
		me.input.bindKey(me.input.KEY.X, "jump", true);

		// Send player to menu
		me.state.change(me.state.MENU);

		me.sys.gravity = 0;
	}
};

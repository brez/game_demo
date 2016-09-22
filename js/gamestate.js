var gamestate = {

	win : function () {
		/*
			@TODO: what do you want to do when you win?
		 */
		//this.giveReward();
	},

	die : function () {
		/*
			@TODO: what do you want to do when you die?
		 */
		//// Release keys back to viewport
		//me.input.unbindKey(me.input.KEY.ENTER);
		//
		//// Release pointer events back to viewport (they will be rebound on Play)
		//me.input.releasePointerEvent('pointerdown', me.game.viewport);
		//
		//// Go back to main menu
		//me.state.change(me.state.MENU);
	},

	checkGameStatus : function (obj) {
		if (game.data.total_baddies <= 0) {
			this.win();
		} else if (obj && obj.health <= 0) {
			this.die();
		}
	},

	notify : function (message, obj) {
		switch (message) {
			case 'baddie killed':
				game.data.total_baddies-= 1;
				this.checkGameStatus(obj);
				break;
			case 'player hit':
				this.checkGameStatus(obj);
			default:
				this.checkGameStatus();
		}

	},

	giveReward : function () {
		/*
			@TODO: want to give something for a win? Create an entity and give it!
		 */
		//var params = {
		//	poolID: 'coin',
		//	x: game.data.playerEntity.pos.x + 100,
		//	y: game.data.playerEntity.pos.y + 100,
		//	data: {
		//		name: 'trophy',
		//		type: 'CoinEntity',
		//		resource_name: 'coffee',
		//		image: 'coffee',
		//		width: 128,
		//		height: 128,
		//		framewidth: 128,
		//		frameheight: 128,
		//		angle: this.angle
		//	}
		//};
		//
		//var newReward = me.pool.pull(params.poolID, params.x, params.y, params.data);
		//newReward.z = 39;
		//me.game.world.addChild(newReward);
	}

};

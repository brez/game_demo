/**
 * an enemy Entity
 */
game.EnemyEntity = me.Entity.extend({
	init: function (x, y, settings) {

		// save the area size defined in Tiled
		var width = settings.width;
		var height = settings.height;

		// adjust the size setting information to match the sprite size
		// so that the entity object is created with the right size
		settings.framewidth = settings.width = 64;
		settings.frameheight = settings.height = 64;

		this.health = 100;

		this.damaged_by_GUID = null;

		// redefine the default shape (used to define path) with a shape matching the renderable
		settings.shapes[0] = new me.Rect(0, 0, settings.framewidth, settings.frameheight);

		// call the parent constructor
		this._super(me.Entity, 'init', [x, y , settings]);

		this.renderable.addAnimation("walk",  [0, 1, 2]);

		// set start/end position based on the initial area size
		x = this.pos.x;
		this.startX = x;
		this.endX   = x + width - settings.framewidth;
		this.pos.x  = x + width - settings.framewidth;

		// to remember which side we were walking
		this.walkLeft = false;

		// walking & jumping speed
		this.body.setVelocity(4, 6);

	},

	/**
	 * update the enemy pos
	 */
	update : function (dt) {

		if (this.alive) {
			if (this.walkLeft && this.pos.x <= this.startX) {
				this.walkLeft = false;
			}
			else if (!this.walkLeft && this.pos.x >= this.endX) {
				this.walkLeft = true;
			}

			// make it walk
			this.renderable.flipX(this.walkLeft);
			this.body.vel.x += (this.walkLeft) ? -this.body.accel.x * me.timer.tick : this.body.accel.x * me.timer.tick;
		}
		else {
			this.body.vel.x = 0;
		}

		// update the body movement
		this.body.update(dt);

		// handle collisions against other shapes
		me.collision.check(this);

		// return true if we moved or if the renderable was updated
		return (this._super(me.Entity, 'update', [dt]) || this.body.vel.x !== 0 || this.body.vel.y !== 0);
	},

	/**
	 * colision handler
	 * (called when colliding with other objects)
	 */
	onCollision : function (response, collidedObject) {
		if (collidedObject.name === 'fire' && this.damaged_by_GUID !== collidedObject.GUID) {
			this.damaged_by_GUID = collidedObject.GUID;
			this.health -= 50;
			this.renderable.flicker(750);
			me.state.set(me.state.PLAY, new game.PlayScreen());
			if (this.health <= 0) {
				this.leaveReward();
				me.game.world.removeChild(this);
				gamestate.notify('baddie killed', null);
			}
			return false;
		}
		if (collidedObject.name === 'mainPlayer') {
			return false;
		}
		// Make all other objects solid
		return true;
	},

	leaveReward : function () {

		var params = {
			poolID: 'CoinEntity',
			x: this.pos.x + 30,
			y: this.pos.y + 20,
			data: {
				name: 'coin',
				type: 'CoinEntity',
				resource_name: 'spinning_coin_gold',
				image: 'spinning_coin_gold',
				width: 64,
				height: 64,
				framewidth: 64,
				frameheight: 64,
				angle: this.angle
			}
		};

		var newReward = me.pool.pull(params.poolID, params.x, params.y, params.data);
		newReward.z = 39;
		me.game.world.addChild(newReward);
	}
});

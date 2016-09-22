/**
 * a player entity
 */
game.PlayerEntity = me.Entity.extend({
	/**
	 * constructor
	 */
	init : function (x, y, settings) {
		// call the constructor
		this._super(me.Entity, 'init', [x, y, settings]);

		// set the default horizontal & vertical speed (accel vector)
		this.body.setVelocity(.5,.5);
		this.body.setMaxVelocity(4, 5);
		this.body.setFriction(0, 0);

		// set the display to follow our position on both axis
		me.game.viewport.follow(this.pos, me.game.viewport.AXIS.BOTH);

		// ensure the player is updated even when outside of the viewport
		this.alwaysUpdate = true;

		// define a basic walking animation (using all frames)
		this.renderable.addAnimation("walk",  [0, 1, 2]);

		// define a standing animation (using the first frame)
		this.renderable.addAnimation("stand",  [1]);

		// set the standing animation as default
		this.renderable.setCurrentAnimation("stand");

		this.health = 100;

		this.hit_stun = false;

		game.data.playerEntity = this;

		me.input.registerPointerEvent('pointerdown', me.game.viewport, this.pointerdown.bind(this));
	},

	pointerdown : function (e) {
		if (e.button === 0) {
			this.angle = this.angleToPoint(new me.Vector2d(e.gameX - 30, e.gameY + 30));

			// Projectile
			var params = {
				poolID: 'projectile',
				x: this.pos.x + 30,
				y: this.pos.y + 20,
				data: {
					name: 'fire',
					type: 'AttackEntity',
					resource_name: 'fireball',
					image: 'fireball',
					width: 64,
					height: 64,
					framewidth: 64,
					frameheight: 64,
					angle: this.angle
				}
			};

			var newProjectile = me.pool.pull(params.poolID, params.x, params.y, params.data);
			newProjectile.z = 39;
			me.game.world.addChild(newProjectile);
		}
	},

	/*
	 * update the player pos
	 */
	update : function (dt) {

		var up = me.input.isKeyPressed('up'),
			down = me.input.isKeyPressed('down'),
			left = me.input.isKeyPressed('left'),
			right = me.input.isKeyPressed('right');

		if (up || down || left || right) {

			if (!this.renderable.isCurrentAnimation("walk")) {
				this.renderable.setCurrentAnimation("walk");
			}

			if (left) {
				// flip the sprite on horizontal axis
				this.renderable.flipX(true);

				// update the entity velocity
				this.body.vel.x -= this.body.accel.x * me.timer.tick;

			}
			if (right) {
				// unflip the sprite
				this.renderable.flipX(false);

				// update the entity velocity
				this.body.vel.x += this.body.accel.x * me.timer.tick;

			}
			if (up) {
				// update the entity velocity
				this.body.vel.y -= this.body.accel.y * me.timer.tick;

			}
			if (down) {
				// update the entity velocity
				this.body.vel.y += this.body.accel.y * me.timer.tick;

			}
		}
		else {
			this.body.vel.x = 0;
			this.body.vel.y = 0;

			// change to the standing animation
			this.renderable.setCurrentAnimation("stand");
		}

		// apply physics to the body (this moves the entity)
		this.body.update(dt);

		// handle collisions against other shapes
		me.collision.check(this);

		// return true if we moved or if the renderable was updated
		return (this._super(me.Entity, 'update', [dt]) || this.body.vel.x !== 0 || this.body.vel.y !== 0);
	},

	/**
	 * colision handler
	 */
	onCollision : function (response, collidedObject) {

		if (collidedObject.type === 'AttackEntity') {
			return false;
		}

		switch (response.b.body.collisionType) {
			case me.collision.types.WORLD_SHAPE:
				break;

			case me.collision.types.ENEMY_OBJECT:

				if (!this.hit_stun) {
					this.health -= 50;
				}

				this.hit_stun = true;

				this.renderable.flicker(750, function () {
					this.hit_stun = false;
				}.bind(this));

				gamestate.notify('player hit', this);

			default:
				// Do not respond to other objects (e.g. coins)
				return false;
		}

		// Make the object solid
		return true;
	}
});

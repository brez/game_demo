
game.AttackEntity = me.Entity.extend({
	init: function(x, y, settings) {

		this._super(me.Entity, 'init', [x, y , settings]);

		this.angle = settings.angle;
		this.poolID = settings.poolID;
		this.speedMultiplier = 4;

		// save the area size defined in Tiled
		var width = settings.width;
		var height = settings.height;

		this.body.addShape(new me.Rect(0, 0, settings.width, settings.height));
		this.body.setVelocity(4, 4);

		this.name = settings.name;
		this.hitTarget = false;
		this.alwaysUpdate = true;
		this.image = settings.image;

		var x = this.pos.x;
		var y = this.pos.y;

		// adjust the size setting information to match the sprite size
		// so that the entity object is created with the right size
		settings.framewidth = settings.width = 64;
		settings.frameheight = settings.height = 64;

		this.resource_name = settings.resource_name;

		this.renderable.addAnimation("fire",  [0, 1, 2]);

		this.renderable.setCurrentAnimation(this.name);

		this.body.vel.set(Math.cos(-this.angle) * this.speedMultiplier, -Math.sin(-this.angle) * this.speedMultiplier);
	},

	update: function(delta) {

		if (!this.inViewport) {
			me.game.world.removeChild(this);
		}

		this.body.update(delta);
		if (!me.collision.check(this)) {}

		return (this._super(me.Entity, 'update', [delta]) || this.body.vel.x !== 0 || this.body.vel.y !== 0);
	},


	onCollision : function (response, collidedObject) {

		if (collidedObject.type === 'minion' && !this.hitTarget) {
			this.hitTarget = true;
			/*
				@TODO
			 */
			//me.game.viewport.shake(10, 500, me.game.viewport.AXIS.BOTH);
			me.game.world.removeChild(this);
		}

		if (collidedObject.type === 'AttackEntity') {
			return false;
		}

		// Ignore collision if hits player's interaction box
		if (collidedObject.type === 'PlayerEntity') {
			return false;
		}

		if (collidedObject.type === 'CoinEntity') {
			return false;
		}

		return true;
	}
});

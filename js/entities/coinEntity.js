/**
 * a Coin entity
 */
game.CoinEntity = me.CollectableEntity.extend({
	// extending the init function is not mandatory
	// unless you need to add some extra initialization
	init: function (x, y, settings) {
		// call the parent constructor
		this._super(me.CollectableEntity, 'init', [x, y , settings]);

		this.name = settings.name;

	},

	// this function is called by the engine, when
	// an object is touched by something (here collected)
	onCollision : function (response, collidedObject) {
		// do something when collected

		if (collidedObject.type === 'AttackEntity') {
			return false;
		}

		if (collidedObject.type === 'PlayerEntity' && this.name === 'trophy') {
			me.state.transition('fade', '#FFFFFF', 250);
			me.levelDirector.loadLevel('level_2');
		}

		// give some score
		game.data.score += 250;

		// make sure it cannot be collected "again"
		this.body.setCollisionMask(me.collision.types.NO_OBJECT);

		// remove it
		me.game.world.removeChild(this);
	}
});

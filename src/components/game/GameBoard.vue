<template>
	<section>
		<div
			v-for="(tile, index) in gameBoard"
			:key="index"
			@click="sendMove(index)"
		>
			{{ tile }}
		</div>
	</section>
</template>

<script>
export default {
	props: {
		gameBoard: {
			type: Object
		}
	},
	emits: ['player-move'],
	setup(_, { emit }) {
		function sendMove(index) {
			emit('player-move', index)
		}

		return {
			sendMove
		}
	}
}
</script>

<style lang="scss" scoped>
section {
	display: flex;
	flex-wrap: wrap;
	justify-content: space-between;
	align-items: center;
	width: 100%;
	height: 90%;

	div {
		flex-basis: 32%;
		height: 32%;
		background-color: #d65db1;
		border-radius: 15px;
		display: flex;
		justify-content: center;
		align-items: center;
		color: white;
		font-size: 5rem;
		cursor: pointer;
		transition: all 0.3s ease;
	}

	div:hover {
		background-color: #a34686;
	}
}
</style>

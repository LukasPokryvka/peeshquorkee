<template>
	<div>
		<a @click="connectToGame()">
			Connect to game
		</a>
	</div>
</template>

<script>
export default {
	setup(_, { emit }) {
		function connectToGame() {
			emit('connect-to-game')
		}

		return {
			connectToGame
		}
	}
}
</script>

<style lang="scss" scoped>
div {
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	display: flex;
	justify-content: center;
	align-items: center;
	z-index: 10;
	background-color: rgba(255, 255, 255, 0.3);
	border-radius: 15px;

	a {
		padding: 0.7rem 1.5rem;
		background-color: #845ec2;
		color: white;
		border-radius: 15px;
		cursor: pointer;
		transition: all 0.3s ease;
	}

	a:hover {
		background-color: #9e70e8;
	}
}
</style>

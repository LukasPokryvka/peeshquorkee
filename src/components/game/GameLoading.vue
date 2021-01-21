<template>
	<div class="game-loading">
		<h3>Waiting for another player</h3>
	</div>
</template>

<script>
export default {
	setup() {}
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
}
</style>

<template>
	<button @click="disconnect" class="disconnect">
		X
	</button>
</template>

<script>
export default {
	setup(_, { emit }) {
		function disconnect() {
			emit('disconnect-from-game')
		}

		return {
			disconnect
		}
	}
}
</script>

<style lang="scss" scoped>
.disconnect {
	position: absolute;
	top: -10px;
	right: -10px;
	border: none;
	background-color: #fe4d4d;
	color: white;
	border-radius: 15px;
	padding: 0.28rem 0.56rem 0.25rem 0.56rem;
	transition: all 0.3s ease;
}

.disconnect:hover {
	background-color: #ff644d;
	transform: scale(1.1);
}
</style>

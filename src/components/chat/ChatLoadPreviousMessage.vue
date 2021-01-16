<template>
	<a
		class="load-prev-msg"
		title="Load previous messages"
		@click="loadPreviousChat()"
	>
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width="24"
			height="24"
			viewBox="0 0 24 24"
		>
			<path fill="none" d="M0 0h24v24H0V0z" />
			<path d="M7.41 15.41L12 10.83l4.59 4.58L18 14l-6-6-6 6 1.41 1.41z" />
		</svg>
	</a>
</template>

<script>
export default {
	setup(_, { emit }) {
		function loadPreviousChat() {
			emit('load-prev-chat')
		}

		return {
			loadPreviousChat
		}
	}
}
</script>

<style lang="scss" scoped>
.load-prev-msg {
	position: absolute;
	top: 0;
	left: 0;
	opacity: 0.3;
	font-size: 1.7rem;
	transition: all 0.3s ease;
	width: 100%;
	cursor: pointer;
	text-align: center;
}

.load-prev-msg:hover {
	opacity: 1;
	background-color: rgba(44, 62, 80, 0.2);

	svg {
		transform: scale(1.3);
	}
}
</style>

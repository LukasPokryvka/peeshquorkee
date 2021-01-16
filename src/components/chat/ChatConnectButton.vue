<template>
	<a class="connect-to-chat" @click="connect()">Connect to chat</a>
</template>

<script>
export default {
	setup(_, { emit }) {
		function connect() {
			emit('connect-to-chat')
		}

		return {
			connect
		}
	}
}
</script>

<style lang="scss" scoped>
.connect-to-chat {
	padding: 0.7rem 1.5rem;
	background-color: #845ec2;
	color: white;
	border-radius: 15px;
	cursor: pointer;
	transition: all 0.3s ease;
}

.connect-to-chat:hover {
	background-color: #9e70e8;
}
a {
	cursor: pointer;
}
</style>

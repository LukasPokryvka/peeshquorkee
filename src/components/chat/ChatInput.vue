<template>
	<div class="chat-input">
		<input v-model.trim="send_message" type="text" @keyup.enter="sendMessage" />
	</div>
</template>

<script>
import { ref } from 'vue'

export default {
	setup(_, { emit }) {
		const send_message = ref('')

		function sendMessage() {
			emit('send-message', send_message.value)
			console.log(send_message.value)
			send_message.value = ''
		}

		return {
			send_message,
			sendMessage
		}
	}
}
</script>

<style lang="scss" scoped>
.chat-input {
	height: 10%;
	display: flex;
	align-items: flex-end;
	padding: 0 0.7rem 0.7rem 0.7rem;
	input {
		border: none;
		padding: 0.5rem;
		border-radius: 15px;
		background-color: rgba(255, 150, 113, 0.35);
		width: 100%;
	}
	input:focus {
		outline: none;
	}
}
</style>

<template>
	<section v-if="getIsUserLoggedIn" class="chat">
		<div class="chat-header">
			<h2>🤣 Četík 🤣</h2>
		</div>
		<div class="chat-dialog">
			<a
				class="load-prev-msg"
				title="Load previous messages"
				@click="loadPrevChat()"
				>🠕</a
			>
			<a v-if="!state.connected" class="connect-to-chat" @click="connect()"
				>Connect to chat</a
			>

			<ul v-else id="chat-body">
				<li
					v-for="message in state.received_messages"
					:key="message"
					:class="
						message.email === state.user.email ? 'origin-user' : 'other-user'
					"
				>
					<div>
						<small>{{ timeOfChat(message.nickname, message.timestamp) }}</small>
					</div>
					<div>
						<img :src="message.avatar" alt="" />
						<p v-html="message.content"></p>
					</div>
				</li>
			</ul>
		</div>
		<div class="chat-input">
			<input
				v-model.trim="state.send_message"
				type="text"
				@keyup.enter="send()"
			/>
		</div>
	</section>
</template>

<script>
import SockJS from 'sockjs-client'
import Stomp from 'webstomp-client'
import axios from 'axios'
import twitchEmoji from 'twitch-emoji'
import {
	formatTimestamp,
	getCurrentTimestamp,
	timeOfChat
} from '../../utilities/timeUtilities'
import updateScroll from '../../utilities/updateScroll'
import { Base64 } from 'js-base64'
import { computed, onMounted, reactive, watchEffect } from 'vue'
import { useStore } from 'vuex'

export default {
	setup() {
		const store = useStore()
		const state = reactive({
			received_messages: [],
			send_message: null,
			connected: false,
			user: getUser,
			oldestTimestamp: null
		})

		let stompClient = null

		onMounted(() => {
			state.oldestTimestamp = getCurrentTimestamp()
		})

		function connect() {
			const socket = new SockJS('http://192.168.100.25:42069/chatapp')
			stompClient = Stomp.over(socket)
			stompClient.connect({}, connectCallback, connectErrot)
		}

		function connectCallback(frame) {
			state.connected = true
			console.log(frame)
			stompClient.subscribe('/topic/chat', tick => {
				console.log(tick)
				const content = twitchEmoji.parse(
					Base64.decode(JSON.parse(tick.body).content),
					{ emojiSize: 'small' }
				)

				console.log('body:      -------->', tick.body.slice(0, 4))
				// const email = JSON.parse(tick.body).email
				// const timestamp = formatTimestamp(JSON.parse(tick.body).timestamp)
				// const avatar = JSON.parse(tick.body).avatar
				// const nickname = JSON.parse(tick.body).nickname

				const email = JSON.parse(tick.body).email
				const timestamp = formatTimestamp(JSON.parse(tick.body).timestamp)
				const avatar = JSON.parse(tick.body).avatar
				const nickname = JSON.parse(tick.body).nickname

				state.received_messages.push({
					content,
					email,
					timestamp,
					avatar,
					nickname
				})
				state.oldestTimestamp = state.received_messages[0].timestamp
				updateScroll()
			})
		}

		function connectErrot(error) {
			console.log(error)
			state.connected = false
		}

		function disconnect() {
			if (stompClient) {
				stompClient.disconnect()
			}
			state.connected = false
		}

		function send() {
			if (stompClient && stompClient.connected) {
				const msg = {
					message: Base64.encode(state.send_message),
					nickname: state.user.nickname,
					email: state.user.email
				}
				console.log(JSON.stringify(msg))
				stompClient.send('/app/incomingMessage', JSON.stringify(msg), {})
				state.send_message = null
			}
		}

		function loadPrevChat() {
			if (!state.connected) connect()

			axios
				.post('http://192.168.100.25:4202/chatHistory', {
					timestamp: state.oldestTimestamp
				})
				.then(res => {
					const data = res.data
					data.forEach(msg => {
						const { message: content, email, timestamp, avatar, nickname } = msg

						state.received_messages.unshift({
							content: twitchEmoji.parse(Base64.decode(content), {
								emojiSize: 'small'
							}),
							email,
							timestamp: formatTimestamp(timestamp),
							avatar,
							nickname
						})
					})
					state.oldestTimestamp = state.received_messages[0].timestamp
				})
				.catch(e => {
					console.log('error: ', e)
				})
		}

		const getUser = computed(() => store.getters.getUser)
		const getIsUserLoggedIn = computed(() => store.getters.getIsLoggedIn)
		watchEffect(() => {
			state.user = getUser
		})

		return {
			state,
			connect,
			connectCallback,
			connectErrot,
			send,
			disconnect,
			loadPrevChat,
			store,
			getUser,
			getIsUserLoggedIn,
			timeOfChat
		}
	}
}
</script>

<style lang="scss" scoped>
ul::-webkit-scrollbar {
	width: 5px; /* width of the entire scrollbar */
}
ul::-webkit-scrollbar-thumb {
	border-radius: 20px; /* roundness of the scroll thumb */
	border: 3px solid #777; /* creates padding around scroll thumb */
}
.chat {
	width: 350px;
	height: 600px;
	background-color: white;
	border-radius: 15px;
	box-shadow: 3px 3px 5px #555;

	.chat-header {
		height: 10%;
		display: flex;
		align-items: center;
		justify-content: center;
		background-color: #d65db1;
		border-top-left-radius: 15px;
		border-top-right-radius: 15px;
		color: white;

		h2 {
			text-align: center;
			margin: 0;
		}
	}

	.chat-dialog {
		height: 80%;
		display: flex;
		justify-content: center;
		align-items: center;
		position: relative;

		a {
			cursor: pointer;
		}

		.load-prev-msg {
			position: absolute;
			top: 0;
			left: 50%;
			opacity: 0.5;
			font-size: 1.7rem;
			transition: all 0.3s ease;
		}

		.load-prev-msg:hover {
			transform: scale(1.8);
			opacity: 1;
		}

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

		ul {
			padding: 0 0.7rem;
			margin: 0;
			width: 100%;
			height: 100%;
			overflow: scroll;
			overflow-x: hidden;

			li {
				display: flex;
				flex-flow: column;
				list-style: none;
				margin: 3px 0;

				p {
					max-width: 70%;
					color: white;
					margin: 0;
					padding: 0.3rem 0.7rem;
					border-radius: 15px;
					text-align: left;
				}

				div {
					display: flex;
					align-items: center;
					img {
						object-fit: cover;
						border-radius: 50%;
						height: 25px;
						width: 25px;
					}
					small {
						margin-bottom: 3px;
					}
				}
			}

			.origin-user {
				text-align: right;

				div {
					flex-direction: row-reverse;
				}

				p {
					background-color: #845ec2;
					word-break: break-word;
				}

				img {
					margin-left: 5px;
				}
			}

			.other-user {
				justify-content: flex-start;

				p {
					background-color: #ff6f91;
				}

				img {
					margin-right: 5px;
				}
			}
		}
	}

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
}
</style>

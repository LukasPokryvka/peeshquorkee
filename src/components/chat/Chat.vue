<template>
	<section v-if="getIsUserLoggedIn" class="chat">
		<ChatHeader />
		<div class="chat-dialog">
			<ChatLoadPreviousMessage @load-prev-chat="loadPrevChat()" />
			<ChatConnectButton v-if="!state.connected" @connect-to-chat="connect()" />
			<transition-group v-else name="messages" tag="ul" id="chat-body">
				<ChatMessage
					v-for="message in state.received_messages"
					:key="message"
					:message="message"
					:userEmail="state.user.email"
				/>
			</transition-group>
		</div>
		<ChatInput @send-message="send($event)" />
	</section>
</template>

<script>
// components
import ChatMessage from './ChatMessage'
import ChatLoadPreviousMessage from './ChatLoadPreviousMessage'
import ChatHeader from './ChatHeader'
import ChatInput from './ChatInput'
import ChatConnectButton from './ChatConnectButton'

// vue stuff
import { computed, onMounted, reactive, watchEffect } from 'vue'
import { useStore } from 'vuex'

// custom functions
import {
	formatTimestamp,
	getCurrentTimestamp
} from '../../utilities/timeUtilities'
import updateScroll from '../../utilities/updateScroll'

// dependencies
import SockJS from 'sockjs-client'
import Stomp from 'webstomp-client'
import axios from 'axios'
import twitchEmoji from 'twitch-emoji'
import { Base64 } from 'js-base64'

// message sound
const notification = new Audio(require('../../sounds/notification.mp3'))

export default {
	components: {
		ChatMessage,
		ChatHeader,
		ChatInput,
		ChatLoadPreviousMessage,
		ChatConnectButton
	},
	setup() {
		const store = useStore()
		const state = reactive({
			received_messages: [],
			connected: false,
			user: getUser,
			oldestTimestamp: null,
			firstMessage: true
		})

		let stompClient = null

		/**
		 * * Oldest timestamp set to current time, if first
		 * * thing after connection is load previous messages
		 */
		onMounted(() => {
			state.oldestTimestamp = getCurrentTimestamp()
		})

		/**
		 * * Create connection after clicking on 'Connect to chat'
		 * * Provide connectCallback and connectError
		 */
		function connect() {
			const socket = new SockJS('http://192.168.100.25:42069/chatapp')
			stompClient = Stomp.over(socket)
			stompClient.connect({}, connectCallback, connectErrot)
		}

		/**
		 * * Connection to chat callback, creating subscribe on
		 * * the server. On received message, parse it and create
		 * * message object, which is pushed to the state.received_messages.
		 * * Checking for firstMessage, which should provide header after
		 * * loading old messages. Then set oldest timestamp and scroll
		 * * to the bottom. Play sound if received message is from another person
		 */
		function connectCallback(frame) {
			state.connected = true
			console.log(frame)
			stompClient.subscribe('/topic/chat', tick => {
				const msg = JSON.parse(tick.body)
				console.log(tick)

				state.received_messages.push({
					content: twitchEmoji.parse(Base64.decode(msg.content)),
					email: msg.email,
					timestamp: formatTimestamp(msg.timestamp),
					avatar: msg.avatar,
					nickname: msg.nickname,
					displayHeader: false,
					firstMessage: state.firstMessage ? true : false
				})

				state.firstMessage = false
				state.oldestTimestamp = state.received_messages[0].timestamp
				formatHeaders()
				updateScroll()

				if (msg.email !== state.user.email) {
					notification.play()
				}
			})
		}

		/**
		 * * Connection error callback
		 */
		function connectErrot(error) {
			console.log(error)
			state.connected = false
		}

		/**
		 * * Disconnect from the server
		 */
		function disconnect() {
			if (stompClient) {
				stompClient.disconnect()
			}
			state.connected = false
		}

		/**
		 * * Send new message to the server
		 */
		function send(message) {
			if (stompClient && stompClient.connected) {
				const msg = {
					message: Base64.encode(message),
					nickname: state.user.nickname,
					email: state.user.email
				}
				console.log(JSON.stringify(msg))
				stompClient.send('/app/incomingMessage', JSON.stringify(msg), {})
			}
		}

		/**
		 * * Load 10 previous messages from oldest timemstamp
		 * * which is time of logging into chat. Then set new
		 * * oldest timestamp and format chat
		 */
		function loadPrevChat() {
			if (!state.connected) connect()

			axios
				.post('http://192.168.100.25:4202/chatHistory', {
					timestamp: state.oldestTimestamp
				})
				.then(res => {
					const data = res.data
					data.forEach(msg => {
						state.received_messages.unshift({
							content: twitchEmoji.parse(Base64.decode(msg.message), {
								emojiSize: 'small'
							}),
							email: msg.email,
							timestamp: formatTimestamp(msg.timestamp),
							avatar: msg.avatar,
							nickname: msg.nickname,
							displayHeader: false,
							firstMessage: false
						})
					})
					state.oldestTimestamp = state.received_messages[0].timestamp
					formatHeaders()
				})
				.catch(e => {
					console.log('error: ', e)
				})
		}

		/**
		 * * Run through every message in state.received_messages
		 * * and set rule, if nick, time and avatar should be displayed
		 */
		function formatHeaders() {
			state.received_messages.forEach((msg, index) => {
				if (index === 0) {
					state.received_messages[index].displayHeader = true
				} else if (msg.email !== state.received_messages[index - 1].email) {
					state.received_messages[index].displayHeader = true
				} else {
					if (!state.received_messages[index].firstMessage) {
						state.received_messages[index].displayHeader = false
					}
				}
			})
		}

		/**
		 * * COMPUTED
		 */
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
			formatHeaders
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

	.chat-dialog {
		height: 80%;
		display: flex;
		justify-content: center;
		align-items: center;
		position: relative;

		ul {
			padding: 0 0.7rem;
			margin: 0;
			width: 100%;
			height: 100%;
			overflow: scroll;
			overflow-x: hidden;
		}
	}
}

// animations
.messages-enter-active,
.messages-leave-active {
	transition: all 0.15s;
}

.messages-enter-from,
.messages-leave-to {
	opacity: 0;
	transform: scale(0.75);
}
</style>

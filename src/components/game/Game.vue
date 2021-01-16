<template>
	<section class="game" :class="{ 'game-background': connectedToGame }">
		<GameHeader :user="user" />
		<GameConnect v-if="!connectedToGame" @connect-to-game="connectToGame" />
		<GameBoard :gameBoard="gameBoard" @player-move="send($event)" />
		<button
			v-if="connectedToGame"
			@click="disconnectFromGame"
			class="disconnect"
		>
			X
		</button>
	</section>
</template>

<script>
import SockJS from 'sockjs-client'
import Stomp from 'webstomp-client'
import { onMounted, reactive, toRefs } from 'vue'
import { useStore } from 'vuex'
import GameBoard from './GameBoard'
import GameConnect from './GameConnect'
import GameHeader from './GameHeader'

export default {
	components: {
		GameBoard,
		GameConnect,
		GameHeader
	},
	setup() {
		const store = useStore()
		const state = reactive({
			connected: false,
			connectedToGame: false,
			user: store.getters.getUser,
			gameBoard: {
				f00: '',
				f01: '',
				f02: '',
				f03: '',
				f04: '',
				f05: '',
				f06: '',
				f07: '',
				f09: ''
			}
		})

		let stompClient = null

		/**
		 * * Connection created on application open
		 */
		onMounted(() => {
			connect()
		})

		/**
		 * * Connection to the server
		 */
		function connect() {
			const socket = new SockJS('http://192.168.100.62:42069/game')
			stompClient = Stomp.over(socket)
			stompClient.connect({}, connectCallback, connectErrot)
		}

		/**
		 * * Connection callback with subscribe
		 * * 1. check if message in only player connecting
		 * * 2. check if it is end of the game (checked on the backend)
		 * * 3. check if there is a winner
		 * * 4. check if board is obtained, then replace old board
		 */
		function connectCallback(frame) {
			state.connected = true
			console.log(frame)
			stompClient.subscribe('/queue/gameStatus', tick => {
				console.log(tick)
				if (tick.body.slice(0, 6) === 'Player') {
					console.log('YEP COCK ' + tick.body)
				} else if (tick.body === 'Game ended.') {
					console.log('GAME ENDED')
				} else {
					const gameBoard = JSON.parse(tick.body)
					if (gameBoard.f00 === 'win_playerOne') disconnectFromGame()
					else if (gameBoard.f00 === 'win_playerTwo') disconnectFromGame()
					else state.gameBoard = gameBoard
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
		 * * Send move as '00' (row, column) and email of player
		 */
		function send(value) {
			if (stompClient && stompClient.connected) {
				const msg = {
					move: value.slice(1, 3),
					email: state.user.email
				}
				console.log(JSON.stringify(msg))
				stompClient.send('/app/incomingMessage', JSON.stringify(msg), {})
			}
		}

		/**
		 * * Connect to game, send email as payload,
		 * * set starting board
		 */
		function connectToGame() {
			if (stompClient && stompClient.connected) {
				const msg = {
					email: state.user.email
				}
				console.log(JSON.stringify(msg))
				stompClient.send('/app/startGame', JSON.stringify(msg), {})
				state.connectedToGame = true
				window.eventBus.emit('start-timer')
			}
		}

		/**
		 * * Disconnect from the game
		 */
		function disconnectFromGame() {
			if (stompClient && stompClient.connected) {
				const msg = {
					nickname: state.user.nickname
				}
				console.log(JSON.stringify(msg))
				stompClient.send('/app/endGame', JSON.stringify(msg), {})
			}
			state.connectedToGame = false
			window.eventBus.emit('reset-timer')
		}

		return {
			...toRefs(state),
			connect,
			connectCallback,
			connectErrot,
			disconnect,
			send,
			connectToGame,
			disconnectFromGame
		}
	}
}
</script>

<style lang="scss" scoped>
.game-background {
	background-color: white;
	padding: 0 1rem 1rem 1rem !important;
}

.game {
	position: relative;
	padding: 1rem;
	width: 500px;
	height: 550px;
	border-radius: 15px;

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
}
</style>
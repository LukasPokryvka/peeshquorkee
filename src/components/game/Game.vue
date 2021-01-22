<template>
	<section
		v-if="getIsUserLoggedIn"
		class="game"
		:class="{ 'game-background': connectedToGame }"
	>
		<GameHeader @timer-value="setTimerValue($event)" />
		<GameConnect v-if="!connectedToGame" @connect-to-game="connectToGame" />
		<GameLoading v-if="lookingForGame" />
		<GameBoard :gameBoard="gameBoard" @player-move="send($event)" />
		<GameDisconnect
			v-if="connectedToGame"
			@disconnect-from-game="disconnectFromGame"
		/>
		<div v-if="isWinner" @click="closeIsWinner" class="game-winner-overlay">
			<div class="game-winner-modal">
				<h2>{{ endGameTitle }}</h2>
				<p>Winner: {{ winner }}</p>
				<p>Game time: {{ gameTime }}</p>
				<button @click="connectToGame()">Play another game</button>
			</div>
		</div>
	</section>
</template>

<script>
// dependencies
import SockJS from 'sockjs-client'
import Stomp from 'webstomp-client'

// vue imports
import { onMounted, reactive, toRefs, computed, watchEffect } from 'vue'
import { useStore } from 'vuex'

// components
import GameBoard from './GameBoard'
import GameConnect from './GameConnect'
import GameHeader from './GameHeader'
import GameDisconnect from './GameDisconnect'
import GameLoading from './GameLoading'

export default {
	components: {
		GameBoard,
		GameConnect,
		GameHeader,
		GameDisconnect,
		GameLoading
	},
	setup() {
		const store = useStore()
		const state = reactive({
			connected: false,
			connectedToGame: false,
			lookingForGame: false,
			isWinner: false,
			winner: '',
			endGameTitle: '',
			gameTime: '',
			user: getUserInfo,
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

		function setTimerValue(value) {
			state.gameTime = value
		}

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
			const socket = new SockJS('http://192.168.100.24:42069/game')
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
			stompClient.subscribe('/topic/gameStatus', tick => {
				const response = tick.body
				console.log(response)

				if (response.slice(0, 7) === 'Player1') {
					console.log(
						'yes------------------------------------------------------'
					)
				} else if (response.slice(0, 7) === 'Player2') {
					window.eventBus.emit('start-timer')
					state.lookingForGame = false
				} else if (response === 'Game ended.') {
					state.connectedToGame ? disconnectFromGame() : resetBoard()
				} else {
					const win = JSON.parse(response)
					state.gameBoard = win.gameBoard
					if (win.winner) {
						whoWon(win.winnerNick)
						state.isWinner = true
						state.winner = win.winnerNick
						window.eventBus.emit('reset-timer')
					} else if (win.draw) {
						whoWon(win.winnerNick)
						state.isWinner = true
						state.winner = win.winnerNick
						window.eventBus.emit('reset-timer')
					}
				}
			})
		}

		function whoWon(player) {
			if (player === 'draw') {
				state.endGameTitle = "It's a draw!"
			} else {
				player === state.user.nickname
					? (state.endGameTitle = 'You won!')
					: (state.endGameTitle = 'You lost :(')
			}
		}

		function closeIsWinner() {
			state.isWinner = false
		}

		function resetBoard() {
			state.gameBoard = {
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
			resetBoard()
		}

		/**
		 * * Send move as '00' (row, column) and email of player
		 */
		function send(value) {
			if (stompClient && stompClient.connected) {
				const msg = {
					move: value.slice(1, 3),
					nickname: state.user.nickname
				}
				console.log(JSON.stringify(msg))
				stompClient.send('/app/playGame', JSON.stringify(msg), {})
			}
		}

		/**
		 * * Connect to game, send email as payload,
		 * * set starting board
		 */
		function connectToGame() {
			if (stompClient && stompClient.connected) {
				resetBoard()
				const msg = {
					nickname: state.user.nickname
				}
				console.log(JSON.stringify(msg))
				stompClient.send('/app/startGame', JSON.stringify(msg), {})
				state.connectedToGame = true
				state.lookingForGame = true
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
			resetBoard()
		}

		// COMPUTED
		const getIsUserLoggedIn = computed(() => store.getters.getIsLoggedIn)
		const getUserInfo = computed(() => store.getters.getUser)
		watchEffect(() => {
			state.user = getUserInfo
		})

		return {
			...toRefs(state),
			connect,
			connectCallback,
			connectErrot,
			disconnect,
			send,
			connectToGame,
			disconnectFromGame,
			getIsUserLoggedIn,
			resetBoard,
			closeIsWinner,
			setTimerValue,
			whoWon
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

	.game-winner-overlay {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		border-radius: 15px;
		z-index: 10;

		.game-winner-modal {
			position: absolute;
			top: 50%;
			left: 50%;
			transform: translate(-50%, -50%);
			background-color: white;
			padding: 1rem;
			border-radius: 15px;

			h2 {
				margin: 0;
				text-align: center;
			}
		}
	}
}
</style>

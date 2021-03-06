<template>
	<div class="game-header">
		<h2>{{ getUser.nickname }}</h2>
		<h2>{{ formatMinutes }}:{{ formatSeconds }}</h2>
		<h2>Score</h2>
	</div>
</template>

<script>
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { useStore } from 'vuex'

export default {
	setup(_, { emit }) {
		const store = useStore()
		const timer = ref({
			minutes: 0,
			seconds: 0
		})

		let timerInterval = null
		onMounted(() => {
			resetTimer()
			window.eventBus.on('start-timer', () => {
				timer.value = {
					minutes: 0,
					seconds: 0
				}
				timerInterval = setInterval(setTimer, 1000)
			})
			window.eventBus.on('reset-timer', () => {
				emit('timer-value', formatTimer())
				clearInterval(timerInterval)
				timer.value = {
					minutes: 0,
					seconds: 0
				}
			})
		})

		onUnmounted(() => {
			resetTimer()
		})

		function formatTimer() {
			return formatMinutes.value + ':' + formatSeconds.value
		}

		function setTimer() {
			if (timer.value.seconds === 59) {
				timer.value.minutes++
				timer.value.seconds = 0
			} else {
				timer.value.seconds++
			}
		}

		function resetTimer() {
			clearInterval(timerInterval)
		}

		const formatSeconds = computed(() => {
			if (timer.value.seconds / 10 < 1) {
				return `0${timer.value.seconds}`
			} else {
				return timer.value.seconds
			}
		})

		const formatMinutes = computed(() => {
			if (timer.value.minutes / 10 < 1) {
				return `0${timer.value.minutes}`
			} else {
				return timer.value.minutes
			}
		})

		// computed
		const getUser = computed(() => store.getters.getUser)

		return {
			timer,
			formatSeconds,
			formatMinutes,
			setTimer,
			timerInterval,
			getUser,
			resetTimer,
			formatTimer
		}
	}
}
</script>

<style lang="scss" scoped>
@import url('https://fonts.googleapis.com/css2?family=VT323&display=swap');
.game-header {
	display: flex;
	align-items: center;
	height: 10%;

	h2 {
		font-family: 'VT323', monospace;
		flex-basis: 33.333%;
		text-align: center;
		font-size: 2rem;
	}
}
</style>

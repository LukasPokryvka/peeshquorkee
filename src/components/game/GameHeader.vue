<template>
	<div class="game-header">
		<h2>{{ user.nickname }}</h2>
		<h2>{{ formatMinutes }}:{{ formatSeconds }}</h2>
		<h2>Score</h2>
	</div>
</template>

<script>
import { computed, onMounted, onUnmounted, ref } from 'vue'

export default {
	props: {
		user: {
			type: Object
		}
	},
	setup() {
		const timer = ref({
			minutes: 0,
			seconds: 0
		})

		let timerInterval = null
		onMounted(() => {
			window.eventBus.on('start-timer', () => {
				timer.value = {
					minutes: 0,
					seconds: 0
				}
				timerInterval = setInterval(setTimer, 1000)
			})
			window.eventBus.on('reset-timer', () => {
				clearInterval(timerInterval)
			})
		})

		onUnmounted(() => {
			clearInterval(timerInterval)
		})

		function setTimer() {
			if (timer.value.seconds === 59) {
				timer.value.minutes++
				timer.value.seconds = 0
			} else {
				timer.value.seconds++
			}
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

		return {
			timer,
			formatSeconds,
			formatMinutes,
			setTimer,
			timerInterval
		}
	}
}
</script>

<style lang="scss" scoped>
.game-header {
	display: flex;
	justify-content: space-around;
	align-items: center;
	height: 10%;
}
</style>

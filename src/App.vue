<template>
	<div class="app-content">
		<AppHeader />
		<main>
			<Game />
			<Chat />
		</main>
		<AppFooter />
	</div>
</template>

<script>
import AppHeader from './components/AppHeader'
import AppFooter from './components/AppFooter'
import Chat from './components/chat/Chat'
import Game from './components/game/Game'

import axios from 'axios'
import { useStore } from 'vuex'
import { onMounted } from 'vue'

export default {
	name: 'App',
	components: { AppHeader, AppFooter, Chat, Game },
	setup() {
		const store = useStore()
		onMounted(() => {
			axios.get('http://192.168.100.24:42069/avatarGallery').then(res => {
				store.dispatch('loadAvatars', res.data.avatars)
			})
		})
	}
}
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500&display=swap');
#app {
	font-family: 'Montserrat', sans-serif;
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
	color: #2c3e50;
	height: 100%;
}

.app-content {
	height: 100%;
	display: flex;
	flex-flow: column;
	justify-content: space-between;
}

main {
	display: flex;
	justify-content: space-around;
	align-items: center;
	padding: 2rem;
}
</style>

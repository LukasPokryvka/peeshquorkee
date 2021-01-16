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

export default {
	name: 'App',
	components: { AppHeader, AppFooter, Chat, Game }
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

<template>
	<header>
		<div v-if="!getIsUserLoggedIn" class="header-actions">
			<button @click="state.isLoginModal = true" class="header-login">
				Login
			</button>
			<button @click="state.isRegisterModal = true" class="header-register">
				Register
			</button>
		</div>
		<div class="header-credentials" v-else>
			<h2>
				<img :src="getUser.avatar" alt="avatar" /> Welcome,
				{{ getUser.nickname }}
			</h2>
			<button @click="logout()" class="header-logout">Logout</button>
		</div>
		<h1>Peeshquorkee</h1>
	</header>
	<Modal v-if="state.isLoginModal" @close-modal="state.isLoginModal = false">
		<Login @close-login-modal="handleLogin" />
	</Modal>
	<Modal
		v-if="state.isRegisterModal"
		@close-modal="state.isRegisterModal = false"
	>
		<Register @close-register-modal="state.isRegisterModal = false" />
	</Modal>
</template>

<script>
import Login from './login/Login'
import Register from './register/Register'
import Modal from './Modal'
import { reactive, computed } from 'vue'
import { useStore } from 'vuex'

export default {
	components: { Modal, Login, Register },
	setup() {
		const store = useStore()
		const state = reactive({
			isLoginModal: false,
			isRegisterModal: false
		})

		function handleLogin() {
			state.isLoginModal = false
		}

		function logout() {
			store.dispatch('logout')
		}

		const getIsUserLoggedIn = computed(() => store.getters.getIsLoggedIn)
		const getUser = computed(() => store.getters.getUser)

		return { state, handleLogin, getIsUserLoggedIn, logout, getUser }
	}
}
</script>

<style lang="scss">
@import url('https://fonts.googleapis.com/css2?family=Pacifico&display=swap');
header {
	.header-actions {
		display: flex;
		justify-content: flex-end;
	}

	h1 {
		font-family: 'Pacifico', cursive;
		margin: 2rem 0;
		text-align: center;
		font-size: 4rem;
		text-shadow: #ffa9e5 3px 5px 2px;
	}

	.header-credentials {
		display: flex;
		justify-content: flex-end;
		align-items: center;

		.header-logout {
			background-color: #d65db1;
			transition: all 0.3s ease;
		}
		.header-logout:hover {
			background-color: #fc6dd0;
		}
	}

	h2 {
		margin: 0;
		color: white;
		margin-right: 10px;
		margin-top: 10px;
		font-size: 1.3rem;
		font-weight: 300;
		display: flex;
		align-items: center;

		img {
			object-fit: cover;
			border-radius: 50%;
			height: 40px;
			width: 40px;
			margin-right: 10px;
		}
	}

	div {
		button {
			height: 35px;
			margin-right: 10px;
			margin-top: 10px;
			border: none;
			color: white;
			padding: 0.3rem 1rem;
			border-radius: 15px;
		}
		.header-login {
			background-color: #d65db1;
			transition: all 0.3s ease;
		}
		.header-login:hover {
			background-color: #fc6dd0;
		}
		.header-register {
			background-color: #845ec2;
			transition: all 0.3s ease;
		}
		.header-register:hover {
			background-color: #9e70e8;
		}
	}
}

.modal-properties {
	padding: 2rem;

	.register-form {
		input {
			margin-top: 1rem;
		}
	}

	button {
		border: none;
		padding: 0.7rem 1rem;
		margin: 2rem auto 0 auto;
		display: block;
		border-radius: 15px;
		color: white;
	}

	form {
		width: 100%;

		label {
			display: block;
			margin-top: 1rem;
		}

		input {
			border-radius: 7px;
			border: 1px solid #888;
			padding: 0.5rem;
		}
	}

	h2 {
		margin: 0;
		text-align: center;
	}

	.button-login {
		background-color: #3bb17a;
	}
	.button-login:hover {
		background-color: #47d794;
	}
	.button-register {
		background-color: #176597;
	}
	.button-register:hover {
		background-color: #1c7ebd;
	}
}
</style>

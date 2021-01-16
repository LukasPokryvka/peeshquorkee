<template>
	<section class="modal-properties">
		<h2>Login</h2>
		<form @submit.prevent="login()">
			<div>
				<label>Email</label>
				<input v-model.trim="loginUser.email" placeholder="@" />
			</div>
			<div>
				<label>Password</label>
				<input v-model.trim="loginUser.password" type="password" />
				<p>
					<small>{{ loginUser.loginError }}</small>
				</p>
			</div>
			<button class="button-login">Login</button>
		</form>
	</section>
</template>

<script>
import md5 from 'md5'
import axios from 'axios'
import validator from 'validator'
import { ref } from 'vue'
import { useStore } from 'vuex'

export default {
	setup(_, { emit }) {
		const store = useStore()
		const loginUser = ref({
			email: '@',
			password: '',
			loginError: ''
		})
		const validation = ref(['wrongPassword', 'wrongCharacters', 'wrongEmail'])

		function login() {
			if (
				validator.isLength(loginUser.value.password, { min: 4, max: 12 }) &&
				validator.isEmail(loginUser.value.email)
			) {
				axios
					.post('http://192.168.100.25:4201/userLogin', {
						email: loginUser.value.email,
						password: md5(loginUser.value.password)
					})
					.then(res => {
						if (res.data.user === 'Not Registered') {
							console.log('nope')
						} else {
							emit('close-login-modal', res)
							store.dispatch('loginUser', res.data)
						}
					})
			} else {
				validateForm()
			}
		}

		function validateForm() {}

		return { loginUser, login, store, validation, validateForm }
	}
}
</script>

<style lang="scss" scoped></style>

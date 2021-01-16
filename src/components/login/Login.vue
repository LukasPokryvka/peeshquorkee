<template>
	<section class="modal-properties">
		<h2>Login</h2>
		<form @submit.prevent="login()">
			<div>
				<label>Email</label>
				<input
					v-model.trim="loginUser.email"
					placeholder="@"
					:class="{ invalid: loginUser.emailInvalid }"
				/>
			</div>
			<div>
				<label>Password</label>
				<input
					v-model.trim="loginUser.password"
					type="password"
					:class="{ invalid: loginUser.passwordInvalid }"
				/>
				<small v-if="loginUser.notRegistered">Wrong email or password</small>
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
			emailInvalid: false,
			passwordInvalid: false,
			notRegistered: false
		})
		const validation = ref(['wrongPassword', 'wrongCharacters', 'wrongEmail'])

		/**
		 * * Loggin in, chceking if not registered, or registered
		 */
		function login() {
			loginUser.value.notRegistered = false

			if (validateLogin()) {
				axios
					.post('http://192.168.100.25:4201/userLogin', {
						email: loginUser.value.email,
						password: md5(loginUser.value.password)
					})
					.then(res => {
						if (res.data.user === 'Not Registered') {
							loginUser.value.notRegistered = true
						} else {
							emit('close-login-modal', res)
							store.dispatch('loginUser', res.data)
						}
					})
			}
		}

		/**
		 * * Validation of the login
		 * ! simplify code
		 */
		function validateLogin() {
			loginUser.value.emailInvalid = false
			loginUser.value.passwordInvalid = false

			if (validator.isEmail(loginUser.value.email)) {
				if (validator.isLength(loginUser.value.password, { min: 4, max: 12 })) {
					if (validator.isAlphanumeric(loginUser.value.password)) {
						return true
					} else {
						loginUser.value.passwordInvalid = true
						return false
					}
				} else {
					loginUser.value.passwordInvalid = true
					return false
				}
			} else {
				loginUser.value.emailInvalid = true
				return false
			}
		}

		return { loginUser, login, store, validation, validateLogin }
	}
}
</script>

<style lang="scss" scoped>
.invalid {
	border: 2px solid red;
}

small {
	display: block;
	color: red;
}
</style>

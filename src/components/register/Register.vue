<template>
	<section class="modal-properties">
		<h2>Register</h2>
		<form @submit.prevent="register()" class="register-form">
			<div>
				<input
					v-model.trim="registerUser.nickname"
					:class="{ invalid: registerUser.nickInvalid }"
					type="text"
					placeholder="Nickname"
				/>
			</div>
			<div>
				<input
					v-model.trim="registerUser.email"
					:class="{ invalid: registerUser.emailInvalid }"
					type="email"
				/>
			</div>
			<div>
				<input
					v-model.trim="registerUser.password"
					:class="{ invalid: registerUser.passwordInvalid }"
					type="password"
					placeholder="Password"
				/>
			</div>
			<div>
				<input
					v-model.trim="registerUser.avatar"
					:class="{ invalid: registerUser.avatarInvalid }"
					type="text"
					placeholder="Avatar link"
				/>
			</div>
			<button class="button-register">Register</button>
		</form>
	</section>
</template>

<script>
import { ref } from 'vue'
import md5 from 'md5'
import axios from 'axios'
import validator from 'validator'

export default {
	setup(_, { emit }) {
		const registerUser = ref({
			nickname: '',
			email: '@',
			password: '',
			avatar: '',
			nickInvalid: false,
			emailInvalid: false,
			passwordInvalid: false,
			avatarInvalid: false
		})

		/**
		 * * Register user
		 * TODO check payload as registerUser.value instead of spread operator
		 */
		const register = () => {
			if (validateRegister()) {
				registerUser.value.password = md5(registerUser.value.password)
				axios
					.post('http://192.168.100.24:42069/userRegister', {
						...registerUser.value
					})
					.then(res => {
						emit('close-register-modal')
						console.log(res)
					})
			}
		}

		/**
		 * * Validate register form based on input
		 * ! Simplify code
		 */
		function validateRegister() {
			registerUser.value.nickInvalid = false
			registerUser.value.emailInvalid = false
			registerUser.value.passwordInvalid = false
			registerUser.value.avatarInvalid = false

			if (
				validator.isLength(registerUser.value.nickname, { min: 3, max: 12 }) &&
				validator.isAlphanumeric(registerUser.value.nickname)
			) {
				if (validator.isEmail(registerUser.value.email)) {
					if (
						validator.isLength(registerUser.value.password, {
							min: 5,
							max: 12
						}) &&
						validator.isAlphanumeric(registerUser.value.password)
					) {
						if (
							registerUser.value.avatar.length === 0 ||
							validator.isURL(registerUser.value.avatar)
						) {
							return true
						} else {
							registerUser.value.avatarInvalid = true
							return false
						}
					} else {
						registerUser.value.passwordInvalid = true
						return false
					}
				} else {
					registerUser.value.emailInvalid = true
					return false
				}
			} else {
				registerUser.value.nickInvalid = true
				return false
			}
		}

		return { registerUser, register, validateRegister }
	}
}
</script>

<style lang="scss" scoped>
.invalid {
	border: 2px solid red;
}
</style>

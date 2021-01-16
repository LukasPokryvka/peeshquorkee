<template>
	<section class="modal-properties">
		<h2>Register</h2>
		<form @submit.prevent="register()" class="register-form">
			<div>
				<input
					v-model.trim="registerUser.nickname"
					type="text"
					placeholder="Nickname"
				/>
			</div>
			<div>
				<input v-model.trim="registerUser.email" type="email" />
			</div>
			<div>
				<input
					v-model.trim="registerUser.password"
					type="password"
					placeholder="Password"
				/>
			</div>
			<div>
				<input
					v-model.trim="registerUser.avatar"
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

export default {
	setup(_, { emit }) {
		const registerUser = ref({
			nickname: '',
			email: '@',
			password: '',
			avatar: ''
		})

		const register = () => {
			registerUser.value.password = md5(registerUser.value.password)
			axios
				.post('http://192.168.100.25:4200/userRegister', {
					...registerUser.value
				})
				.then(res => {
					emit('close-register-modal')
					console.log(res)
				})
		}

		return { registerUser, register }
	}
}
</script>

<style lang="scss" scoped></style>

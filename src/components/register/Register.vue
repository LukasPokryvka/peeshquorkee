<template>
	<section class="modal-properties" @keydown.esc="closeAvatar()">
		<h2>Register</h2>
		<form @submit.prevent="register()" class="register-form">
			<div>
				<input
					v-model.trim="registerUser.nickname"
					:class="{ invalid: nickInvalid }"
					type="text"
					placeholder="Nickname"
				/>
			</div>
			<div>
				<input
					v-model.trim="registerUser.email"
					:class="{ invalid: emailInvalid }"
					type="email"
				/>
			</div>
			<div>
				<input
					v-model.trim="registerUser.password"
					:class="{ invalid: passwordInvalid }"
					type="password"
					placeholder="Password"
				/>
			</div>
			<RegisterAvatar
				:avatars="avatars"
				:selectedAvatar="selectedAvatar"
				@select-avatar="selectAvatar($event)"
			/>
			<button class="button-register" type="submit">Register</button>
		</form>
	</section>
</template>

<script>
import { computed, onBeforeMount, reactive, toRefs, watchEffect } from 'vue'
import md5 from 'md5'
import axios from 'axios'
import validator from 'validator'
import RegisterAvatar from './RegisterAvatar'
import { useStore } from 'vuex'

export default {
	components: {
		RegisterAvatar
	},
	setup(_, { emit }) {
		const store = useStore()
		const state = reactive({
			registerUser: {
				nickname: '',
				email: '@',
				password: ''
			},
			nickInvalid: false,
			emailInvalid: false,
			passwordInvalid: false,
			avatarInvalid: false,
			avatarSelected: '',
			avatars: [],
			selectedAvatar: null
		})

		onBeforeMount(() => {
			state.selectedAvatar = 0
		})

		function selectAvatar(avatarIndex) {
			state.selectedAvatar = avatarIndex
		}

		/**
		 * * Register user
		 * TODO check payload as registerUser.value instead of spread operator
		 */
		const register = () => {
			if (validateRegister()) {
				state.registerUser.password = md5(state.registerUser.password)
				axios
					.post('http://192.168.100.24:42069/userRegister', {
						...state.registerUser,
						avatar: state.selectedAvatar
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
			state.registerUser.nickInvalid = false
			state.registerUser.emailInvalid = false
			state.registerUser.passwordInvalid = false

			if (
				validator.isLength(state.registerUser.nickname, { min: 3, max: 12 }) &&
				validator.isAlphanumeric(state.registerUser.nickname)
			) {
				if (validator.isEmail(state.registerUser.email)) {
					if (
						validator.isLength(state.registerUser.password, {
							min: 5,
							max: 12
						}) &&
						validator.isAlphanumeric(state.registerUser.password)
					) {
						return true
					} else {
						state.passwordInvalid = true
						return false
					}
				} else {
					state.emailInvalid = true
					return false
				}
			} else {
				state.nickInvalid = true
				return false
			}
		}

		// COMPUTED
		const getAvatars = computed(() => store.getters.getAvatars)
		watchEffect(() => {
			state.avatars = getAvatars
		})

		return {
			...toRefs(state),
			register,
			validateRegister,
			getAvatars,
			selectAvatar
		}
	}
}
</script>

<style lang="scss" scoped>
.invalid {
	border: 2px solid red;
}

.button-register {
	margin-top: 1.2rem;
}

.button-avatar {
	background-color: #d65db1;
}
.button-avatar:hover {
	background-color: #fc6dd0;
}
</style>

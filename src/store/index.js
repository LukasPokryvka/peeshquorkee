import { createStore } from 'vuex'
import createPersistedState from 'vuex-persistedstate'

const store = createStore({
	state() {
		return {
			user: {},
			isLoggedIn: false,
			avatars: []
		}
	},
	mutations: {
		SET_USER(state, payload) {
			console.log('SET USER: ')
			console.log(payload)
			state.user = payload
		},
		SET_IS_LOGGED_IN(state, payload) {
			state.isLoggedIn = payload
		},
		SET_AVATARS(state, payload) {
			state.avatars = payload
		}
	},
	actions: {
		loginUser(context, payload) {
			context.commit('SET_USER', payload)
			context.commit('SET_IS_LOGGED_IN', true)
		},
		logout(context) {
			context.commit('SET_USER', {})
			context.commit('SET_IS_LOGGED_IN', false)
		},
		loadAvatars(context, payload) {
			context.commit('SET_AVATARS', payload)
		}
	},
	getters: {
		getUser: state => {
			return state.user
		},
		getIsLoggedIn: state => {
			return state.isLoggedIn
		},
		getAvatars: state => {
			return state.avatars
		},
		getUserAvatar: state => index => {
			return state.avatars[index]
		}
	},
	plugins: [createPersistedState()]
})

export default store

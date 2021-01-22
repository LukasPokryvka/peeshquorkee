<template>
	<section
		@click="closeAvatar()"
		v-if="showAvatars"
		class="avatar-overlay"
	></section>

	<div class="avatar">
		<p>Choose your avatar</p>
		<img
			:src="`data:image/png;base64,${selectedAvatar}`"
			@click="showAvatars = true"
			class="img-preview"
		/>
		<transition name="pop">
			<div v-if="showAvatars" class="avatar-gallery">
				<h2>Choose your superpower</h2>
				<div>
					<div v-for="avatar in avatars" :key="avatar">
						<img
							:src="`data:image/png;base64,${avatar}`"
							alt="avatar"
							@click="selectAvatar(avatar)"
						/>
					</div>
				</div>
			</div>
		</transition>
	</div>
</template>

<script>
import { reactive, toRefs } from 'vue'
export default {
	props: {
		avatars: {
			type: Array
		},
		selectedAvatar: {
			type: String
		},
		avatarVisible: {
			type: Boolean
		}
	},
	emits: ['select-avatar'],
	setup(_, { emit }) {
		const state = reactive({
			showAvatars: false
		})

		function closeAvatar() {
			state.showAvatars = false
		}

		function selectAvatar(avatar) {
			emit('select-avatar', avatar)
			closeAvatar()
		}

		function closeAvatarEsc(e) {
			console.log(e)
		}

		return { ...toRefs(state), closeAvatar, selectAvatar, closeAvatarEsc }
	}
}
</script>

<style lang="scss" scoped>
.avatar-overlay {
	position: fixed;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	z-index: 40;
}
.avatar {
	display: flex;
	flex-flow: column;
	justify-content: center;
	align-items: center;
	margin-top: 0.7rem;
	position: relative;

	p {
		margin: 0 0 0.7rem 0;
	}

	.img-preview {
		transition: all 0.2s ease;
		width: 70px;
		height: 70px;
	}
	.img-preview:hover {
		transform: scale(1.05);
	}

	img {
		max-width: 100%;
		border-radius: 5px;
		cursor: pointer;
	}

	.avatar-gallery {
		display: flex;
		flex-flow: column;
		padding: 1rem;
		position: absolute;
		z-index: 50;
		border-radius: 10px;
		background-color: #845ec2;
		color: white;
		left: -35px;
		top: -50px;
		width: 300px;

		h2 {
			font-size: 1.3rem;
			margin-bottom: 1rem;
		}

		div {
			display: flex;
			flex-wrap: wrap;
			justify-content: space-between;
			div {
				flex-basis: 32%;
			}

			img {
				transition: all 0.2s ease;
			}
			img:hover {
				transform: scale(1.05);
			}
		}
	}
}

.pop-enter-active,
.pop-leave-active {
	transition: all 0.2s ease;
}

.pop-enter-from,
.pop-leave-to {
	opacity: 0;
	transform: scale(0.5);
}
</style>

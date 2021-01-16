<template>
	<li
		:class="message.email === userEmail ? 'origin-user' : 'other-user'"
		:title="timeOfChat(message.nickname, message.timestamp)"
	>
		<div>
			<small v-if="message.displayHeader" class="relative"
				>{{ timeOfChat(message.nickname, message.timestamp) }}
				<transition name="roll">
					<ChatPopup v-if="avatarHover" />
				</transition>
			</small>
		</div>
		<div>
			<img
				:src="message.avatar"
				alt=""
				v-if="message.displayHeader"
				@mouseover="avatarHover = true"
				@mouseleave="avatarHover = false"
			/>
			<div v-else style="height: 25px; width: 25px"></div>
			<p v-html="message.content"></p>
		</div>
	</li>
</template>

<script>
import { ref } from 'vue'
import { timeOfChat } from '../../utilities/timeUtilities'
import ChatPopup from './ChatPopup'

export default {
	components: { ChatPopup },
	props: {
		message: {
			type: Object
		},
		userEmail: {
			type: String
		}
	},
	setup() {
		const avatarHover = ref(false)
		return { timeOfChat, avatarHover }
	}
}
</script>

<style lang="scss" scoped>
li {
	display: flex;
	flex-flow: column;
	list-style: none;
	margin: 3px 0;

	.relative {
		position: relative;
	}

	p {
		max-width: 70%;
		color: white;
		margin: 0;
		padding: 0.3rem 0.7rem;
		border-radius: 15px;
		text-align: left;
	}

	div {
		display: flex;
		align-items: center;
		img {
			object-fit: cover;
			border-radius: 50%;
			height: 25px;
			width: 25px;
			z-index: 10;
		}
		small {
			margin-bottom: 3px;
		}
	}
}

.origin-user {
	text-align: right;

	div {
		flex-direction: row-reverse;

		div {
			margin-left: 5px;
		}
	}

	p {
		background-color: #845ec2;
		word-break: break-word;
	}

	img {
		margin-left: 5px;
	}
}

.other-user {
	justify-content: flex-start;

	p {
		background-color: #ff6f91;
		word-break: break-word;
	}

	img {
		margin-right: 5px;
	}
	div {
		div {
			margin-right: 5px;
		}
	}
}

.roll-enter-active,
.roll-leave-active {
	transition: all 0.1s ease-in;
}

.roll-enter-from,
.roll-leave-to {
	opacity: 0;
	transform: translateX(25%);
}
</style>

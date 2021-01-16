<template>
	<section @click="closeModal()" class="modal-background"></section>
	<div class="modal-body">
		<slot></slot>
	</div>
</template>

<script>
export default {
	emits: ['close-modal'],
	setup(_, { emit }) {
		function closeModal() {
			emit('close-modal')
		}

		return { closeModal }
	}
}
</script>

<style lang="scss" scoped>
.modal-background {
	position: fixed;
	top: 0;
	left: 0;
	z-index: 20;
	height: 100%;
	width: 100%;
	background-color: #ddd;
	opacity: 0.5;
}

.modal-body {
	position: absolute;
	z-index: 30;
	left: calc(50% - 130px);
	top: calc(50% - 200px);
	background-color: white;
	border-radius: 15px;
	box-shadow: 1px 1px 8px #333;
}
</style>

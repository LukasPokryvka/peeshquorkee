<template>
	<div class="chat-popup">
		<p>kokot</p>
		<p>kokot@gmail.com</p>
		<p>Score: 1337</p>
	</div>
</template>

<script>
export default {
	setup() {}
}
</script>

<style lang="scss" scoped>
.chat-popup {
	display: flex;
	position: absolute;
	flex-flow: column !important;
	background-color: #ff9671;
	color: white;
	font-weight: 500;
	font-size: 1rem;
	padding: 0.5rem;
	box-shadow: 0px 0px 5px #888;
	border-radius: 15px;
	z-index: 20;
	p {
		margin: 5px 0;
	}
}
</style>

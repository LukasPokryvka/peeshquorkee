/**
 * * Update scroll based on chat body height
 */
export default function updateScroll() {
	let element = document.getElementById('chat-body')
	element.scrollTop = element.scrollHeight
}

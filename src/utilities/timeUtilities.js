/**
 * @param {String} timestamp
 * * Replace T with ' ' and cut unnecessary characters
 */
function formatTimestamp(timestamp) {
	return timestamp.replace('T', ' ').substr(0, 19)
}

/**
 * * Get current timestamp and format it
 */
function getCurrentTimestamp() {
	const timezoneOffset = new Date().getTimezoneOffset() * 60000
	const localISOTime = new Date(Date.now() - timezoneOffset)
		.toISOString()
		.slice(0, -1)
	return formatTimestamp(localISOTime)
}

/**
 * @param {String} nickname
 * @param {String} timestamp
 * * Get timestamp of chatmessage and create return string
 * * based on timestamp. For today messages - nick + today, ...
 */
function timeOfChat(nickname, timestamp) {
	const dateAndTime = timestamp.split(' ')
	const time = dateAndTime[1].slice(0, -3)
	const date = dateAndTime[0]
	const currentDate = getCurrentTimestamp().split(' ')[0]

	if (date === currentDate) return nickname + ' ' + 'today ' + time
	else if (+currentDate.slice(-2) - +date.slice(-2) === 1) {
		if (currentDate.slice(0, -2) === date.slice(0, -2)) {
			return nickname + ' ' + 'yesterday ' + time
		}
	} else return nickname + ' ' + date + ' ' + time
}

export { formatTimestamp, getCurrentTimestamp, timeOfChat }

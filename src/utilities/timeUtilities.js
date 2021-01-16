function formatTimestamp(timestamp) {
	return timestamp.replace('T', ' ').substr(0, 19)
}

function getCurrentTimestamp() {
	const timezoneOffset = new Date().getTimezoneOffset() * 60000
	const localISOTime = new Date(Date.now() - timezoneOffset)
		.toISOString()
		.slice(0, -1)
	return formatTimestamp(localISOTime)
}

function getYesterdayTimestamp() {
	const date = new Date()
	const yesteday = date.setDate(date.getDate() - 1)
	const timezoneOffset = new Date().getTimezoneOffset() * 60000
	const localISOTime = new Date(yesteday - timezoneOffset)
		.toISOString()
		.slice(0, -1)
	return formatTimestamp(localISOTime)
}

function timeOfChat(nickname, timestamp) {
	const dateAndTime = timestamp.split(' ')
	const time = dateAndTime[1].slice(0, -3)
	const date = dateAndTime[0]
	const currentDate = getCurrentTimestamp().split(' ')[0]
	const yestedayDate = getYesterdayTimestamp().split(' ')[0]

	if (date === currentDate) return nickname + ' ' + 'today ' + time
	else if (+currentDate.slice(-2) - +yestedayDate.slice(-2) === 1)
		if (currentDate.slice(0, -2) === yestedayDate.slice(0, -2))
			return nickname + ' ' + 'yesterday ' + time
		else return nickname + ' ' + date + ' ' + time
}

export {
	formatTimestamp,
	getCurrentTimestamp,
	getYesterdayTimestamp,
	timeOfChat
}

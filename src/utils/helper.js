export function getBaseUrl() {
	const host = window.location.hostname
	const isLocalhost = host === 'localhost' || host === '127.0.0.1'
	const baseUrl = isLocalhost
		? 'http://localhost:5000'
		: 'https://art.playukraine.com'
	return baseUrl
}

/**
 * Gets normalized path to the image.
 * @param {string} imagePath Path to the image.
 * @param {string} defaultImage Default image to display, if imagePath is empty.
 * @returns {string} The normalized path to the image which should be displayed in the browser.
 */
export function getImageUrl(imagePath, defaultImage = '/img/placeholder.jpg') {
	const baseUrl = getBaseUrl()

	// 1) If no path, return the fallback
	if (!imagePath) {
		return defaultImage
	}

	// 2) If the path is already an absolute URL (http, https, data)
	if (/^(http|https|data):/.test(imagePath)) {
		return imagePath
	}

	// 3) Strip out leading '../../' or '../'
	//    (In case your stored paths include multiple '../' segments)
	let finalPath = imagePath.replace(/^(\.\.\/)+/, '')

	// 4) Ensure that baseUrl + finalPath forms one valid URL
	//    If your final path doesn't start with '/', you can add it:
	if (!finalPath.startsWith('/')) {
		finalPath = `/${finalPath}`
	}

	// Combine with baseUrl
	const featuredMediaUrl = `${baseUrl}${finalPath}`
	return featuredMediaUrl
}

export function getFormattedDate(date) {
	if (!date) return ''

	const formattedDate = new Date(date).toLocaleDateString('uk-UA', {
		year: 'numeric',
		month: 'long',
		day: 'numeric',
	})
	return formattedDate
}

export function getFormattedTime(date) {
	const formattedDate = new Date(date).toLocaleTimeString('uk-UA', {
		hour: 'numeric',
		minute: 'numeric',
		// hour: '2-digit',
		// minute: '2-digit',
	})
	return formattedDate
}

import axios from 'axios'
import PropTypes from 'prop-types'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast, ToastContainer } from 'react-toastify'

function LikeAndShare({ className, entityId, entityType, countClassName }) {
	const { t } = useTranslation()
	const [isLoading, setIsLoading] = useState(true)
	// { liked: false, likeCount: 0 }
	const [likeStatus, setLikeStatus] = useState({ liked: false, likeCount: 0 })

	useEffect(() => {
		const fetchLikeStatus = async () => {
			try {
				const token = localStorage.getItem('token')
				const headers = token
					? { Authorization: `Bearer ${token}` }
					: {}

				const response = await axios.get('/api/like/status', {
					params: { entityId, entityType },
					headers,
				})
				setLikeStatus({
					liked: response.data.liked,
					likeCount: response.data.likeCount,
				})
			} catch (error) {
				// If user not authenticated, just fetch count
				if (
					error.response?.status === 401 ||
					error.response?.status === 403
				) {
					try {
						const response = await axios.get('/api/like/count', {
							params: { entityId, entityType },
						})
						setLikeStatus((prev) => ({
							...prev,
							likeCount: response.data.likeCount,
						}))
					} catch (countError) {
						console.error(
							'[Front-end] => Error fetching like count:',
							countError,
						)
					}
				} else {
					console.error(
						'[Front-end] => Error fetching like status:',
						error,
					)
				}
			} finally {
				setIsLoading(false)
			}
		}

		fetchLikeStatus()
	}, [entityId, entityType])

	const handleLikeToggle = async () => {
		const token = localStorage.getItem('token')
		if (!token) {
			toast.error(t('Ви маєте бути зареєстровані для вподобайки'), {
				position: 'top-right',
			})
			return
		}

		// 1. Optimistic update
		setIsLoading(true)
		setLikeStatus((prev) => {
			// If currently liked, we want to decrement
			const newCount = prev.liked
				? prev.likeCount - 1
				: prev.likeCount + 1
			return { liked: !prev.liked, likeCount: newCount }
		})

		try {
			const headers = { Authorization: `Bearer ${token}` }
			const res = await axios.post(
				'/api/like/toggle',
				{ entityId, entityType },
				{ headers },
			)

			// 2. Update with server response
			setLikeStatus({
				liked: res.data.liked,
				likeCount: res.data.likeCount,
			})
		} catch (error) {
			console.error('[Front-end] => Error toggling like:', error)

			// 3. Revert optimistic update if fail
			setLikeStatus((prev) => {
				// If we last toggled from "true -> false", revert
				// But we need the original values. So let's get them from error or do a second fetch.
				// Simpler approach: re-fetch from server for the final truth
				return prev // temporarily keep the optimistic state
			})
			// Or re-fetch directly for true “revert”:
			try {
				const token = localStorage.getItem('token')
				const headers = token
					? { Authorization: `Bearer ${token}` }
					: {}
				const response = await axios.get('/api/like/status', {
					params: { entityId, entityType },
					headers,
				})
				// Overwrite state with real data
				setLikeStatus({
					liked: response.data.liked,
					likeCount: response.data.likeCount,
				})
			} catch (refetchError) {
				console.error(
					'[Front-end] => Error refetching status:',
					refetchError,
				)
			}

			// Show an error message
			if (error.response?.data?.error === 'Already liked') {
				toast.error(t('Вже вподобанно вами!'), {
					position: 'top-right',
				})
			} else {
				toast.error(t('Сталася помилка. Спробуйте ще раз.'), {
					position: 'top-right',
				})
			}
		} finally {
			setIsLoading(false)
		}
	}

	return (
		<div
			className={`${className ? className : ''} socialLikeAndShareInner`}
		>
			{countClassName ? (
				<div className={countClassName}>{likeStatus.likeCount}</div>
			) : (
				<div style={{ display: 'none' }}>{likeStatus.likeCount}</div>
			)}
			<button
				className={`socialLikeAndShareInner__likeButton circleButton ${likeStatus.liked ? 'liked' : ''}`}
				onClick={handleLikeToggle}
				disabled={isLoading}
			>
				<img
					className="likeButtonImg"
					src="/Img/likeHeart.svg"
					alt={t('Світлина вподобайки')}
					onError={(e) => {
						e.target.onerror = null
						e.target.src = '/Img/likeHeart.svg'
					}}
				/>
			</button>
			<ToastContainer />
			<button className="socialLikeAndShareInner__shareButton circleButton">
				<img
					className="shareButtonImg"
					src="/Img/shareArrow.svg"
					alt={t('Світлина вподобайки')}
					onError={(e) => {
						e.target.onerror = null
						e.target.src = '/Img/likeHeart.svg'
					}}
				/>
			</button>
		</div>
	)
}

LikeAndShare.propTypes = {
	className: PropTypes.string,
	entityId: PropTypes.number.isRequired,
	entityType: PropTypes.string.isRequired,
	countClassName: PropTypes.string,
}

export default LikeAndShare

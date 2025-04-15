import LikeAndShare from '@components/Blocks/LikeAndShare'
import sliderStyles from '@styles/components/Blocks/Slider.module.scss'
import styles from '@styles/components/ProductItemCard/ItemDetail.module.scss'
import axios from 'axios'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { IconContext } from 'react-icons/lib'
import { LuZoomIn } from 'react-icons/lu'
import { useNavigate, useParams } from 'react-router-dom'
import { getImageUrl } from '../../../utils/helper.js'
import TranslatedContent from '../../components/Blocks/TranslatedContent'
import ZoomableImage from '../../components/Blocks/Zoomable.jsx'

function ItemDetail({ index }) {
	const { t } = useTranslation()
	const [product, setProduct] = useState([])
	const { id } = useParams()
	const [isExpanded, setIsExpanded] = useState(false)
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState(null)
	const [creator, setCreator] = useState({})
	const navigate = useNavigate()

	const [zoomState, setZoomState] = useState({
		zoomLevel: 1,
		isZoomed: false,
		cursorPos: { x: 0, y: 0 },
		showLens: false,
	})

	useEffect(() => {
		const fetchProduct = async () => {
			try {
				// 1) Fetch the product by ID
				const response = await axios.get(`/api/products/${id}`)
				const fetchedProduct = response.data.product

				// 2) Store the product in state
				setProduct(fetchedProduct)
			} catch (err) {
				console.error('Error fetching product:', err)
				setError('Failed to load product data.')
			} finally {
				setLoading(false)
			}
		}

		fetchProduct()
	}, [id])

	if (loading) return <div>Loading product...</div>
	if (error) return <div>{error}</div>
	if (!product) return <div>Product not found.</div>

	// 3) If your product includes `author`, you can store that separately or just use product.author
	const author = product.author || {}

	const featuredMediaUrl =
		product.images && product.images.length > 0
			? getImageUrl(product.images[0].imageUrl, '/Img/halfNewsCard.jpg')
			: '/Img/halfNewsCard.jpg'

	const handleZoomIn = () => {
		setZoomState((prev) => ({
			...prev,
			zoomLevel: Math.min(prev.zoomLevel + 0.5, 5),
			isZoomed: true,
		}))
	}
	const handleZoomOut = () => {
		setZoomState((prev) => ({
			...prev,
			zoomLevel: Math.max(prev.zoomLevel - 0.5, 1),
			isZoomed: prev.zoomLevel - 0.5 > 1,
		}))
	}
	const handleMouseMove = (e) => {
		const rect = e.currentTarget.getBoundingClientRect()
		const x = e.clientX - rect.left
		const y = e.clientY - rect.top
		setZoomState((prev) => ({
			...prev,
			cursorPos: { x, y },
		}))
	}
	const handleMouseEnter = () => {
		setZoomState((prev) => ({ ...prev, showLens: true }))
	}
	const handleMouseLeave = () => {
		setZoomState((prev) => ({
			...prev,
			showLens: false,
			cursorPos: { x: 0, y: 0 },
		}))
	}
	const handleToggleZoom = () => {
		setZoomState((prev) => ({
			...prev,
			isZoomed: !prev.isZoomed,
			zoomLevel: !prev.isZoomed ? 2 : 1,
		}))
	}

	const handleAuthorPreviewClick = (id) => {
		navigate(`/artist/${id}`)
	}

	const handleAuthorsPageClick = () => {
		navigate('/artists-page')
	}
	const toggleText = () => {
		setIsExpanded((prevState) => !prevState)
	}
	return (
		<div className={styles.ItemDetailContainer}>
			<div className={`${styles.ItemPageNavigationContainer}`}>
				<nav className={`${styles.ItemPageNavigation}`}>
					<ul className={`${styles.ItemPageNavigationList}`}>
						<li
							className={`${styles.ItemPageNavigationItem}`}
							onClick={handleAuthorsPageClick}
						>
							{t('Митці')}
						</li>
						<p
							className={`${styles.ItemPageNavigationItemSeparator}`}
						>
							&#8250;
						</p>
						<li
							className={`${styles.ItemPageNavigationItem}`}
							onClick={() => handleAuthorPreviewClick(author.id)}
						>
							<TranslatedContent
								en={author.title}
								uk={author.title}
								html
							/>
						</li>
						<p
							className={`${styles.ItemPageNavigationItemSeparator}`}
						>
							&#8250;
						</p>
						<li className={`${styles.ItemPageNavigationItem}`}>
							<TranslatedContent
								en={product.title_en}
								uk={product.title_uk}
								html
							/>
						</li>
					</ul>
				</nav>
			</div>
			<div className={`${styles.ItemDetailTopContainer}`}>
				<div className={`${styles.ItemDetailImageContainer}`}>
					<div className={`${styles.ItemDetailImageWrapper}`}>
						<ZoomableImage
							imageUrl={featuredMediaUrl}
							zoomState={zoomState}
							handleZoomIn={handleZoomIn}
							handleZoomOut={handleZoomOut}
							handleMouseMove={handleMouseMove}
							handleMouseEnter={handleMouseEnter}
							handleMouseLeave={handleMouseLeave}
							handleToggleZoom={handleToggleZoom}
							key={index}
						/>
						<div
							className={`${styles.ItemDetailZoomButtonWrapper}`}
						>
							<button
								className={`${styles.ItemDetailZoomButton}`}
							>
								<IconContext.Provider
									value={{
										size: 40,
										fill: 'black',
										style: {
											backgroundColor: 'white', // add your background color
											padding: '8px', // add your padding
											borderRadius: '50%', // optional, if you want rounded corners
											// any other styling you need
										},
									}}
								>
									<LuZoomIn />
								</IconContext.Provider>
							</button>
						</div>
					</div>
				</div>
			</div>
			<div className={`${styles.ItemDetailBottomContainer}`}>
				<div className={`${styles.ItemDetailLeftContainer}`}>
					<div className={`${styles.ItemDetailTitleWrapper}`}>
						<h2 className={`${styles.ItemDetailTitle}`}>
							<p>
								<TranslatedContent
									en={product.title_en}
									uk={product.title_uk}
									html
								/>
							</p>
						</h2>
					</div>
					<div
						className={`${styles.ItemDetailDateOfCreationWrapper}`}
					>
						<p className={`${styles.ItemDetailDateOfCreation}`}>
							<TranslatedContent
								uk={product.dateofcreation}
								en={product.dateofcreation}
								html
							/>
						</p>
					</div>
					<LikeAndShare
						className={`${sliderStyles.LikeAndShareFixed} ${styles.ItemDetailLikeAndShare}`}
						countClassName={sliderStyles.likeCountWrapper}
						entityId={product.id}
						entityType="product"
					/>

					<div className={`${styles.ItemDetailAboutContainer}`}>
						<div
							className={`${styles.ItemDetailArtistNameWrapper}`}
						>
							<p className={`${styles.ItemDetailArtistName}`}>
								{t('product.authorTitle')}&#58;
							</p>
							<p
								className={`${styles.ItemDetailArtistNameValue}`}
								onClick={() =>
									handleAuthorPreviewClick(author.id)
								}
							>
								<TranslatedContent
									en={author.title}
									uk={author.title}
									html
								/>
							</p>
						</div>
						<div className={`${styles.ItemDetailSizeWrapper}`}>
							<p className={`${styles.ItemDetailSize}`}>
								{t('product.Size')}&#58;
							</p>
							<p className={`${styles.ItemDetailSizeValue}`}>
								<TranslatedContent
									en={product.size}
									uk={product.size}
									html
								/>
							</p>
						</div>
						<div className={`${styles.ItemDetailStileWrapper}`}>
							<p className={`${styles.ItemDetailStile}`}>
								{t('product.Style')}&#58;
							</p>
							<p className={`${styles.ItemDetailStileValue}`}>
								<TranslatedContent
									en={product.style_en}
									uk={product.style_uk}
									html
								/>
							</p>
						</div>
						<div
							className={`${styles.ItemDetailOriginalTitleWrapper}`}
						>
							<p className={`${styles.ItemDetailOriginalTitle}`}>
								{t('product.OriginalTitle')}&#58;
							</p>
							<p
								className={`${styles.ItemDetailOriginalTitleValue}`}
							>
								<p>
									<TranslatedContent
										en={product.title_en}
										uk={product.title_uk}
										html
									/>
								</p>
							</p>
						</div>
						<div className={`${styles.ItemDetailTechniqueWrapper}`}>
							<p className={`${styles.ItemDetailTechnique}`}>
								{t('product.Tech')}&#58;
							</p>
							<p className={`${styles.ItemDetailTechniqueValue}`}>
								<TranslatedContent
									en={product.technique_en}
									uk={product.technique_uk}
									html
								/>
							</p>
						</div>
					</div>
				</div>
				<div className={`${styles.ItemDetailRightContainer}`}>
					<div
						className={`${styles.ItemDetailDescriptionWrapper} ${isExpanded ? styles.expandedexpanded : ''}`}
					>
						<p className={`${styles.ItemDetailDescription}`}>
							<TranslatedContent
								en={product.description_en}
								uk={product.description_uk}
								html
							/>
						</p>
					</div>
					<button
						className={`${styles.ItemDetailReadMoreButton}`}
						onClick={toggleText}
					>
						{isExpanded ? t('Згорнути текст') : t('Читати далі')}
					</button>
				</div>
			</div>
		</div>
	)
}

export default ItemDetail

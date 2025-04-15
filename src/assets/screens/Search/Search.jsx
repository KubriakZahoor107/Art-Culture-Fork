import PropTypes from 'prop-types'
import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import styles from '../../../styles/screen/Search/Search.module.scss'
import API from '../../../utils/api'

function SearchResult({ className, searchInput, styleInput, placeholderName }) {
	const { t } = useTranslation()
	const [searchQuery, setSearchQuery] = useState('')
	const [results, setResults] = useState({
		authors: [],
		products: [],
		exhibitions: [],
		posts: [],
		museums: [],
	})
	const [page, setPage] = useState(1)
	const [hasMore, setHasMore] = useState(true)
	const [isFetching, setIsFetching] = useState(false)
	const [filters, setFilters] = useState({
		authors: true,
		products: true,
		exhibitions: true,
		posts: true,
		museums: true,
	})
	const navigate = useNavigate()
	const resultsRef = useRef(null)

	const defaultAuthor = '/Img/ArtistPhoto.jpg'
	const defaultProduct = '/Img/newsCardERROR.jpg'

	const getImageUrl = (path) => {
		if (!path || typeof path !== 'string') return ''
		return path.startsWith('/') ? path : `/${path}`
	}

	// Helper to fetch results (page 1) using current searchQuery and filters.
	const fetchResults = async (query, activeFilters, pageNumber = 1) => {
		try {
			const response = await API.get(
				`/search/all-search?q=${query}&page=1&limit=30&filter=${activeFilters}`,
			)
			const {
				searchAllAuthors,
				searchAllProduct,
				searchAllPosts,
				searchAllExhibitions,
			} = response.data
			const allAuthors = searchAllAuthors || []
			const museumAuthors = allAuthors.filter((a) => a.role === 'MUSEUM')
			const nonMuseumAuthors = allAuthors.filter(
				(a) => a.role !== 'MUSEUM',
			)

			if (pageNumber === 1) {
				setResults({
					authors: nonMuseumAuthors,
					museums: museumAuthors,
					exhibitions: searchAllExhibitions || [],
					products: searchAllProduct || [],
					posts: searchAllPosts || [],
				})
			} else {
				setResults((prev) => ({
					authors: [...prev.authors, ...nonMuseumAuthors],
					museums: [...prev.museums, ...museumAuthors],
					exhibitions: [
						...prev.exhibitions,
						...(searchAllExhibitions || []),
					],
					products: [...prev.products, ...(searchAllProduct || [])],
					posts: [...prev.posts, ...(searchAllPosts || [])],
				}))
			}
			setPage(pageNumber)
			// If fewer than 30 items returned in every category, assume no more results.
			if (
				(searchAllAuthors?.length || 0) < 30 &&
				(searchAllProduct?.length || 0) < 30 &&
				(searchAllPosts?.length || 0) < 30 &&
				(searchAllExhibitions?.length || 0) < 30
			) {
				setHasMore(false)
			} else {
				setHasMore(true)
			}
		} catch (error) {
			console.error('Error fetching search result', error)
		}
	}

	// When the search query changes
	const handleSearchChange = async (e) => {
		const query = e.target.value
		setSearchQuery(query)
		if (query.length > 2) {
			// Reset pagination when query changes.
			setPage(1)
			setHasMore(true)
			const activeFilters = Object.keys(filters)
				.filter((key) => filters[key])
				.join(',')
			await fetchResults(query, activeFilters)
		} else {
			setResults({
				authors: [],
				museums: [],
				exhibitions: [],
				products: [],
				posts: [],
			})
			setPage(1)
			setHasMore(true)
		}
	}

	// Re-fetch results when filters change (and query exists)
	useEffect(() => {
		if (searchQuery.length > 2) {
			const activeFilters = Object.keys(filters)
				.filter((key) => filters[key])
				.join(',')
			// Reset pagination
			setPage(1)
			setHasMore(true)
			fetchResults(searchQuery, activeFilters)
		}
	}, [filters])

	// Infinite scroll handler: fetch next page if near bottom.
	const fetchPage = async (pageNumber) => {
		setIsFetching(true)
		try {
			const activeFilters = Object.keys(filters)
				.filter((key) => filters[key])
				.join(',')
			const response = await API.get(
				`/search/all-search?q=${searchQuery}&page=${pageNumber}&limit=30&filter=${activeFilters}`,
			)
			const { searchAllAuthors, searchAllProduct, searchAllPosts } =
				response.data
			// Append new data to existing results
			setResults((prev) => ({
				authors: [...prev.authors, ...(searchAllAuthors || [])],
				products: [...prev.products, ...(searchAllProduct || [])],
				posts: [...prev.posts, ...(searchAllPosts || [])],
			}))
			setPage(pageNumber)
			if (
				(searchAllAuthors?.length || 0) < 30 &&
				(searchAllProduct?.length || 0) < 30 &&
				(searchAllPosts?.length || 0) < 30
			) {
				setHasMore(false)
			}
		} catch (error) {
			console.error('Error fetching page', error)
		} finally {
			setIsFetching(false)
		}
	}

	useEffect(() => {
		const resultsDiv = resultsRef.current
		if (!resultsDiv) return

		const handleScroll = () => {
			if (
				resultsDiv.scrollHeight -
					resultsDiv.scrollTop -
					resultsDiv.clientHeight <
					100 &&
				hasMore &&
				!isFetching
			) {
				fetchPage(page + 1)
			}
		}

		resultsDiv.addEventListener('scroll', handleScroll)
		return () => resultsDiv.removeEventListener('scroll', handleScroll)
	}, [page, hasMore, isFetching])

	// Navigation handlers remain unchanged.
	const handleRoleClick = (author) => {
		switch (author.role) {
			case 'MUSEUM':
				navigate(`/museum-page/${author.id}`)
				break
			case 'EXHIBITION':
				navigate(`/all-author-posts/${author.id}`)
				break
			case 'CREATOR':
				navigate(`/artist/${author.id}`)
				break
			case 'AUTHOR':
				navigate(`/all-author-posts/${author.id}`)
				break
			default:
				navigate(`/artist/${author.id}`)
				break
		}
	}

	const handlePostPageClick = (post) => {
		navigate(`/posts/${post.id}`)
	}

	const toggleFilter = (filterName) => {
		setFilters((prev) => ({ ...prev, [filterName]: !prev[filterName] }))
	}

	const handleExhibitionClick = (exhibition) => {
		navigate(`/exhibitions/${exhibition.id}`)
	}

	return (
		<div className={`${styles.searchWrapper} ${className || ''}`}>
			<input
				type="text"
				className={`${styles.searchInputWrapper} ${searchInput || ''}`}
				style={styleInput}
				value={searchQuery}
				onChange={handleSearchChange}
				placeholder={placeholderName || t('Пошук')}
			/>

			{/* Filter Controls */}
			{searchQuery.length > 2 && (
				<div className={styles.filterControls}>
					<>
						<h2>{t('Оберіть категорію:')}</h2>
					</>
					<label>
						<input
							type="checkbox"
							checked={filters.authors}
							onChange={() => toggleFilter('authors')}
						/>
						{t('Автори')}
					</label>
					<label>
						<input
							type="checkbox"
							checked={filters.museums}
							onChange={() => toggleFilter('museums')}
						/>
						{t('Музеї')}
					</label>
					<label>
						<input
							type="checkbox"
							checked={filters.exhibitions}
							onChange={() => toggleFilter('exhibitions')}
						/>
						{t('Виставки')}
					</label>
					<label>
						<input
							type="checkbox"
							checked={filters.products}
							onChange={() => toggleFilter('products')}
						/>
						{t('Вироби')}
					</label>
					<label>
						<input
							type="checkbox"
							checked={filters.posts}
							onChange={() => toggleFilter('posts')}
						/>
						{t('Новини')}
					</label>
				</div>
			)}

			{searchQuery.length > 2 && (
				<div ref={resultsRef} className={styles.resultsWrapper}>
					{/* Display Authors */}
					{filters.authors && results.authors.length > 0 && (
						<div className={styles.itemContainer}>
							<h2>{t('Автори')}</h2>
							<div className={styles.itemWrapper}>
								{results.authors.map((author) => (
									<div
										className={styles.itemInfo}
										key={author.id}
										onClick={() => handleRoleClick(author)}
									>
										<img
											src={getImageUrl(
												author.images || defaultAuthor,
											)}
											alt={author.title || author.email}
										/>
										<div className={styles.itemInfoTitle}>
											<p>
												{author.title || author.email}
											</p>
										</div>
									</div>
								))}
							</div>
						</div>
					)}

					{/* Display Museums */}
					{filters.museums && results.museums.length > 0 && (
						<div className={styles.itemContainer}>
							<h2>{t('Музеї')}</h2>
							<div className={styles.itemWrapper}>
								{results.museums.map((museum) => (
									<div
										className={styles.itemInfo}
										key={museum.id}
										onClick={() => handleRoleClick(museum)}
									>
										<img
											src={getImageUrl(
												museum.images || defaultAuthor,
											)}
											alt={museum.title || museum.email}
										/>
										<div className={styles.itemInfoTitle}>
											<p>
												{museum.title || museum.email}
											</p>
										</div>
									</div>
								))}
							</div>
						</div>
					)}

					{/* Display Exhibitions */}
					{filters.exhibitions && results.exhibitions.length > 0 && (
						<div className={styles.itemContainer}>
							<h2>{t('Виставки')}</h2>
							<div className={styles.itemWrapper}>
								{results.exhibitions.map((exhibition) => (
									<div
										key={exhibition.id}
										className={styles.itemInfo}
										onClick={() =>
											handleExhibitionClick(exhibition)
										}
									>
										<img
											src={
												exhibition.images?.[0]?.imageUrl
													? getImageUrl(
															exhibition.images[0]
																.imageUrl,
														)
													: defaultProduct
											}
											alt={
												exhibition.title_uk ||
												exhibition.title_en ||
												'Exhibition'
											}
										/>
										<div className={styles.itemInfoTitle}>
											<p>
												{exhibition.title_uk ||
													exhibition.title_en}
											</p>
										</div>
									</div>
								))}
							</div>
						</div>
					)}

					{/* Display Products */}
					{filters.products && results.products.length > 0 && (
						<div className={styles.itemContainer}>
							<h2>{t('Вироби')}</h2>
							<div className={styles.itemWrapper}>
								{results.products.map((product) => (
									<div
										className={styles.itemInfo}
										key={product.id}
									>
										<img
											src={
												product.images?.[0]?.imageUrl
													? getImageUrl(
															product.images[0]
																.imageUrl,
														)
													: defaultProduct
											}
											alt={
												product.title_en ||
												product.title_uk ||
												'Product'
											}
										/>
										<div className={styles.itemInfoTitle}>
											<p>
												{product.title_uk ||
													product.title_en}
											</p>
										</div>
									</div>
								))}
							</div>
						</div>
					)}

					{/* Display Posts */}
					{filters.posts &&
						results.posts &&
						results.posts.length > 0 && (
							<div className={styles.itemContainer}>
								<h2>{t('Новини')}</h2>
								<div className={styles.itemWrapper}>
									{results.posts.map((post) => (
										<div
											key={post.id}
											className={styles.itemInfo}
											onClick={() =>
												handlePostPageClick(post)
											}
										>
											<img
												src={
													post.images ||
													defaultProduct
												}
												alt={
													post.title_en ||
													post.title_uk ||
													'Post'
												}
											/>
											<div
												className={styles.itemInfoTitle}
											>
												<p>
													{post.title_uk ||
														post.title_en}
												</p>
											</div>
										</div>
									))}
								</div>
							</div>
						)}

					{/* If no results found */}
					{results.authors.length === 0 &&
						results.museums.length === 0 &&
						results.exhibitions.length === 0 &&
						results.products.length === 0 &&
						results.posts.length === 0 && (
							<div className={styles.noResults}>
								{t('Не знайдено результатів') ||
									'No results found'}
							</div>
						)}
				</div>
			)}
		</div>
	)
}

SearchResult.propTypes = {
	className: PropTypes.string,
	searchInput: PropTypes.string,
	styleInput: PropTypes.object,
	placeholderName: PropTypes.string,
}

export default SearchResult

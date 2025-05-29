import Login from '@components/VerificationPages/LoginPage'
import SignUp from '@components/VerificationPages/SignUpPage'
import cn from 'clsx'
import PropTypes from 'prop-types'
import { useState } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import ProtectedRoute from '../../../routes/ProtectedRoute'
import ScrollToTop from '../../../utils/ScrollToTop'
import Search from '../../screens/Search/Search'
import ErrorPage from '../404/404'
import AdminDashboard from '../Admin/AdminDashboard'
import AdminArtTermsEdit from '../Admin/ArtTermsEdit'
import AdminArtTermsList from '../Admin/ArtTermsList'
import AdminPostList from '../Admin/PostList'
import AdminUserList from '../Admin/UserList'
import AdminPostReviewList from '../Admin/PostReviewList'
import CurrentPostReview from '../Admin/CurrentPostReview'
import AllArtistsPage from '../AllArtistsPage/AllArtistsPage'
import AllExhibitionsPage from '../AllExhibitionsPage/AllExhibitionsPage'
import AllExhibitsProductPage from '../AllExhibitsProductPage/AllExhibitsProductPage'
import AllMuseumsPage from '../AllMuseumsPage/AllMuseumsPage'
import ArtTermPage from '../ArtTerms/ArtTermPage'
import ArtTermsFilteredPage from '../ArtTerms/ArtTermsFilteredPage'
import ArtTermsPage from '../ArtTerms/ArtTermsPage'
import ArtistPage from '../ArtistPage/ArtistPage'
import PaintsProductPage from '../ArtistPage/PaintsProductPage'
import ArtistsPage from '../ArtistsPage/ArtistsPage'
import AllAuthorPosts from '../Authors/AllAuthorPosts'
import AllAuthorsPage from '../Authors/AllAuthorsPage'
import MuseumExhibitions from '../ExhibitionList/Exhibitions'
import ExhibitionPage from '../ExhibitionPage/ExhibitionPage'
import ExhibitionsPage from '../ExhibitionsPage/ExhibitionsPage'
import ExhibitsProductPage from '../MuseumPage/ExhibitsProductPage'
import MuseumPage from '../MuseumPage/MuseumPage'
import MuseumsPage from '../MuseumsPage/MuseumsPage'
import PostDetail from '../Post/PostDetail'
import ItemDetail from '../ProductItemCard/ItemDetail'
import Paintings from '../ProductList/Paintings'
import Footer from '../footer/Footer'
import Header from '../header/Header'
import MainPage from '../mainPage/MainPage'
import NewsPage from '../newsPage/NewsPage'
import ExhibitionCardCreate from '../userProfile/ExhibitionCardCreate'
import ProductCardCreate from '../userProfile/ProductCardCreate'
import UserProfile from '../userProfile/userProfile'
import UserProfileAddPost from '../userProfile/userProfileAddPost'
import UserProfilePosts from '../userProfile/userProfilePosts'
import styles from '/src/styles/layout/Layout.module.scss'
const Layout = ({ heading = '' }) => {
	const [username, setUsername] = useState('')
	const [isLoggedIn, setIsLoggedIn] = useState(false)
	const [serverMessage, setServerMessage] = useState('')
	return (
		<BrowserRouter>
			<section
				className={cn(styles.container, {
					[styles.otherPage]: !!heading,
				})}
			>
				<Header />
				<ScrollToTop />
				<Routes>
					<Route path="/" element={<Navigate to="/main-page" />} />
					<Route path="/main-page" element={<MainPage />} />
					<Route path="/artists-page" element={<ArtistsPage />} />
					<Route path="/artist/:id" element={<ArtistPage />} />
					<Route
						path="/artist/:id/products"
						element={<PaintsProductPage />}
					/>
					<Route
						path="/all-artists-page"
						element={<AllArtistsPage />}
					/>
					<Route
						path="/all-authors-page"
						element={<AllAuthorsPage />}
					/>
					<Route
						path="/all-museums-page"
						element={<AllMuseumsPage />}
					/>
					<Route
						path="/all-exhibitions-page"
						element={<AllExhibitionsPage />}
					/>
					<Route
						path="/all-exhibits-product-page"
						element={<AllExhibitsProductPage />}
					/>
					<Route
						path="/all-author-posts/:id"
						element={<AllAuthorPosts />}
					/>
					<Route path="/museums-page" element={<MuseumsPage />} />
					<Route
						path="/museum-page/:id/products"
						element={<ExhibitsProductPage />}
					/>
					<Route path="/museum-page/:id" element={<MuseumPage />} />
					<Route path="/art-terms" element={<ArtTermsPage />} />
					<Route
						path="/art-terms/letters/:letter"
						element={<ArtTermsFilteredPage />}
					/>
					<Route path="/art-terms/:id" element={<ArtTermPage />} />
					<Route
						path="/profile"
						element={
							<UserProfile
								isLoggedIn={isLoggedIn}
								setIsLoggedIn={setIsLoggedIn}
								setUsername={setUsername}
								username={username}
								serverMessage={serverMessage}
								setServerMessage={setServerMessage}
							/>
						}
					/>
					<Route
						path="/admin/dashboard"
						element={
							<ProtectedRoute roles={['ADMIN']}>
								<AdminDashboard />
							</ProtectedRoute>
						}
					/>
					<Route
						path="/admin/art-terms"
						element={
							<ProtectedRoute roles={['ADMIN']}>
								<AdminArtTermsList />
							</ProtectedRoute>
						}
					/>
					<Route
						path="/admin/art-terms/:id"
						element={
							<ProtectedRoute roles={['ADMIN']}>
								<AdminArtTermsEdit />
							</ProtectedRoute>
						}
					/>
					<Route
						path="/admin/posts"
						element={
							<ProtectedRoute roles={['ADMIN']}>
								<AdminPostList />
							</ProtectedRoute>
						}
					/>
					<Route
						path="/admin/posts/review"
						element={
							<ProtectedRoute roles={['ADMIN']}>
								<AdminPostReviewList />
							</ProtectedRoute>
						}
					/>
					<Route
						path="/admin/posts/:id/review"
						element={
							<ProtectedRoute roles={['ADMIN']}>
								<CurrentPostReview />
							</ProtectedRoute>
						}
					/>

					<Route path="/admin/users"
						element={<ProtectedRoute roles={['ADMIN']}>
								<AdminUserList />
							</ProtectedRoute>}
					/>
					<Route
						path="/profile/posts/create"
						element={<UserProfileAddPost />}
					/>
					<Route
						path="/profile/posts"
						element={<UserProfilePosts />}
					/>
					<Route path="/profile/products" element={<Paintings />} />
					<Route
						path="/profile/products/create"
						element={<ProductCardCreate />}
					/>
					<Route
						path="/exhibitions/create"
						element={<ExhibitionCardCreate />}
					/>
					<Route
						path="/exhibitions"
						element={<MuseumExhibitions />}
					/>
					<Route path="/news-page" element={<NewsPage />} />
					<Route
						path="/login"
						element={
							<Login
								setUsername={setUsername}
								setIsLoggedIn={setIsLoggedIn}
								serverMessage={serverMessage}
								setServerMessage={setServerMessage}
							/>
						}
					/>
					<Route path="/posts/:id" element={<PostDetail />} />
					<Route path="/item-detail/:id" element={<ItemDetail />} />
					<Route
						path="/exhibitions/:id"
						element={<ExhibitionPage />}
					/>
					<Route
						path="/exhibitions-page"
						element={<ExhibitionsPage />}
					/>
					<Route path="/search" element={<Search />} />
					<Route
						path="/signup"
						element={
							<SignUp
								setUsername={setUsername}
								setIsLoggedIn={setIsLoggedIn}
								serverMessage={serverMessage}
								setServerMessage={setServerMessage}
							/>
						}
					/>
					<Route path={'*'} element={<ErrorPage />} />
				</Routes>
				<Footer />
			</section>
		</BrowserRouter>
	)
}
Layout.propTypes = {
	heading: PropTypes.string,
}
export default Layout

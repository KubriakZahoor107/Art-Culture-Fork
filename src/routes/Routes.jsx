import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Login from '../assets/components/VerificationPages/LoginPage.jsx'
import SignUp from '../assets/components/VerificationPages/SignUpPage.jsx'
import AdminDashboard from '../assets/screens/Admin/AdminDashboard.jsx'
import ArtistPage from '../assets/screens/ArtistPage/ArtistPage.jsx'
import ArtistsPage from '../assets/screens/ArtistsPage/ArtistsPage.jsx'
import Exhibitions from '../assets/screens/ExhibitionList/Exhibitions.jsx'
import ExhibitionPage from '../assets/screens/ExhibitionPage/ExhibitionPage.jsx'
import MuseumPage from '../assets/screens/MuseumPage/MuseumPage.jsx'
import MuseumsPage from '../assets/screens/MuseumsPage/MuseumsPage.jsx'
import PostDetail from '../assets/screens/Post/PostDetail.jsx'
import Paintings from '../assets/screens/ProductList/Paintings.jsx'
import Footer from '../assets/screens/footer/Footer.jsx'
import Home from '../assets/screens/home/Home.jsx'
import MainPage from '../assets/screens/mainPage/MainPage.jsx'
import NewsPage from '../assets/screens/newsPage/NewsPage.jsx'
import ExhibitionCardCreate from '../assets/screens/userProfile/ExhibitionCardCreate.jsx'
import ProductCartCreate from '../assets/screens/userProfile/ProductCardCreate.jsx'
import UserProfile from '../assets/screens/userProfile/userProfile.jsx'
import UserProfileAddPost from '../assets/screens/userProfile/userProfileAddPost.jsx'
import UserProfilePosts from '../assets/screens/userProfile/userProfilePosts.jsx'
import { routes } from './routes.data.js'

const AppRouter = () => {
	return (
		<BrowserRouter>
			<Routes>
				{routes.map((route) => (
					<Route
						key={route.path}
						path={route.path}
						element={<route.component />}
					/>
				))}

				<Home />
				<MainPage />
				<NewsPage />
				<ArtistsPage />
				<ArtistPage />
				<MuseumsPage />
				<MuseumPage />
				<UserProfile />
				<UserProfileAddPost />
				<UserProfilePosts />
				<AdminDashboard />
				<ProductCartCreate />
				<ExhibitionCardCreate />
				<Exhibitions />
				<ExhibitionPage />
				<Paintings />
				<PostDetail />
				<Login />
				<SignUp />
			</Routes>
			<Footer />
		</BrowserRouter>
	)
}

export default AppRouter

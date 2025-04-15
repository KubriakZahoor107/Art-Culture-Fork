import Login from '../assets/components/VerificationPages/LoginPage'
import SignUp from '../assets/components/VerificationPages/SignUpPage'
import AdminDashboard from '../assets/screens/Admin/AdminDashboard'
import ArtistPage from '../assets/screens/ArtistPage/ArtistPage'
import ArtistsPage from '../assets/screens/ArtistsPage/ArtistsPage'
import MuseumExhibitions from '../assets/screens/ExhibitionList/Exhibitions'
import ExhibitionPage from '../assets/screens/ExhibitionPage/ExhibitionPage'
import MuseumPage from '../assets/screens/MuseumPage/MuseumPage'
import MuseumsPage from '../assets/screens/MuseumsPage/MuseumsPage'
import PostDetail from '../assets/screens/Post/PostDetail'
import Paintings from '../assets/screens/ProductList/Paintings'
import Home from '../assets/screens/home/Home'
import Layout from '../assets/screens/layout/Layout'
import MainPage from '../assets/screens/mainPage/MainPage'
import NewsPage from '../assets/screens/newsPage/NewsPage'
import ProductCartCreate from '../assets/screens/userProfile/ProductCardCreate'
import UserProfile from '../assets/screens/userProfile/userProfile'
import UserProfileAddPost from '../assets/screens/userProfile/userProfileAddPost'
import UserProfilePosts from '../assets/screens/userProfile/userProfilePosts'

export const routes = [
	{
		path: '/',
		element: Home,
		isAuth: false,
	},

	{
		path: '/MainPage',
		element: MainPage,
		isAuth: false,
	},
	{
		path: '/Layout',
		element: Layout,
		isAuth: false,
	},

	{
		path: '/profile',
		element: UserProfile,
		isAuth: true,
	},

	{
		path: '/login',
		element: Login,
		isAuth: false,
	},

	{
		path: '/signup',
		element: SignUp,
		isAuth: false,
	},

	{
		path: '/profile/posts/create',
		element: UserProfileAddPost,
		isAuth: true,
	},

	{
		path: '/profile/posts',
		element: UserProfilePosts,
		isAuth: true,
	},

	{
		path: '/NewsPage',
		element: NewsPage,
		isAuth: false,
	},

	{
		path: '/ArtistsPage',
		element: ArtistsPage,
		isAuth: false,
	},

	{
		path: '/ArtistPage',
		element: ArtistPage,
		isAuth: false,
	},

	{
		path: '/MuseumsPage',
		element: MuseumsPage,
		isAuth: false,
	},

	{
		path: '/museumpage/:id',
		element: MuseumPage,
		isAuth: false,
	},

	{
		path: '/AdminDashboard',
		element: AdminDashboard,
		isAuth: true,
	},
	{
		path: '/profile/products/create',
		element: ProductCartCreate,
		isAuth: true,
	},

	{
		path: '/Exhibitions',
		element: MuseumExhibitions,
		isAuth: true,
	},

	{
		path: '/profile/products',
		element: Paintings,
		isAuth: true,
	},

	{
		path: '/post/:id',
		element: PostDetail,
		isAuth: false,
	},
	{
		path: '/exhibition/:id',
		element: ExhibitionPage,
		isAuth: false,
	},
]

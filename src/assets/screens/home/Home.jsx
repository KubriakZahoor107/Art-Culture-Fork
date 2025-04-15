import Login from '@components/VerificationPages/LoginPage'
import SignUp from '@components/VerificationPages/SignUpPage'
import React from 'react'
import { AuthProvider } from '../../../Context/AuthContext'
import Exhibition from '../../screens/ExhibitionList/Exhibitions'
import AdminDashboard from '../Admin/AdminDashboard'
import Layout from '../layout/Layout'
import UserProfile from '../userProfile/userProfile'

function Home() {
	return (
		<Layout>
			<AuthProvider>
				<UserProfile />
				<AdminDashboard />
				<SignUp />
				<Login />
				<Exhibition />
			</AuthProvider>
		</Layout>
	)
}

export default Home

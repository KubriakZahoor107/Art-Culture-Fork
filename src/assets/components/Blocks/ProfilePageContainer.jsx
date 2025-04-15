import PropTypes from 'prop-types';
import styles from "@styles/components/Blocks/ProfilePageContainer.module.scss"
import Sidebar from './Sidebar';

function ProfilePageContainer({ children }) {
	return (
		<div className={styles.profile}>
			<Sidebar />
			<div className={styles.profileInfo}>
				{children}
			</div>
		</div>
	)
}

ProfilePageContainer.propTypes = {
    children: PropTypes.any,
};

export default ProfilePageContainer

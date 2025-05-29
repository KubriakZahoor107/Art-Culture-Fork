import { useEffect, useState } from "react";
import ProfilePageContainer from '@components/Blocks/ProfilePageContainer'
import styles from '@styles/components/UserProfile/CurrentPostReview.module.scss'
import Loading from "@components/Blocks/Loading.jsx";
import LoadingError from "@components/Blocks/LoadingError.jsx";
import { useTranslation } from 'react-i18next'
import { useNavigate, useParams } from 'react-router-dom'
import API from "../../../utils/api.js";
import { getFormattedDate, getFormattedTime } from "../../../utils/helper.js";

const CurrentPostReview = () => {
    const { t } = useTranslation()
    const { id } = useParams();
    const [data, setData] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(""); // Error state
    const navigate = useNavigate()

    useEffect(() => {
        async function fetchUserPosts() {
            try {
                setLoading(true);
                const response = await API.get("/posts/" + id);
                setData(response.data);
            } catch (err) {
                setError(t("Помилка завантаження"));
            } finally {
                setLoading(false);
            }
        }

        fetchUserPosts();
    }, []);

	const acceptPost = async () => {
		try {
			setLoading(true);
			await API.patch("/admin/posts/" + id + "/approve");
			navigate('/admin/posts/review')
		} catch (err) {
			setError(t("Помилка завантаження"));
		} finally {
			setLoading(false);
		}
	}

	const rejectPost = async () => {
		try {
			setLoading(true);
			await API.patch("/admin/posts/" + id + "/reject");
			navigate('/admin/posts/review')
		} catch (err) {
			setError(t("Помилка завантаження"));
		} finally {
			setLoading(false);
		}
	}

	let pendingCommands = (<div className={`${styles.ButtonsContainer}`}>
		<button
			className={`${styles.Button} ${styles.AcceptButton}`}
			onClick={acceptPost}
		>
			{t('Прийняти')}
		</button>
		<button
			className={`${styles.Button} ${styles.RejectButton}`}
			onClick={rejectPost}
		>
			{t('Відхилити')}
		</button>
	</div>)

let approvedCommands = (<div className={`${styles.ButtonsContainer}`}>
	<button
		className={`${styles.Button} ${styles.RejectButton}`}
		onClick={rejectPost}
	>
		{t('Відхилити')}
	</button>
</div>)

let rejectedCommands = (<div className={`${styles.ButtonsContainer}`}>
	<button
		className={`${styles.Button} ${styles.AcceptButton}`}
		onClick={acceptPost}
	>
		{t('Прийняти')}
	</button>
</div>)
    return (
        <ProfilePageContainer>
            <h2>
                {data.status === 'PENDING' ? t('На розгляді') : t('На розгляді')}
            </h2>
            {loading ? (
                <Loading />
            ) : error ? (
                <LoadingError />
            ) : (
                <>
                    <div className={`${styles.PostContainer}`}>
                        <div className={`${styles.LeftContainer}`}>
                            <div className={`${styles.AuthorContainer}`}>
                                <div className={`${styles.AuthorImageContainer}`}>
                                    <img className={`${styles.AuthorImage}`} src={data.images} alt="avatar" width={300} />
                                </div>
                                <div className={`${styles.AuthorNameContainer}`}>
                                    <h3>
                                        {data.author.title}
                                    </h3>
                                </div>
                            </div>
                            <div className={`${styles.DateContainer}`}>
                                <h4>
                                    {getFormattedDate(data.updatedAt)} {getFormattedTime(data.updatedAt)}
                                </h4>
                            </div>
                        </div>
                        <div className={`${styles.RightContainer}`}>
                            <div className={`${styles.UKTextContainer}`}>
                                <div className={`${styles.TitleContainer}`}>
                                    <h3>
                                        {data.title_uk}
                                    </h3>
                                </div>
                                <div className={`${styles.DescriptionContainer}`}>
                                    <p className={`${styles.DescriptionText}`}>
                                        <span dangerouslySetInnerHTML={{ __html: data.content_uk }} />
                                    </p>
                                </div>
                            </div>
                            <div className={`${styles.ENTextContainer}`}>
                                <h3>
                                    {data.title_en}
                                </h3>
                                <div className={`${styles.DescriptionContainer}`}>
                                    <p className={`${styles.DescriptionText}`}>
                                        <span dangerouslySetInnerHTML={{ __html: data.content_en }} />
                                    </p>
                                </div>
                            </div>
                            {data.status === "PENDING" ? pendingCommands : null}
                            {data.status === "APPROVED" ? approvedCommands : null}
                            {data.status === "REJECTED" ? rejectedCommands : null}
                        </div>
                    </div>
                </>
            )}
        </ProfilePageContainer>
    )
}

export default CurrentPostReview

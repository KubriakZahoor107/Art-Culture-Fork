import Loading from "@components/Blocks/Loading.jsx";
import LoadingError from "@components/Blocks/LoadingError.jsx";
import ProfilePageContainer from "@components/Blocks/ProfilePageContainer";
import SearchPainting from "@components/Blocks/SearchPainting.jsx";
import TextAreaEditor from '@components/Blocks/TextAreaEditor';
import TextEditor from '@components/Blocks/TextEditor';
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import API from "../../../utils/api.js";

const AdminArtTermsEdit = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const [formData, setFormData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(""); // Error state

  useEffect(() => {
    const fetchUserPosts = async () => {
      try {
        const response = await API.get("/art-terms/" + id);
        setFormData(response.data?.artTerm);
      } catch (err) {
        console.error("Loading error:", err);
        setError(t("Помилка завантаження"));
      } finally {
        setLoading(false);
      }
    };

    fetchUserPosts();
  }, []);

	const handleSubmit = async e => {
		e.preventDefault()
		setError('')

		const formDataToSend = new FormData()
		formDataToSend.append('title_en', formData.title_en)
		formDataToSend.append('title_uk', formData.title_uk)
		formDataToSend.append('description_en', formData.description_en)
		formDataToSend.append('description_uk', formData.description_uk)
		formDataToSend.append('content_en', formData.content_en)
		formDataToSend.append('content_uk', formData.content_uk)

		if (formData.highlightedProduct && formData.highlightedProduct.length) {
			formDataToSend.append('highlightedProductId', formData.highlightedProduct[0].id)
		}

		try {
			const response = await API.post('/art-terms', formDataToSend, {
				headers: {
					'Content-Type': 'multipart/form-data',
					Authorization: `Bearer ${localStorage.getItem('token')}`,
				},
			})

			if (response.status === 200) {
				setError('Art term motified successfully')
			}
		} catch (error) {
			console.error('Art term edit error', error)
			if (error.response && error.response.data) {
				setError(
					error.response.data.error || 'Art term was not changed'
				)
			} else {
				setError('Art term was not changed')
			}
		}
	}

	const textEditorOnChange = ({ name, value }) => {
		const newFormData = { ...formData, [name]: value }
		setFormData(newFormData)
	};

	const paintingsSelectionChange = (paintings) => {
		const newFormData = { ...formData, highlightedProduct: paintings }
		setFormData(newFormData)
	};
  return (
    <ProfilePageContainer>
      <h2>{t("Редагування терміна")}</h2>
      {loading ? (
        <Loading />
      ) : error ? (
        <LoadingError />
      ) : <form onSubmit={handleSubmit}>
      <div className="flex gap-8">
        <div className="field-group">
          <div className="form-group">
            <TextEditor label={t('Назва українською')}
              name='title_uk' value={formData.title_uk}
              maxLength={50} required onChange={textEditorOnChange} />
          </div>
          <div className="form-group">
            <TextAreaEditor label={t('Опис українською')}
              name='description_uk' value={formData.description_uk} html
              maxLength={500} required onChange={textEditorOnChange} />
          </div>
          <div className="form-group">
            <TextAreaEditor label={t('Стаття українською')}
              name='content_uk' value={formData.content_uk} html
              maxLength={500} required onChange={textEditorOnChange} />
          </div>
          <SearchPainting paintings={formData.highlightedProduct}
            onChange={paintingsSelectionChange} />
        </div>
        <div className="field-group">
          <div className="form-group">
            <TextEditor label={t('Назва англійською')}
              name='title_en' value={formData.title_en}
              maxLength={50} required onChange={textEditorOnChange} />
          </div>
          <div className="form-group">
            <TextAreaEditor label={t('Опис англійською')}
              name='description_en' value={formData.description_en} html
              maxLength={500} required onChange={textEditorOnChange} />
          </div>
          <div className="form-group">
            <TextAreaEditor label={t('Стаття англійською')}
              name='content_en' value={formData.content_en} html
              maxLength={500} required onChange={textEditorOnChange} />
          </div>
        </div>
      </div>
      <button type='submit'>{t('Створити')}</button>
    </form>}
    </ProfilePageContainer>
  );
};

export default AdminArtTermsEdit;

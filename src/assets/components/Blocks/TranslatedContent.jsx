import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next'

function TranslatedContent({ en, uk, maxLength, html }) {
	const { i18n } = useTranslation()
	let text = i18n.language === 'en' ? en : uk;
	if (maxLength && text.length > maxLength)
	{
		const trimIndex = text.substring(0, maxLength).lastIndexOf(' ') || maxLength;
        text = text.substring(0, trimIndex) + '...'
	}

	return (html ? <span dangerouslySetInnerHTML={{__html: text}} /> : <>{text}</>)
}

TranslatedContent.propTypes = {
	html: PropTypes.bool,
	maxLength: PropTypes.number,
	en: PropTypes.string,
	uk: PropTypes.string
};

export default TranslatedContent

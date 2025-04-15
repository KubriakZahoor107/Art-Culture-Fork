import PropTypes from 'prop-types'
import { useTranslation } from 'react-i18next'
// src/components/Blocks/Letters.jsx

import styles from '@styles/components/Blocks/Letters.module.scss'

function Letters({ onLetterSelected, selected }) {
	const { i18n } = useTranslation()

	const letters =
		i18n.language === 'en'
			? [
					'A',
					'B',
					'C',
					'D',
					'F',
					'G',
					'H',
					'I',
					'J',
					'K',
					'L',
					'M',
					'N',
					'O',
					'P',
					'Q',
					'R',
					'S',
					'T',
					'U',
					'V',
					'W',
					'X',
					'Y',
					'Z',
					'0-9',
				]
			: [
					'А',
					'Б',
					'В',
					'Г',
					'Ґ',
					'Д',
					'Е',
					'Є',
					'Ж',
					'З',
					'И',
					'І',
					'Ї',
					'Й',
					'К',
					'Л',
					'М',
					'Н',
					'О',
					'П',
					'Р',
					'С',
					'Т',
					'У',
					'Ф',
					'Х',
					'Ц',
					'Ч',
					'Ш',
					'Щ',
					'Ь',
					'Ю',
					'Я',
					'0-9',
				]

	return (
		<div className={styles.lettersForCreatorWrapper}>
			{letters.map((letter) => (
				<span
					key={letter}
					className={`${styles.LetterForCreator} ${letter === selected ? styles.selected : ''}`}
					onClick={() => onLetterSelected(letter)}
				>
					{letter}
				</span>
			))}
		</div>
	)
}

Letters.propTypes = {
	onLetterSelected: PropTypes.func.isRequired,
	selected: PropTypes.string.isRequired,
}

export default Letters

// TextAreaEditor.jsx

import styles from '@styles/components/Blocks/TextEditor.module.scss'
import DOMPurify from 'dompurify' // Import DOMPurify for sanitization
import PropTypes from 'prop-types'
import 'quill/dist/quill.snow.css'
import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import ReactQuill from 'react-quill'

function TextAreaEditor({
	className,
	name,
	label,
	value,
	maxLength,
	onChange,
	placeholder,
	required,
	html,
}) {
	const { t } = useTranslation()
	const [remaining, setRemaining] = useState(
		maxLength - getPlainText(value).length,
	)
	const quillRef = useRef(null)
	const isUpdatingRef = useRef(false) // Flag to prevent double onChange calls

	// Helper function to extract plain text from HTML
	function getPlainText(htmlContent) {
		const tempElement = document.createElement('div')
		tempElement.innerHTML = htmlContent
		return tempElement.textContent || tempElement.innerText || ''
	}

	// Function to remove empty spans and zero-width characters
	function cleanSanitizedContent(html) {
		const tempElement = document.createElement('div')
		tempElement.innerHTML = html

		// Remove empty <span> tags
		const spans = tempElement.querySelectorAll('span')
		spans.forEach((span) => {
			if (!span.textContent.trim()) {
				span.parentNode.removeChild(span)
			}
		})

		// Remove zero-width characters
		const cleanHTML = tempElement.innerHTML.replace(
			/[\u200B-\u200D\uFEFF]/g,
			'',
		)

		return cleanHTML
	}

	// Handle changes in the editor
	const handleQuillChange = (content, delta, source, editor) => {
		if (isUpdatingRef.current) return // Skip if updating programmatically

		if (source === 'user') {
			const plainText = editor.getText().trim()
			if (plainText.length <= maxLength) {
				setRemaining(maxLength - plainText.length)
				// Sanitize the content before sending
				const sanitizedContent = DOMPurify.sanitize(content, {
					ALLOWED_TAGS: [
						'b',
						'i',
						'em',
						'strong',
						'a',
						'p',
						'br',
						'ul',
						'ol',
						'li',
						'span',
					],
					ALLOWED_ATTR: ['href', 'title', 'target', 'rel', 'style'],
					FORBID_EMPTY: true, // Remove empty tags
				})
				const cleanContent = cleanSanitizedContent(sanitizedContent)
				onChange({ name, value: cleanContent })
			}
			// If exceeding maxLength, the text-change handler will handle trimming
		}
	}

	// Handle changes in the textarea
	const handleChange = (e) => {
		let inputValue = e.target.value
		const plainTextLength = inputValue.length
		if (plainTextLength > maxLength) {
			inputValue = inputValue.substring(0, maxLength)
			setRemaining(0)
		} else {
			setRemaining(maxLength - plainTextLength)
		}
		onChange({ name, value: inputValue })

		// Adjust the height of the textarea
		e.target.style.height = 'auto'
		e.target.style.height = `${e.target.scrollHeight + 10}px`
	}

	// Enforce maxLength using Quill's text-change event
	useEffect(() => {
		if (quillRef.current) {
			const quill = quillRef.current.getEditor()

			const handleTextChange = (delta, oldDelta, source) => {
				if (source !== 'user') return

				const plainText = quill.getText().trim()
				if (plainText.length > maxLength) {
					const excess = plainText.length - maxLength
					const deletePosition = maxLength

					isUpdatingRef.current = true // Set flag before updating
					quill.deleteText(deletePosition, excess, 'user') // Trim excess characters
					setRemaining(0)

					// Update the parent with the trimmed content
					const trimmedContent = quill.root.innerHTML
					// Sanitize the trimmed content
					const sanitizedTrimmedContent = DOMPurify.sanitize(
						trimmedContent,
						{
							ALLOWED_TAGS: [
								'b',
								'i',
								'em',
								'strong',
								'a',
								'p',
								'br',
								'ul',
								'ol',
								'li',
								'span',
							],
							ALLOWED_ATTR: [
								'href',
								'title',
								'target',
								'rel',
								'style',
							],
							FORBID_EMPTY: true, // Remove empty tags
						},
					)
					const cleanTrimmedContent = cleanSanitizedContent(
						sanitizedTrimmedContent,
					)
					onChange({ name, value: cleanTrimmedContent })

					isUpdatingRef.current = false // Reset flag after updating
				} else {
					setRemaining(maxLength - plainText.length)
					// No need to call onChange here as handleQuillChange already does it
				}
			}

			quill.on('text-change', handleTextChange)

			return () => {
				quill.off('text-change', handleTextChange)
			}
		}
	}, [maxLength, name, onChange])

	// Update remaining characters when value prop changes
	useEffect(() => {
		setRemaining(maxLength - getPlainText(value).length)
	}, [value, maxLength])

	return (
		<>
			<label className={`field-label ${className ? className : ''}`}>
				<span>
					{label}{' '}
					{required && (
						<span
							className="required-field"
							title={t("Це поле обов'язково")}
						>
							*
						</span>
					)}
				</span>
				{!html && (
					<textarea
						name={name}
						value={value}
						onChange={handleChange}
						maxLength={maxLength}
						className={styles.profileAddPostTextarea}
						placeholder={placeholder}
						required={required}
					/>
				)}
			</label>
			{html && (
				<div className={styles.textAreaQuillWrapper}>
					<ReactQuill
						ref={quillRef}
						theme="snow"
						value={value}
						onChange={handleQuillChange}
						modules={{
							toolbar: true,
						}}
					/>
				</div>
			)}
			<small className={styles.remainingChars}>
				{remaining} {t('символів залишилось')}
			</small>
		</>
	)
}

TextAreaEditor.propTypes = {
	maxLength: PropTypes.number.isRequired,
	className: PropTypes.string,
	name: PropTypes.string.isRequired,
	label: PropTypes.string.isRequired,
	value: PropTypes.string.isRequired,
	placeholder: PropTypes.string,
	required: PropTypes.bool,
	html: PropTypes.bool,
	onChange: PropTypes.func.isRequired,
}

export default TextAreaEditor

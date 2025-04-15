import multer from 'multer'
import path, { dirname } from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, path.join(__dirname, '../../uploads/productImages'))
	},
	filename: (req, file, cb) => {
		const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9)
		cb(null, uniqueSuffix + path.extname(file.originalname))
	},
})

const fileFilter = (req, file, cb) => {
	const allowedTypes = /jpeg|jpg|png|gif|webp/
	const extname = allowedTypes.test(
		path.extname(file.originalname).toLowerCase()
	)
	const mimetype = allowedTypes.test(file.mimetype)
	if (extname && mimetype) {
		return cb(null, true)
	} else {
		cb(new Error('Only images are allowed'))
	}
}

const upload = multer({
	storage,
	fileFilter,
	limits: { fileSize: 5 * 1080 * 1920 }, // 5 MB limit
})

export default upload

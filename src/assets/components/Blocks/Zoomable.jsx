// ZoomableImage.jsx
import style from '@styles/components/Blocks/Zoomable.module.scss'
import PropTypes from 'prop-types'
import React from 'react'

const ZoomableImage = ({
	imageUrl,
	zoomState,
	handleZoomIn,
	handleZoomOut,
	handleMouseMove,
	handleMouseEnter,
	handleMouseLeave,
	handleToggleZoom,
}) => {
	return (
		<>
			{/* Full-screen overlay for dark background */}
			{zoomState.isZoomed && (
				<div className={style.overlay} onClick={handleToggleZoom} />
			)}
			<div
				className={`${style.imageWrapper} ${zoomState.isZoomed ? style.zoomed : ''}`}
				onMouseEnter={handleMouseEnter}
				onMouseLeave={handleMouseLeave}
				onMouseMove={handleMouseMove}
				onClick={handleToggleZoom}
				style={{
					cursor: zoomState.isZoomed ? 'zoom-out' : 'zoom-in',
				}}
			>
				<div
					className={style.zoomContainer}
					style={{
						transform: `scale(${zoomState.zoomLevel})`,
						transformOrigin: `${zoomState.cursorPos.x}px ${zoomState.cursorPos.y}px`,
						transition: 'transform 0.3s ease-in-out',
					}}
				>
					<img
						src={imageUrl}
						alt="Zoomable"
						style={{
							width: '100%',
							height: 'auto',
							display: 'block',
						}}
					/>
				</div>
				{zoomState.showLens && !zoomState.isZoomed && (
					<div
						className={style.zoomLens}
						style={{
							top: zoomState.cursorPos.y - 50,
							left: zoomState.cursorPos.x - 50,
						}}
					/>
				)}
				{zoomState.isZoomed && (
					<div className={style.zoomControls}>
						<button
							className={style.zoomButton}
							onClick={(e) => {
								e.stopPropagation()
								handleZoomOut()
							}}
							aria-label="Zoom Out"
						>
							-
						</button>
						<span>{`Zoom: ${zoomState.zoomLevel}x`}</span>
						<button
							className={style.zoomButton}
							onClick={(e) => {
								e.stopPropagation()
								handleZoomIn()
							}}
							aria-label="Zoom In"
						>
							+
						</button>
					</div>
				)}
			</div>
		</>
	)
}

ZoomableImage.propTypes = {
	imageUrl: PropTypes.string.isRequired,
	zoomState: PropTypes.shape({
		zoomLevel: PropTypes.number.isRequired,
		isZoomed: PropTypes.bool.isRequired,
		cursorPos: PropTypes.shape({
			x: PropTypes.number.isRequired,
			y: PropTypes.number.isRequired,
		}).isRequired,
		showLens: PropTypes.bool.isRequired,
	}).isRequired,
	handleZoomIn: PropTypes.func.isRequired,
	handleZoomOut: PropTypes.func.isRequired,
	handleMouseMove: PropTypes.func.isRequired,
	handleMouseEnter: PropTypes.func.isRequired,
	handleMouseLeave: PropTypes.func.isRequired,
	handleToggleZoom: PropTypes.func.isRequired,
}

export default ZoomableImage

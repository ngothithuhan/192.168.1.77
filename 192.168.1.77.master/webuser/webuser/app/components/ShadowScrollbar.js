import css from 'dom-css';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Scrollbars } from 'react-custom-scrollbars';

class ShadowScrollbar extends Component {

	state = {
		scrollTop: 0,
		scrollHeight: 0,
		clientHeight: 0
	}

	handleUpdate = (values) => {
		const { shadowTop, shadowBottom } = this.refs;
		const { scrollTop, scrollHeight, clientHeight, clientWidth } = values;
		const shadowTopOpacity = 1 / 20 * Math.min(scrollTop, 20);
		const bottomScrollTop = scrollHeight - clientHeight;
		const shadowBottomOpacity = 1 / 20 * (bottomScrollTop - Math.max(scrollTop, bottomScrollTop - 20));
		css(shadowTop, { opacity: shadowTopOpacity });
		css(shadowBottom, { opacity: shadowBottomOpacity });

		if (bottomScrollTop - scrollTop == 0 && clientHeight > 1 && clientWidth > 1) {
			const { actionAtBottom } = this.props
			if (actionAtBottom) actionAtBottom()
		//	console.log(`%cbottom`, 'color: #0B6285')
		}
	}
	// renderThumb({ style, ...props }) {
	// 	const thumbStyle = {
	// 		backgroundColor: `#cecece`
	// 	};
	// 	return (
	// 		<div
	// 			style={{ ...style, ...thumbStyle }}
	// 			{...props} />
	// 	);
	// }

	render() {
		const { style, actionAtBottom, ...props } = this.props;
		const containerStyle = {
			...style,
			position: 'relative'
		};
		const shadowTopStyle = {
			position: 'absolute',
			top: 0,
			left: 0,
			right: 0,
			height: 2,
			background: 'linear-gradient(to bottom, rgba(0, 0, 0, 0.1) 0%, rgba(0, 0, 0, 0) 100%)'
		};
		const shadowBottomStyle = {
			position: 'absolute',
			bottom: 0,
			left: 0,
			right: 0,
			height: 2,
			background: 'linear-gradient(to top, rgba(0, 0, 0, 0.1) 0%, rgba(0, 0, 0, 0) 100%)'
		};
		return (
			<div style={containerStyle}>
				<Scrollbars
					ref="scrollbars"
					onUpdate={this.handleUpdate}
					autoHide={false}
					autoHideTimeout={2000}
					// Duration for hide animation in ms.
					autoHideDuration={200}
					// renderThumbVertical={this.renderThumb}
					// renderTrackHorizontal={props => <div />}
					{...props} />
				<div
					ref="shadowTop"
					style={shadowTopStyle} />
				<div
					ref="shadowBottom"
					style={shadowBottomStyle} />
			</div>
		);
	}
}

ShadowScrollbar.propTypes = {
	style: PropTypes.object
};

export default ShadowScrollbar;
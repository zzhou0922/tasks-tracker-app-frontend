import React from 'react';

const Scroll = (props) => {
	return (
		<div style={{overflowY: 'scroll', border:'5px soild black', height: '515px'}}>
			{props.children}
		</div>
	);
}

export default Scroll;
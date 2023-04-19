import React from 'react';

const Navigation = ({ handleRouteChange, isSignIn }) => {

	const handleSignOut = (event) => {
		const confirmMsg = 'Do you save your task(s) modification?';
		if(window.confirm(confirmMsg)) {
			window.location.href = event.target.href;
		} else {
		    // User clicked "Cancel", prevent navigation
		    event.preventDefault();
		}

	}
	// If isSignIn is true, navigation bar will change to SIGN OUT.
	if(isSignIn) {
		return (
			<header className="bg-black-20 w-100 ph3 pv4-ns ph4-m ph5-l">
				<nav style={{display: 'flex', justifyContent: 'flex-end'}}>
					<a href="/" onClick={handleSignOut}
				       className="f3 fw7 link dim white dib ph3 grow pointer">SIGN OUT</a>
				</nav>
			</header>
		);
	} else {
		// isSignIn is false, Navagation will have HOME option.
		return (
			<header className="bg-black-20 w-100 ph3 pv4-ns ph4-m ph5-l">
				<nav className="f6 fw6 ttu tracked" 
				     style={{display: 'flex', justifyContent: 'flex-end'}}>
				     <a href="/" onChange={() => handleRouteChange('/')} 
					    className="f3 fw7 link dim white dib ph3 grow pointer">Home</a>
				</nav>
			</header>
		);
	}
	
}

export default Navigation;
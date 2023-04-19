import React from 'react';
import './Home.css';

const Home = ({ handleNameInputChange, handleSignInButton }) => {

	// The home page will get loaded initially or when the user signs out of the app. 
	return (	
		<div className="pt6">	

			{/*Greeting: Welcome to the Task Track App.*/}
			<h2 className="title pb4">
		        <span className="title-word title-word-1">Welcome </span>
		        <span className="title-word title-word-2">to </span>
		        <span className="title-word title-word-3">the </span>
		        <span className="title-word title-word-4">Task </span>
		        <span className="title-word title-word-4">Track </span>
		        <span className="title-word title-word-4">App.</span>
		    </h2>

			{/*Prompt: Please enter a name to check all tasks: */}
		    <p className="f3 fw7">Please enter a name to check all tasks: </p>

			{/*Form part is all about input*/}
		    <form className="pa3 black-80" style={{display:'flex', justifyContent: 'center', 
                       alignItems: 'center'}}>
			  <div className="measure-wide">
			    <input id="name" className="input-reset ba br3 b--black-20 pa2 mb2 db w-100" 
			    	   type="text" aria-describedby="name-desc"
			    	   onChange={handleNameInputChange} required />
			  </div>
			</form>

			{/*Sign In button*/}
			<button className='black b f3 pa2 ma2 br3 dim pointer shadow-3' 
			        style={{backgroundColor: '#ffc107'}}
			        onClick={handleSignInButton}>Sign In</button>
		</div>
	);
}

export default Home;
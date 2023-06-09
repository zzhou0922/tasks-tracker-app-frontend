import { Component } from 'react';
import Navigation from './components/Navigation/Navigation'
import Home from './components/Home/Home'
import Main from './components/Main/Main'
import './App.css';
// import {makeuptasks} from './makeuptasks.js';


// '/' is home page.
// isSignIn is for navigation to switch in between home and sign out.
// isLoding is buffer for get tasks from server side.
// name is used to let the server side know whose tasks we are requesting.
// name also will be part of the greeting on the main page.
// tasks are tasks get from the server. 
const initialState = {
    route: '/',
    isSignIn: false,
    isLoading: true,
    id: '',
    name: '',
    tasks: {}
}

class App extends Component {
    constructor() {
        super();
        this.state = initialState;
    };

    // Call this function to update the route in state. 
    handleRouteChange = (route) => {
        this.setState({ route: route });
    };

    // Call this function when we click on the sign in button.
    handleSignInButton = () => {
        // Alert will output if name input is empty.
        if(!this.state.name) {
            alert('Name input cannot be empty to sign in.');
        } else {
            fetch('https://tasks-tracker-backend.herokuapp.com/signin', {
                method: 'post',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    name: this.state.name
                })
            })
                .then(response => response.json())
                // .then(console.log)
                .then(data => {
                    // Set this.state.isSignIn to true, 
                    // it will let Navigation changes to Sign Out. 
                    this.setState({ isSignIn: true });

                    // And we need to change the route to signin.
                    this.handleRouteChange('/signin');

                    
                    const correctedStatusTasks = data.tasks;
                    correctedStatusTasks.forEach((task) => {
                        if(new Date(task.duedate) < new Date() && task.status === "In Progress") {
                            task.status = "Overdue";
                            task.edited = "Yes";
                        } 
                    });

                    // And we need to update id and tasks of this.state.
                    this.handleTasksChange(correctedStatusTasks);
                    this.handleIdChange(data.id);
                })
        }
    };

    // Call this function when we have a name input on the home page.
    handleNameInputChange = (event) => {
        this.setState({ name: event.target.value });
    };

    // Call this function when we have a name input on the home page.
    handleTasksChange = (tasks) => {
        this.setState({ tasks: tasks, isLoading: false });
    };

    // Call this function when we have a name input on the home page.
    handleIdChange = (id) => {
        this.setState({ id: id });
    }


    render() {
        // Get route, isSignIn, and name from state 
        // so we can avoid to type 'this.state' all the time.
        const { route, isSignIn, id, name, tasks } = this.state;
        return (
            <div className="App">
                {/*Navigation is always on the page, 
                   but it will change according to the isSignIn status.*/}
                <div>
                    <Navigation handleRouteChange={this.handleRouteChange} isSignIn={isSignIn}/>
                </div>   

                {/*When 'route' is equal to "/", the Home page gets loaded, if not then we wait 
                   for the loading tasks from the server, once it is done, we go to the main page.*/}
                {route === "/" 
                 ? <Home handleNameInputChange={this.handleNameInputChange} 
                         handleSignInButton={this.handleSignInButton}/>
                 : (this.state.isLoading
                    ? <div><h1 className="pa6">Loading...</h1></div>
                    : <Main id={id} name={name} tasks={tasks}/>)}
            </div>
        );
    }
  
}

export default App;
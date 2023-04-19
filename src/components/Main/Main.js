import React from 'react';
import TaskTable from '../TaskTable/TaskTable'

// Main is the page after user sign in with a name
const Main = ({ name, tasks }) => {

	// It just returns a simple greeting and a task table.
	return (	
		<div className="pt3">
			<h1 className='black b f2 pa2 mv4 mh6 shadow-3'>
				Hello {name}, wecome back! Here is your task list:</h1>	
			<TaskTable name={name} tasks={tasks} />
		</div>
	);
}

export default Main;
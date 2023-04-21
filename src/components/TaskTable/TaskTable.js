import React, { useState }from 'react';
import './TaskTable.css';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import Scroll from '../Scroll/Scroll';

// id is for new added task, it will be negative,
// so when the object send to backend, 
// server will know it's a new added task because 
// the negative id. 
let id = 0;
const deleteRows = [];
const TaskTable = ({ currUserId, name, tasks }) => {
	
	// id decrement.
	id--;
	

	// State used to edit tasks inside the table.
	const [editedTasks, setEditedTasks] = useState(tasks);

	// Update the cell when editing it.
    function handleCellEdit(event, taskId, fieldName) {

        const updatedTasks = editedTasks.map((task) => {
        	let updatedValue;
        	if (fieldName === 'status') {
		    	updatedValue = event.target.value;
		  	} else if (fieldName === 'duedate') {
		    	updatedValue = event.toISOString();
		  	} else {
		    	updatedValue = event.target.innerText;
		  	}

            if (task.id === taskId) {
                return {
                    ...task,
                    [fieldName]: updatedValue,
                    'edited': "Yes"
                };
            } else {
                return task;
            }
        });

        setEditedTasks(updatedTasks);
    }


    // Delete entire specified row, 
    // use the filter function here, 
    // then update the task table.
    function handleRowDelete(taskId) {
    	if(taskId > 0) deleteRows.push(taskId);
        const updatedTasks = editedTasks.filter((task) => task.id !== taskId);
        setEditedTasks(updatedTasks);
    }

    // Add entire specified row,  
    // then update the task table.
    function handleRowAdd() {
        editedTasks.push({
        	id: id,
        	title: "",
        	descrption: "",
        	status: "In Progress",
        	duedate: new Date(),
        	edited: "Yes"
        })
        const updatedTasks = editedTasks.map((task) => {       	
        	return {
	        	...task
	    	};
	  	});
	  	setEditedTasks(updatedTasks);
    }


    // Sort all tasks by Title alphabetically,  
    // use the sort function here,
    // then update the task table.
    function handleTitleSort() {
        const sortedTasks = [...editedTasks].sort((a, b) =>
            a.title.localeCompare(b.title)
        );
        setEditedTasks(sortedTasks);
    }


    // Sort all tasks by status in priority, 
    // like In Progress > Overdue > Completed, 
    // use the sort function here,
    // then update the task table.
    function handleStatusSort() {
        const statusPriorityOrder = ["In Progress", "Overdue", "Completed"];
        const sortedTasks = [...editedTasks].sort((a, b) =>
            statusPriorityOrder.indexOf(a.status) - statusPriorityOrder.indexOf(b.status)
        );
        setEditedTasks(sortedTasks);
    }


    // Sort all tasks by due date in priority, 
    // sort from the most recent date to the far away date, 
    // then update the task table.
    function handleDueDateSort() {
        const sortedTasks = [...editedTasks].sort((a, b) =>
            new Date(a.duedate) - new Date(b.duedate)
        );
        setEditedTasks(sortedTasks);
    }

    // Save the data to back end server. 
    async function handleSave() {
    	const updatedUser = { id: currUserId, name: name, tasks: editedTasks, deleterows: deleteRows};
	    await putUpdatedUserData(updatedUser);
  		await retrieveUpdatedUserData();
  		console.log(updatedUser);
    }

    // Send updated user info to the back end server.  
    const putUpdatedUserData = async (updatedUser) => {
    	fetch('https://tasks-tracker-backend.herokuapp.com/updateuser', {
                method: 'put',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(updatedUser)
        })
        	.then(response => response.json())
        	.then(data => {
                console.log('Success', data);
        	}).catch((error) => {
    			console.error('Error:', error);
  			});
	}

	// Ger updated user info from the back end server.
	const retrieveUpdatedUserData = async () => {
		const user = {name: name};
  		try {
		    const response = await fetch('https://tasks-tracker-backend.herokuapp.com/signin', {
                method: 'post',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(user)
        	})
		    const data = await response.json();
		    setEditedTasks(data.tasks);
		} catch (error) {
		    console.error('Error:', error);
		}
	}


    // Return
	return (
	  	<div>
	  		<div className="pb4"
	  			 style={{display: 'flex', justifyContent: 'center', color: '#D3D3D3'}}>
	  	    	{/*Three sort buttons & a save button*/}
	  	    	<button onClick={handleTitleSort}
	  	    			className='black b f3 pa2 ph4 ma2 br3 pointer dim shadow-3' 
	  	    			style={{backgroundColor: '#FCC6C4'}}>Sort by Title</button>
	  	    	<button onClick={handleStatusSort}
	  	    			className='black b f3 pa2 ph4 ma2 br3 pointer dim shadow-3' 
	  	    			style={{backgroundColor: '#FFFFE0'}}>Sort by Status</button>
	  	    	<button onClick={handleDueDateSort}
	  	    			className='black b f3 pa2 ph4 ma2 br3 pointer dim shadow-3' 
	  	    			style={{backgroundColor: '#ADD8E6'}}>Sort by Due Date</button>
	  	    	<button onClick={handleRowAdd}
	  	    			className='black b f3 pa2 ph4 ma2 br3 pointer dim shadow-3' 
	  	    			style={{backgroundColor: '#FFD580'}}>Add Row</button>
	  	    	<button onClick={handleSave}
	  	    			className='black b f3 pa2 ph4 ma2 br3 pointer dim shadow-3' 
	  	    			style={{backgroundColor: '#E3242B'}}>Save</button>
	  	    </div>

	  	    <Scroll>
	  		{/*Table section*/}
	    	<table style={{tableLayout: 'fixed', width: '100%'}}>

	    		{/*Table Head*/}
	        	<thead className='f3 bg-white-70'>
	            	<tr>
	                	<th className='ba bw2 shadow-3 br3 pa3'>Title</th>
	                	<th className='ba bw2 shadow-3 br3 pa3'>Description</th>
	                	<th className='ba bw2 shadow-3 br3 pa3'>Status</th>
	          			<th className='ba bw2 shadow-3 br3 pa3'>Due Date</th>
	          			<th className='ba bw2 shadow-3 br3 pa3'>Delete Row</th>
	        		</tr>
	        	</thead>

	        	
	    		{/*Table Body*/}
	      		<tbody className='f4 b bg-white-50'>
	        		{editedTasks.map((task) => (
	          			<tr key={task.id}>

	          				{/*Title for each task*/}
	            			<td
	              				contentEditable
	              				suppressContentEditableWarning
	              				className="ph3"
	              				onBlur={(event) => handleCellEdit(event, task.id, 'title')}>
	              				{task.title}
	            			</td>

	            			{/*Description for each task*/}
	            			<td
	              				contentEditable
	              				suppressContentEditableWarning
	              				className="ph3"
	              				onBlur={(event) => handleCellEdit(event, task.id, 'description')}>
	              				{task.description}
	            			</td>
	            		
	            			{/*Status for each task*/}
	            			<td>
	              				<select
	              					className="select-dropdown"
	                				value={task.status}
	                				onChange={(event) => handleCellEdit(event, task.id, 'status')}>
	                				<option value="In Progress">In Progress</option>
	                				<option value="Completed">Completed</option>
	                				<option value="Overdue">Overdue</option>
	              				</select>
	            			</td>

	            			{/*Due date for each task*/}
	            			<td
	              				contentEditable
	              				suppressContentEditableWarning
	              				>
	              				<DatePicker
								    selected={new Date(task.duedate)}
								    className="f5 bb br2 dim shadow-3 pl1 w-33"
								    onChange={(date) => handleCellEdit(date, task.id, 'duedate')}
								    dateFormat="yyyy/MM/dd"
								/>
	            			</td>
	            		
	            			{/*Delete option for each task*/}
	            			<td>
	              				<button onClick={() => handleRowDelete(task.id)}
	              						className='black b f4 pa2 ph4 ma2 br3 pointer dim shadow-3' 
	  	    							style={{backgroundColor: '#F2F3F5'}}>Delete</button>
	            			</td>
	          			</tr>
	        		))}
	        	</tbody>   	
	    	</table>
	    	</Scroll>
	    </div>
	);
}

export default TaskTable;
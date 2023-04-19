import React, { useState }from 'react';
import './TaskTable.css';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import Scroll from '../Scroll/Scroll';

const TaskTable = ({ name, tasks }) => {

	// State used to edit tasks inside the table.
	const [editedTasks, setEditedTasks] = useState(tasks);


	// Update the cell when editing it.
    function handleCellEdit(event, taskId, fieldName) {

        const updatedTasks = editedTasks.map((task) => {
        	let updatedValue;
		    if (fieldName === 'status') {
		    	updatedValue = event.target.value;
		  	} else if (fieldName === 'dueDate') {
		    	updatedValue = event.toISOString();
		  	} else {
		    	updatedValue = event.target.innerText;
		  	}

            if (task.id === taskId) {
                return {
                    ...task,
                    [fieldName]: updatedValue,
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
        const updatedTasks = editedTasks.filter((task) => task.id !== taskId);
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
            new Date(a.dueDate) - new Date(b.dueDate)
        );
        setEditedTasks(sortedTasks);
    }

    // Save the data to back end server. 
    function handleSave() {
    	const updatedTasks = { name: name, tasks: editedTasks};
    	console.log(updatedTasks);
    	postUpdatedTasksData(updatedTasks);

    }

    // Post data to back end server.  
    const postUpdatedTasksData = async (updatedTasks) => {
	    try {
		  const response = await fetch('/api/save', {
		    method: 'POST',
		    headers: {
		      'Content-Type': 'application/json'
		    },
		    body: JSON.stringify(updatedTasks)
		  });
		  const responseData = await response.json();
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
	          			<th className='ba bw2 shadow-3 br3 pa3'>Delete Option</th>
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
								    selected={new Date(task.dueDate)}
								    className="f5 bb br2 dim shadow-3 pl1 w-33"
								    onChange={(date) => handleCellEdit(date, task.id, 'dueDate')}
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
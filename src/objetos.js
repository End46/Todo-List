function CreateTask(name,prioridad,fechaEntrega){

    return{name,prioridad,fechaEntrega};
}

function CreateProject(name,description){
   
    let tasks = [];
    
    const addTask = (nombre,prioridad,fechaEntrega) => {
        let task = CreateTask(nombre,prioridad,fechaEntrega);
        tasks.push(task);
    }

    const cargarTasks = (data) => tasks=data;

    const getLength = () => tasks.length;

    const removeTask = (i) => {
        tasks.splice(i,1);
    }
    

    const getTask = (i) => tasks[i];

    const editNameTask = (i,data) =>{
        tasks[i].name=data;
    }

    const editPrioridadTask = (i,data) =>{
        tasks[i].prioridad=data;
    }

    const editFechaTask = (i,data) =>{
        tasks[i].fechaEntrega=data;
    }


    return{name,description,tasks,addTask,getTask,removeTask,getLength,editNameTask,editPrioridadTask,editFechaTask,cargarTasks};
}

export{ CreateProject};
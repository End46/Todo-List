function CreateTask(name,prioridad,fechaEntrega){
    let completada=false;

    const getCompletada = ()=> completada;
    const setCompletada = ()=> completada=true;

    return{name,prioridad,fechaEntrega,getCompletada,setCompletada};
}

function CreateProject(name,description){
   
    let tasks = [];
    
    const addTask = (nombre,prioridad,fechaEntrega) => {
        let task = CreateTask(nombre,prioridad,fechaEntrega);
        tasks.push(task);
    }

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

    return{name,description,addTask,getTask,removeTask,getLength,editNameTask,editPrioridadTask,editFechaTask};
}

export{ CreateProject};
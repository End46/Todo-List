function AskTask(){
    let task = prompt("What task do you want to add?");
    return task;
}

function AskPrioridad(){
    let prioridad = prompt("Escriba prioridad");
    return prioridad;
}

function AskFecha(){
    let fecha = prompt("Escriba fecha de entrega");
    return fecha;
}

export{AskFecha,AskPrioridad,AskTask}    
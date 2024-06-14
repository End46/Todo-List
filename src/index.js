import './style.css';   
import { CreateProject } from './objetos';
import { AskFecha,AskPrioridad,AskTask } from './AddTaskForm';
import 'date-fns';
import { isFuture, isThisWeek, isToday } from 'date-fns';
import { MostrarHoy } from './hoy';
import { MostrarProximo } from './proximo';

function listarTareas(Proyecto){
    if(Proyecto.getLength() == 0){
        console.log('no hay tareas');
    }else{
        for(let i=0;i<Proyecto.getLength();i++){
            let tarea = Proyecto.getTask(i);
            if(isFuture(tarea.fechaEntrega)){
                console.log({
                    name:tarea.name,
                    prioridad:tarea.prioridad,
                    fechaEntrega:tarea.fechaEntrega
                });
            }else{
                console.log('tareas vencidas:',
                    {
                    name:tarea.name,
                    prioridad:tarea.prioridad,
                    fechaEntrega:tarea.fechaEntrega
                });
            }
        }
    }
}

function listarTareasSemanales(Proyecto){
    if(Proyecto.getLength() == 0){
        console.log('no hay tareas');
    }else{
        for(let i=0;i<Proyecto.getLength();i++){
            let tarea = Proyecto.getTask(i);
            if(isThisWeek(tarea.fechaEntrega)){
                console.log({
                    name:tarea.name,
                    prioridad:tarea.prioridad,
                    fechaEntrega:tarea.fechaEntrega
                });
            }else{
                console.log('Parece que no tiene tareas pendientes esta semana.');
            }
        }
    }
}



function agregarTarea(proyecto){
    let nombre = AskTask();
    let prioridad = AskPrioridad();
    let fechaEntrega = AskFecha();

    proyecto.addTask(nombre,prioridad,fechaEntrega);
}

function CambiarOpcionDeMenuActiva(event){
    const elementoActivo = document.querySelector('.activo');
    elementoActivo.classList.remove('activo');
    event.classList.add('activo');
}

function DomController(){
    const add=document.querySelector('#add');
    const hoy=document.querySelector('#hoy');
    const proximo=document.querySelector('#proximo');
    const proyectos=document.querySelector('#proyectos');
    const dialogoProyecto = document.querySelector('#addProject');
    const formProyecto = document.querySelector('#addProjectForm');
    const confirm = document.querySelector('#confirm');
    const cancel = document.querySelector('#cancel');


    const addProyecto = (data,indice) =>{
        const elemento = document.createElement('li');
        elemento.textContent = data;
        elemento.setAttribute('id',`proyecto${indice}`);
        proyectos.appendChild(elemento);
        elemento.addEventListener('click',(value)=>{

        })
    }

    const removeProyecto = (data) => {
        const elemento = document.querySelector(`#proyecto${data}`);
        elemento.remove();
    }

    return{add,hoy,proximo,proyectos,addProyecto,dialogoProyecto,formProyecto,confirm,cancel,removeProyecto};
}


function main(){
    const dom=DomController();
    let proyectos = [];
    let proyecto = CreateProject('Varios','Proyecto default  para almacenar las tareas mas comunes');
    proyectos.push(proyecto);
    dom.addProyecto(proyecto.name,'0'); 
    agregarTarea(proyecto);
    agregarTarea(proyecto);
    MostrarHoy(proyectos);


    dom.add.addEventListener('click',()=>{
        dom.dialogoProyecto.showModal();
    })

    dom.confirm.addEventListener('click',(event)=>{
        event.preventDefault();
        let nombre = dom.formProyecto.name.value;
        let description = dom.formProyecto.descripcion.value
        if(nombre == '' || description == ''){
            alert('Rellene Todo el formulario')
        }else{
            proyecto=CreateProject(nombre,description);
            proyectos.push(proyecto);
            let indice = proyectos.length-1;
            dom.addProyecto(nombre,indice);
            dom.dialogoProyecto.close();
        }  
    })

    dom.cancel.addEventListener('click',(event)=>{
        event.preventDefault();
        dom.dialogoProyecto.close();
    })

    dom.hoy.addEventListener('click',(event)=>{
        CambiarOpcionDeMenuActiva(event.target);
        MostrarHoy(proyectos);
    })

    dom.proximo.addEventListener('click',(event)=>{
        CambiarOpcionDeMenuActiva(event.target);
        MostrarProximo(proyectos);
    })
    
    
}

main();
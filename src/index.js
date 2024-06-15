import './style.css';   
import { CreateProject } from './objetos';
import { MostrarHoy } from './hoy';
import { MostrarProximo } from './proximo';
import { listarTareas } from './proyecto';
import { cargar,guardar } from './guardar_cargar';


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
    const titulo = document.querySelector('#info-h1');
    const descripcion = document.querySelector('#info-p');
    const guardado = document.querySelector('#guardar');

    const addProyecto = (data,indice,proyectoArray) =>{
        const elemento = document.createElement('li');
        elemento.textContent = data;
        elemento.setAttribute('data-id',indice);
        elemento.setAttribute('id',`proyecto${indice}`);
        proyectos.appendChild(elemento);
        elemento.addEventListener('click',(event)=>{
            CambiarOpcionDeMenuActiva(event.target);
            let i = event.target.dataset.id;
            let proyecto = proyectoArray[i];
            titulo.textContent=proyecto.name;
            descripcion.textContent=proyecto.description;
            listarTareas(proyecto,event.target,proyectoArray);
            guardar(proyectoArray);
        })
    }

    const removeProyecto = (data) => {
        const elemento = document.querySelector(`#proyecto${data}`);
        elemento.remove();
    }

    return{add,hoy,proximo,proyectos,addProyecto,dialogoProyecto,formProyecto,confirm,cancel,removeProyecto,titulo,descripcion,guardado};
}


function main(){
    const dom=DomController();
    let proyectos = [];
    
    if(cargar(proyectos,dom)){
        let proyecto = CreateProject('Varios','Proyecto default  para almacenar las tareas mas comunes');
        proyectos.push(proyecto);
        dom.addProyecto(proyecto.name,'0',proyectos);
    }
    
    
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
           let proyecto=CreateProject(nombre,description);
            proyectos.push(proyecto);
            let indice = proyectos.length-1;
            dom.addProyecto(nombre,indice,proyectos);
            dom.dialogoProyecto.close();
        }  
    })

    dom.cancel.addEventListener('click',(event)=>{
        event.preventDefault();
        dom.dialogoProyecto.close();
    })

    dom.hoy.addEventListener('click',(event)=>{
        CambiarOpcionDeMenuActiva(event.target);
        dom.titulo.textContent='Tareas de Hoy';
        dom.descripcion.textContent='Aqui puede ver las tareas con fecha límite para hoy. Para añadir una nueva tarea elija un proyecto.';
        MostrarHoy(proyectos);
        guardar(proyectos);
    })

    dom.proximo.addEventListener('click',(event)=>{
        CambiarOpcionDeMenuActiva(event.target);
        dom.titulo.textContent='Proximas Tareas';
        dom.descripcion.textContent='Aqui puede ver las tareas que tienen fecha límite en la proxima semana. Para añadir una nueva tarea elija un proyecto.';
        MostrarProximo(proyectos);
        guardar(proyectos);
    })
    
    dom.guardado.addEventListener('click',()=>{
        console.log(proyectos);
        guardar(proyectos);
    })
    
}

main();
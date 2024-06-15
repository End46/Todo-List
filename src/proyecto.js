import { isFuture,isToday,isPast } from 'date-fns';
import { guardar } from './guardar_cargar';

function convertirFecha(tarea){
    let fechaString = tarea.fechaEntrega;
    let fechaArray=[];
    console.log(fechaString)
    for(let i=0;i<fechaString.length;i++){
        fechaArray.push(fechaString[i]);
        console.log(fechaArray[i])
    }
    if(fechaArray[5]==0){
        fechaArray.splice(5,1);
        fechaString = fechaArray[0];
        for(let i=1;i<fechaArray.length;i++){
            fechaString += fechaArray[i];
        }
    }
    
    console.log(fechaString)
    return fechaString;
}

function mensajeNoHayTareas(contenido){
    if(contenido.firstChild == null){
        const mensaje = document.createElement('div');
        const p = document.createElement('p');
        contenido.appendChild(mensaje);
        mensaje.appendChild(p);
        p.textContent = 'No tiene Tareas en este Proyecto';
        mensaje.classList.add('eliminar');
        mensaje.classList.add('baja');
    }
}

function agregarTarea(form,proyecto,elemento){
    let nombre = form.nameTask.value;
    let prioridad = form.prioridadTask.value;
    let fechaEntrega = form.fechaEntregaTask.value;
    let fechaPaConvertir = {
        fechaEntrega : fechaEntrega
    }
    if(nombre =='' || prioridad == '' || fechaEntrega == ''){
        alert('Por favor, complete todos los campos');
    }else if(isFuture(convertirFecha(fechaPaConvertir)) || isToday(convertirFecha(fechaPaConvertir))){
        proyecto.addTask(nombre,prioridad,fechaEntrega);
        listarTareas(proyecto,elemento);
    }else{
        alert('Error: introduzca una fecha valida');
    }   
}

function agregarNuevaTarea(proyecto,elemento){
    const dialog = document.querySelector('#dialogoAddTarea');
    dialog.showModal();
    
    const form = document.querySelector('#formAddTarea');
    const confirm = document.createElement('button');
    const cancel = document.createElement('button');

    confirm.textContent='confirmar';
    cancel.textContent='cancelar';

    form.appendChild(confirm);
    form.appendChild(cancel);

    confirm.addEventListener('click',(event)=>{
        event.preventDefault();
        agregarTarea(form,proyecto,elemento);
        dialog.close();
        event.target.remove();
        cancel.remove()
    })


    cancel.addEventListener('click',(event)=>{
        event.preventDefault();
        dialog.close();
        event.target.remove();
        confirm.remove();
    })
}

function editarTask(form,proyecto,id,elemento){
    let fecha = {
        fechaEntrega : form.fechaEntregaTask.value
    }
    if(isFuture(convertirFecha(fecha)) || isToday(convertirFecha(fecha))){
        proyecto.editNameTask(id,form.nameTask.value);
        proyecto.editPrioridadTask(id,form.prioridadTask.value);
        proyecto.editFechaTask(id,form.fechaEntregaTask.value);
        let tarea = proyecto.getTask(id);
        convertirFecha(tarea);
        elemento.removeAttribute('prioridad');
        elemento.classList.remove('tarea-pasada');
        elemento.classList.add(tarea.prioridad);
        const h1 = document.querySelector(`#h${elemento.id}`);
        h1.textContent = tarea.name;
    }else{
        alert('Error: ha introducido una fecha del pasado.')
    }
}

function checkTask(check,proyecto,elemento,proyectoArray){
    let id = check.dataset.div;
    proyecto.removeTask(id);
    listarTareas(proyecto,elemento,proyectoArray)
}

function editarTarea(elemento,proyecto){
    let id = elemento.dataset.id;
    let tarea = proyecto.getTask(id);
    
    const dialog = document.querySelector('#dialogoTarea');
    dialog.showModal();
    
    const form = document.querySelector('#formTarea');
    const confirm = document.createElement('button');
    const cancel = document.createElement('button');

    confirm.textContent='confirmar';
    cancel.textContent='cancelar';

    form.appendChild(confirm);
    form.appendChild(cancel);

    const prioridad = document.querySelector('#prioridadTask');
    
    form.nameTask.value=tarea.name;
    form.fechaEntregaTask.value=tarea.fechaEntrega;
    switch(`${tarea.prioridad}`){
        case 'alta':
            prioridad.options[0].selected = true;
                break;
        case 'media':
            prioridad.options[1].selected = true;
                break;
        case 'baja':
            prioridad.options[2].selected = true;
                break;
    }

    confirm.addEventListener('click',(event)=>{
        event.preventDefault();
        editarTask(form,proyecto,id,elemento);
        dialog.close();
        event.target.remove();
        cancel.remove()
    })

    cancel.addEventListener('click',(event)=>{
        event.preventDefault();
        dialog.close();
        event.target.remove();
        confirm.remove();
    })
}



function mouseEntro(elemento,proyecto){
    let tarea=proyecto.getTask(elemento.dataset.id);
    elemento.classList.add('cursor');
    const p = document.createElement('p');
    p.textContent=tarea.fechaEntrega;
    elemento.appendChild(p);
    const button = document.createElement('button');
    button.textContent = 'Editar';
    elemento.appendChild(button);
    button.classList.add('desplazamiento');
    p.classList.add('desplazamiento2');
    button.addEventListener('click',()=>{
        editarTarea(elemento,proyecto);
    })
}

function mouseSalio(elemento){
    let child = document.querySelector('.desplazamiento');
    elemento.removeChild(child);
    child = document.querySelector('.desplazamiento2');
    elemento.removeChild(child);
}

function funcionEliminarProyecto(proyecto,array){
    let i = proyecto.dataset.id;
    let o= i;
    array.splice(i,1);
    proyecto.removeAttribute('id');
    proyecto.remove();
    while(true){
        o++;
        const li = document.querySelector(`#proyecto${o}`);
        console.log(li);
        if(li != null){
            li.removeAttribute('id');
            li.setAttribute('id',`proyecto${o-1}`);
            li.dataset.id=o-1;
        }else{
            break;
        }
    }
    if(o-i==1){
        console.log(i)
        console.log(o)
        const infoH1 = document.querySelector('#info-h1');
        const infoP1 = document.querySelector('#info-p');
        const li = document.querySelector(`#proyecto${i-1}`);
        li.classList.add('activo');
        infoH1.textContent=array[i-1].name;
        infoP1.textContent=array[i-1].description;
        listarTareas(array[i-1],li,array);
    }else{
        console.log(i)
        console.log(o)
        const infoH1 = document.querySelector('#info-h1');
        const infoP1 = document.querySelector('#info-p');
        const li = document.querySelector(`#proyecto${o-2}`);
        li.classList.add('activo');
        infoH1.textContent=array[o-2].name;
        infoP1.textContent=array[o-2].description;
        listarTareas(array[o-2],li,array);
    }
    
}

function listarTareas(Proyecto,elementoProyecto,proyectoArray){
    const contenido = document.querySelector('#contenido');
    const informacion = document.querySelector('#Informacion');
    
    const nuevaTaskButton1 = document.querySelector('#botonAdd');
    const eliminar = document.querySelector('#botonEliminar');
    if(nuevaTaskButton1 !=null){
        nuevaTaskButton1.remove();
    }

    if(eliminar !=null){
        eliminar.remove();
    }

    if(elementoProyecto.dataset.id != 0){
        const eliminarProyecto = document.createElement('button');
        eliminarProyecto.setAttribute('id','botonEliminar');
        eliminarProyecto.textContent = 'Eliminar Proyecto';
        informacion.appendChild(eliminarProyecto);
        eliminarProyecto.addEventListener('click',()=>{
            funcionEliminarProyecto(elementoProyecto,proyectoArray);
        })
        
    }


    const nuevaTaskButton = document.createElement('button');
    
    nuevaTaskButton.setAttribute('id','botonAdd');
    
    informacion.appendChild(nuevaTaskButton);
    nuevaTaskButton.addEventListener('click',()=>{
        agregarNuevaTarea(Proyecto,elementoProyecto);
    })

    nuevaTaskButton.textContent='Agregar Tarea'

    if(contenido.firstChild != null){
        while (contenido.firstChild) {
            contenido.removeChild(contenido.firstChild);
          }
    }

    let count=0;
    if(Proyecto.getLength() == 0){
        mensajeNoHayTareas(contenido);
    }else{
        for(let i=0;i<Proyecto.getLength();i++){
            let tarea = Proyecto.getTask(i);
            
            const div = document.createElement('div');
            const titulo = document.createElement('div');
            div.appendChild(titulo);
            console.log(tarea.name);
            if(isToday(convertirFecha(tarea))|| isFuture(convertirFecha(tarea))){
                div.classList.add(tarea.prioridad);
            }else{
                div.classList.add('tarea-pasada');
            }
            div.classList.add('task');
            div.setAttribute('data-id',i);
            div.setAttribute('id',count);
            contenido.appendChild(div);
            
            const check = document.createElement('button');
            check.classList.add('botonCheck');
            check.setAttribute('data-id',i);
            check.setAttribute('data-div',count);
            titulo.appendChild(check);

            const h1 = document.createElement('h1');
            h1.setAttribute('id',`h${count}`);
            h1.textContent = tarea.name;
            titulo.appendChild(h1);
            
            div.addEventListener('mouseenter',(value)=>{
                mouseEntro(value.target,Proyecto);
            })
            div.addEventListener('mouseleave',(value)=>{
                mouseSalio(value.target);
            })
            check.addEventListener('click',(event)=>{
                checkTask(event.target,Proyecto,elementoProyecto,proyectoArray);
            })
            console.log({
                name:tarea.name,
                prioridad:tarea.prioridad,
                fechaEntrega:tarea.fechaEntrega
            });
            count ++;
        }
    }
}


export{listarTareas};
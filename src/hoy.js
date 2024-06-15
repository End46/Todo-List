import { isFuture,isToday } from 'date-fns';

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
        p.textContent = 'No tiene Tareas Pendientes Para Hoy';
        mensaje.classList.add('eliminar');
        mensaje.classList.add('baja');
    }
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
        if(isToday(convertirFecha(tarea))){
            elemento.removeAttribute('prioridad');
            elemento.classList.add(tarea.prioridad);
            const h1 = document.querySelector(`#h${elemento.id}`);
            h1.textContent = tarea.name;
        }else{
            const contenido = document.querySelector('#contenido');
            contenido.removeChild(elemento);
            mensajeNoHayTareas(contenido);
        }
    }else{
        alert('Error: ha introducido una fecha del pasado.')
    }
}

function checkTask(check,proyecto,proyectos){
    let id = check.dataset.div;
    proyecto.removeTask(check.dataset.id);
    MostrarHoy(proyectos)
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
        cancel.remove();
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

function listarTareasDeHoy(Proyecto,contenido,contador,proyectos){
    let count=contador;
    if(Proyecto.getLength() == 0){
        console.log('no hay tareas');
    }else{
        for(let i=0;i<Proyecto.getLength();i++){
            let tarea = Proyecto.getTask(i);
            if(isToday(convertirFecha(tarea))){
                const div = document.createElement('div');
                const titulo = document.createElement('div');
                div.appendChild(titulo);
                console.log(tarea.name);
                div.classList.add(tarea.prioridad);
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
                    checkTask(event.target,Proyecto,proyectos);
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
    return count;
}

function MostrarHoy(proyectos){
    const contenido = document.querySelector('#contenido');
    if(contenido.firstChild != null){
        while (contenido.firstChild) {
            contenido.removeChild(contenido.firstChild);
          }
    }

    const eliminar = document.querySelector('#botonAdd');
    if(eliminar != null){
        eliminar.remove();
    }

    let contador = 0;
    for(let i=0;i<proyectos.length;i++){
        let proyecto = proyectos[i];
        contador= listarTareasDeHoy(proyecto,contenido,contador,proyectos);
    }
    if(contador == 0){
        mensajeNoHayTareas(contenido);
    }
}

export{MostrarHoy};
function editarTarea(id,proyecto){
    const dialog = document.querySelector('#dialogoTarea');
    dialog.showModal();
    const form = document.querySelector('#formTarea');
    const confirm = document.querySelector('#confirmTarea');
    const cancel = document.querySelector('#cancelTarea');

    confirm.addEventListener('click',(event)=>{
        event.preventDefault();
        
    })

    cancel.addEventListener('click',(event)=>{
        event.preventDefault();
        dialogProyecto.close();
    })
}



function mouseEntro(elemento,tarea,proyecto){
    const p = document.createElement('p');
    p.textContent=tarea.fechaEntrega;
    elemento.appendChild(p);
    const button = document.createElement('buuton');
    button.textContent = 'Editar';
    button.setAttribute('value',elemento.value)
    elemento.appendChild(button);
    button.addEventListener('click',(event)=>{
        editarTarea(event.target.value,proyecto);
    })
}

function mouseSalio(elemento){
    while (elemento.firstChild) {
        elemento.removeChild(elemento.firstChild);
      }
}

function listarTareasDeHoy(Proyecto,contenido){
    if(Proyecto.getLength() == 0){
        console.log('no hay tareas');
    }else{
        let count=0;
        for(let i=0;i<Proyecto.getLength();i++){
            let tarea = Proyecto.getTask(i);
            if(isToday(tarea.fechaEntrega)){
                const div = document.createElement('div');
                div.classList.add(tarea.prioridad);
                div.classList.add('task');
                div.setAttribute('value',i);
                contenido.appendChild(div);
                const h1 = document.createElement('h1');
                h1.textContent = tarea.nombre;
                div.appendChild(h1);
                div.addEventListener('mouseenter',(value)=>{
                    mouseEntro(value.target,tarea,Proyecto);
                })
                div.addEventListener('mouseleave',(value)=>{
                    mouseSalio(value.target);
                })
                console.log({
                    name:tarea.name,
                    prioridad:tarea.prioridad,
                    fechaEntrega:tarea.fechaEntrega
                });
                count ++;
            }
        }
        return count;
    }
}

function MostrarHoy(proyectos){
    const h1 = document.querySelector('#info-h1');
    const p = document.querySelector('#info-p');
    const contenido = document.querySelector('#contenido');
    let contador = 0;
    for(let i=0;i<proyectos.length;i++){
        let proyecto = proyectos[i];
        contador+=listarTareasDeHoy(proyecto,contenido);
    }
}
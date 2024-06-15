import { CreateProject } from "./objetos";

function storageAvailable(type) {
    let storage;
    try {
      storage = window[type];
      const x = "__storage_test__";
      storage.setItem(x, x);
      storage.removeItem(x);
      return true;
    } catch (e) {
      return (
        e instanceof DOMException &&
        // everything except Firefox
        (e.code === 22 ||
          // Firefox
          e.code === 1014 ||
          // test name field too, because code might not be present
          // everything except Firefox
          e.name === "QuotaExceededError" ||
          // Firefox
          e.name === "NS_ERROR_DOM_QUOTA_REACHED") &&
        // acknowledge QuotaExceededError only if there's something already stored
        storage &&
        storage.length !== 0
      );
    }
  }
  
  function cargar(proyectos,dom){
    if (storageAvailable("localStorage")) {
      console.log('Tenemos Guardado que alegria');
      let array = JSON.parse(localStorage.getItem('proyectos'));
      if(array == null){
        return true;
      }else{
        for(let i=0;i<array.length;i++){
          let proyecto = array[i];
          let tareas = proyecto.tasks;
          console.log(tareas)
          proyecto = CreateProject(proyecto.name,proyecto.description);
          proyecto.cargarTasks(tareas);
          proyectos.push(proyecto)
          dom.addProyecto(proyecto.name,i,proyectos);
        }
        return false;
      }
    } else {
      console.log('Raza usted anda pobre hasta de espacio');
      return true;
    }
  }


  function guardar(proyectos){
    if (storageAvailable("localStorage")) {
        console.log('Trabajando con guardado');
        localStorage.removeItem('proyectos');
        localStorage.setItem('proyectos', JSON.stringify(proyectos));
      } else {
        console.log('Trabajando sin guardado');
      }
        
  }



  export{guardar,cargar}
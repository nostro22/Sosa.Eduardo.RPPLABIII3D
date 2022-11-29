
export default class Alerta {
     alerta =[];
    
    constructor(titulo, descripcion) {
        this.titulo = titulo;
        this.descripcion = descripcion;
        this.alerta = this.crearAlert();   
    }
    crearAlert() {
        const anuncio = document.createElement("dialog");
        anuncio.classList.add("alert_container");
        //anuncio.classList.add("hidden");

        const divTitulo = document.createElement("div");
        const h2Titulo = document.createElement("h2");
        divTitulo.classList.add("alert_titulo");
        const divDescripcion = document.createElement("p");
        divDescripcion.classList.add("alert_Descripcion");

        h2Titulo.textContent = this.titulo;
        divDescripcion.textContent = this.descripcion;
        divTitulo.appendChild(h2Titulo);
        anuncio.appendChild(divTitulo);
        anuncio.appendChild(divDescripcion);
        return anuncio;
    }
    MostarAnuncio(divContenedor) {
        divContenedor.appendChild(this.alerta);
        setTimeout(() => {
            divContenedor.removeChild(this.alerta);
        }, 2000);
    }
    editarAnuncio(nuevaTitulo, nuevaDescripcion) {
        this.descripcion = nuevaDescripcion;
        this.titulo = nuevaTitulo;
        this.alerta = this.crearAlert();
    }

}


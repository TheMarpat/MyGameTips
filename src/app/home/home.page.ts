import { FirestoreService } from '../firestore.service';
import { Router } from "@angular/router";
import { Consejo } from '../consejo';
import { Component, OnInit } from "@angular/core";

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})


export class HomePage {
  
  consejoEditando: Consejo;  
  idConsejoSelec: string;
  insertando = false;
  arrayColeccionConsejos: any = [{
    id: "",
    data: {} as Consejo
   }];


  obtenerListaConsejos(){
    this.firestoreService.consultar("consejos").subscribe((resultadoConsultaConsejos) => {
      this.arrayColeccionConsejos = [];
      resultadoConsultaConsejos.forEach((datosConsejo: any) => {
        this.arrayColeccionConsejos.push({
          id: datosConsejo.payload.doc.id,
          data: datosConsejo.payload.doc.data()
        });
      })
    });
  }

  constructor(private firestoreService: FirestoreService, private router: Router) {
    // Crear una tarea vacía
    this.consejoEditando = {} as Consejo;
    this.obtenerListaConsejos();
  }

  

  selecConsejo(consejoSelec) {
    console.log("Consejo seleccionado : ");
    console.log(consejoSelec);
    this.idConsejoSelec = consejoSelec.id;
    this.consejoEditando.titulo = consejoSelec.data.titulo;
    this.consejoEditando.texto = consejoSelec.data.juego;
    this.consejoEditando.texto = consejoSelec.data.texto;
    this.consejoEditando.plataforma = consejoSelec.data.plataforma;
  }
  nuevoConsejo(){
    this.insertando = true;
  }
  clicBotonInsertar() {
    this.insertando = false;

    this.firestoreService.insertar("consejos", this.consejoEditando).then(() => {
      console.log('Consejo creado correctamente!');
      this.consejoEditando= {} as Consejo;
    }, (error) => {
      console.error(error);
    });
  }

  clicBotonBorrar() {
    this.firestoreService.borrar("consejos", this.idConsejoSelec).then(() => {
      // Actualizar la lista completa
      this.obtenerListaConsejos();
      // Limpiar datos de pantalla
      this.consejoEditando = {} as Consejo;
    })
  }

  clicBotonModificar() {
    this.firestoreService.actualizar("consejos", this.idConsejoSelec, this.consejoEditando).then(() => {
      // Actualizar la lista completa
      this.obtenerListaConsejos();
      // Limpiar datos de pantalla
      this.consejoEditando = {} as Consejo;
    })
  }

  navigateToDetalle(consejoSelec){
    this.router.navigate(["/detalle/"+consejoSelec.id]);
  }

}


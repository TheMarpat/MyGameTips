import { FirestoreService } from '../firestore.service';
import { Component, OnInit } from '@angular/core';
import { Consejo } from '../consejo';
import { ActivatedRoute } from "@angular/router";
import { Router } from "@angular/router";

@Component({
  selector: 'app-detalle',
  templateUrl: './detalle.page.html',
  styleUrls: ['./detalle.page.scss'],
})
export class DetallePage implements OnInit {

  document: any = {
    id: "",
    data: {} as Consejo
  };

  idConsulta = null;
  
  constructor( private firestoreService: FirestoreService, private activatedRoute: ActivatedRoute, private router: Router) {
    this.idConsulta = this.activatedRoute.snapshot.paramMap.get("id");
    this.firestoreService.consultarPorId("consejos", this.idConsulta).subscribe((resultado) => {
      // Preguntar si se hay encontrado un document con ese ID
      if(resultado.payload.data() != null) {
        this.document.id = resultado.payload.id
        this.document.data = resultado.payload.data();
        // Como ejemplo, mostrar el título de la tarea en consola
        console.log(this.document.data.titulo);    
        this.selecConsejo(this.document);
      } else {
        // No se ha encontrado un document con ese ID. Vaciar los datos que hubiera
        this.document.data = {} as Consejo;
      } 
    });
  }
  clicBotonBorrar() {
    this.firestoreService.borrar("consejos", this.document.data.id).then(() => {
    this.navigateToHome();
    })
  }

  clicBotonModificar() {
    this.firestoreService.actualizar("consejos", this.document.data.id, this.document.data ).then(() => {
    this.navigateToHome();
    })
  }
  
  selecConsejo(document) {
    console.log("Consejo seleccionado : ");
    console.log(document);
    this.document.data.id = document.id;
    this.document.data.titulo = document.data.titulo;
    this.document.data.juego = document.data.juego;
    this.document.data.texto = document.data.texto;
    this.document.data.plataforma = document.data.plataforma;
  }
  navigateToHome(){
    this.router.navigate(["/home/"]);
  }
  ngOnInit() {

  }

}

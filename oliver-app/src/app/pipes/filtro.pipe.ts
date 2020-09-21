import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filtro'
})
export class FiltroPipe implements PipeTransform {

  transform(arreglo: any [] , texto: string, columna: any): any[] {

    if (texto === '' ){
      return arreglo;
    }
    console.log(texto)
    texto = texto.toLowerCase();

    return arreglo.filter((item) => {
      console.log( item[columna])
        return item[columna].toLowerCase().
        includes(texto);
      });
  }

}
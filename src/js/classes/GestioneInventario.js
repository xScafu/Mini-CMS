import { Prodotto } from "./prodotto/Prodotto";
import { ProdottoAlimentare } from "./prodotto/tipi/Alimentare";
import { ProdottoElettronico } from "./prodotto/tipi/Elettronico";
import { GestioneContabilita } from "./GestioneContabilita";

export class GestoreInventario {
  constructor() {
    this.prodotti = {};
    this.nextId = 1;
    this.transazioni = [];
    this.contabilita = new GestioneContabilita();
  }

  aggiungiProdotto(
    tipo,
    nome,
    prezzo,
    quantita,
    costo,
    dataScadenza,
    garanzia,
    dataAcquisto
  ) {
    const prodottoEsistente = Object.values(this.prodotti).find(
      (prodotto) => prodotto.nome === nome
    );
    if (prezzo && quantita > 0 && costo >= 0) {
      if (prodottoEsistente) {
        prodottoEsistente.quantita += quantita;
        console.log(
          `Aggiunto ${quantita} a ${nome}. La quantita ora è ${prodottoEsistente.quantita}.`
        );
      } else if (tipo === "generico") {
        const prodotto = new Prodotto(
          nome,
          prezzo,
          quantita,
          costo,
          dataAcquisto
        );
        this.prodotti[this.nextId] = prodotto;
        this.nextId++;
        console.log(
          `Il prodotto ${prodotto.nome} è stato aggiunto. La quantita è di ${prodotto.quantita} con un prezzo di ${prodotto.prezzo}`
        );
      } else if (tipo === "alimentare") {
        const prodottoAlimentare = new ProdottoAlimentare(
          nome,
          prezzo,
          quantita,
          costo,
          dataScadenza,
          dataAcquisto
        );
        this.prodotti[this.nextId] = prodottoAlimentare;
        this.nextId++;
        console.log(
          `Il prodotto ${prodottoAlimentare.nome} è stato aggiunto. La quantita è di ${prodottoAlimentare.quantita} con un prezzo di ${prodottoAlimentare.prezzo}`
        );
      } else if (tipo === "elettronica") {
        const prodottoElettronico = new ProdottoElettronico(
          nome,
          prezzo,
          quantita,
          costo,
          garanzia,
          dataAcquisto
        );
        this.prodotti[this.nextId] = prodottoElettronico;
        this.nextId++;
        console.log(
          `Il prodotto ${prodottoElettronico.nome} è stato aggiunto. La quantita è di ${prodottoElettronico.quantita} con un prezzo di ${prodottoElettronico.prezzo}`
        );
      }
    } else {
      console.log("ERRORE: prodotto non aggiunto.");
    }
  }

  vendiProdotto(
    id,
    quantita,
    data = new Date().getTime(),
    isSimulation = false
  ) {
    if (this.prodotti[id]) {
      if (isSimulation || this.prodotti[id].quantita >= quantita) {
        const transazioneVendita = {
          idProdotto: id,
          quantitaVenduta: quantita,
          venditaUnitario: this.prodotti[id].prezzo,
          costoUnitario: this.prodotti[id].costo,
          data: data,
        };
        this.transazioni.push(transazioneVendita);
        if (!isSimulation) {
          this.prodotti[id].quantita -= quantita;
          this.prodotti[id].venduti += quantita;
        }
        console.log(
          `Vendita di ${quantita} ${this.prodotti[id].nome} andata a buon fine. In inventario ne rimangono ${this.prodotti[id].quantita}`
        );
      } else {
        console.log(`ERRORE: non c'è nè abbastanza per vendere`);
      }
    } else {
      console.log(
        `ERRORE: nessun prodotto presente nell'inventario con Codice Prodotto ${id}.`
      );
    }
  }

  simulaVendite(venditeArray) {
    venditeArray.forEach((vendita) => {
      this.vendiProdotto(vendita.id, vendita.quantita, vendita.data, true);
    });
  }

  visualizzaInventario() {
    console.log("Presenti nell'inventario");
    Object.entries(this.prodotti).forEach(([id, dettagli]) => {
      console.log(
        `Codice Prodotto: ${id} | Prodotto: ${dettagli.nome} | Prezzo: ${dettagli.prezzo} | Stock: ${dettagli.quantita}`
      );
    });
  }
}

import { Prodotto } from "../Prodotto.js";

export class ProdottoAlimentare extends Prodotto {
  constructor(nome, prezzo, quantita, costo, dataScadenza, dataAcquisto) {
    super(nome, prezzo, quantita, costo);
    this.dataScadenza = dataScadenza;
    this.dataAcquisto = dataAcquisto;
  }
}

import { Prodotto } from "../Prodotto.js";

export class ProdottoElettronico extends Prodotto {
  constructor(nome, prezzo, quantita, costo, garanzia) {
    super(nome, prezzo, quantita, costo);
    this.garanzia = garanzia;
  }
}

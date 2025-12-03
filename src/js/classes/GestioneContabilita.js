export class GestioneContabilita {
  calcolaGuadagno(prodotti) {
    let guadagnoTotale = 0;
    Object.values(prodotti).forEach((prodotto) => {
      guadagnoTotale += (prodotto.prezzo - prodotto.costo) * prodotto.venduti;
    });
    return guadagnoTotale;
  }

  calcolaCostoInventario(prodotti) {
    let costoTotale = 0;
    Object.values(prodotti).forEach((prodotto) => {
      costoTotale += prodotto.costo * prodotto.quantitaIniziale;
    });
    return costoTotale;
  }

  calcolaBilancio(prodotti) {
    let bilancio =
      this.calcolaGuadagno(prodotti) - this.calcolaCostoInventario(prodotti);
    return bilancio;
  }

  getTransazioniPerPeriodo(transazioni, mesi) {
    const dataDiInizio = new Date();

    dataDiInizio.setMonth(dataDiInizio.getMonth() - mesi, 1);

    const transazioniFiltrate = transazioni.filter(
      (t) => t.data >= dataDiInizio
    );
    return transazioniFiltrate;
  }

  calcolaBilancioStorico(transazioniPeriodo) {
    let totaleTransazioni = 0;
    transazioniPeriodo.forEach((transazione) => {
      totaleTransazioni +=
        transazione.quantitaVenduta *
        (transazione.venditaUnitario - transazione.costoUnitario);
    });
    return totaleTransazioni;
  }
}

import { Prodotto } from "./prodotto/Prodotto";
import { ProdottoAlimentare } from "./prodotto/tipi/Alimentare";
import { ProdottoElettronico } from "./prodotto/tipi/Elettronico";
import { GestioneContabilita } from "./GestioneContabilita";

class GestoreInventario {
  constructor(renderHTML) {
    this.prodotti = {};
    this.nextId = 1;
    this.render = renderHTML;
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
        this.render(this.prodotti);
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
        this.render(this.prodotti);
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
        this.render(this.prodotti);
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
        this.render(this.prodotti);
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
          this.render(this.prodotti);
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

function renderHTML(inventario) {
  let renderInventario = document.querySelector(".js-inventario");
  if (renderInventario) {
    renderInventario.innerHTML = `<ul>
      ${Object.entries(inventario)
        .map(([id, prodotto]) => {
          let dettagliAggiuntivi = "";
          if (prodotto instanceof ProdottoAlimentare) {
            dettagliAggiuntivi = ` | Scadenza: ${prodotto.dataScadenza}`;
          } else if (prodotto instanceof ProdottoElettronico) {
            dettagliAggiuntivi = ` | Garanzia: ${prodotto.garanzia} `;
          }
          return `<li>ID: ${id} | Nome: ${prodotto.nome} | Quantita: ${prodotto.quantita} | Prezzo: ${prodotto.prezzo}€ | Costo: ${prodotto.costo}€ ${dettagliAggiuntivi} | ${prodotto.dataAcquisto}</li>`;
        })
        .join("")}
    </ul>`;
  } else {
    console.log("ERRORE: Nessun prodotto nell'inventario");
  }
}

const inventario = new GestoreInventario(renderHTML);
const date = new Date();

const gestioneInventario = document.querySelector(".js-gestione-inventario");
const verificaTipoSelect = document.querySelector(".js-select-tipo");

const venditaForm = document.querySelector(".js-form-vendita");

gestioneInventario.addEventListener("submit", inserisciArticolo);
verificaTipoSelect.addEventListener("change", verificaTipo);
venditaForm.addEventListener("submit", vendiArticolo);

let pastDate = date - 25 * 24 * 60 * 60 * 1000;

const venditeIniziali = [
  { id: 1, quantita: 5, data: pastDate },
  { id: 2, quantita: 3, data: pastDate },
  { id: 3, quantita: 10, data: pastDate },
  { id: 1, quantita: 2, data: pastDate }, // Una seconda vendita dello stesso prodotto
];

caricaInventarioIniziale();

function currentDate() {
  let day = date.getDate().toString();
  let month = date.getMonth().toString();
  let year = date.getFullYear().toString();

  return `${day}/${month}/${year}`;
}

function inserisciArticolo(e) {
  e.preventDefault();
  let tipo = e.target.elements.tipo.value;
  let nome = e.target.elements.nome.value;
  let quantita = Number(e.target.elements.quantita.value);
  let prezzo = Number(e.target.elements.prezzo.value);
  let costo = Number(e.target.elements.costo.value);
  let dataScadenza = e.target.elements.scadenza.value;
  let garanzia = e.target.elements.garanzia.value;

  if (tipo.toLowerCase() === "alimentare") {
    inventario.aggiungiProdotto(
      tipo,
      nome,
      prezzo,
      quantita,
      costo,
      dataScadenza
    );
  } else if (tipo.toLowerCase() === "elettronica") {
    inventario.aggiungiProdotto(
      tipo,
      nome,
      prezzo,
      quantita,
      costo,
      null,
      garanzia
    );
  } else {
    inventario.aggiungiProdotto(tipo, nome, prezzo, quantita, costo);
  }

  gestioneInventario.reset();
  verificaTipo();
  aggiornaStatisticheUI();
}

function verificaTipo() {
  const dataScadenzaInput = document.querySelector(".js-data-scadenza");
  const dataGaranziaInput = document.querySelector(".js-garanzia");
  if (verificaTipoSelect.value === "alimentare") {
    dataScadenzaInput.classList.remove("hidden");
  } else {
    dataScadenzaInput.classList.add("hidden");
  }

  if (verificaTipoSelect.value === "elettronica") {
    dataGaranziaInput.classList.remove("hidden");
  } else {
    dataGaranziaInput.classList.add("hidden");
  }
}

function vendiArticolo(e) {
  e.preventDefault();
  let id = Number(e.target.elements.id.value);
  let quantita = Number(e.target.elements.quantitaVendita.value);

  inventario.vendiProdotto(id, quantita);

  aggiornaStatisticheUI();
}

async function caricaInventarioIniziale() {
  try {
    const response = await fetch("http://localhost:3000/prodotti");
    const data = await response.json();

    data.forEach((prodotto) => {
      inventario.aggiungiProdotto(
        prodotto.tipo.toLowerCase(),
        prodotto.nome,
        Number(prodotto.prezzo),
        Number(prodotto.quantita),
        Number(prodotto.costo),
        prodotto.dataScadenza,
        prodotto.garanzia,
        prodotto.dataAcquisto
      );
    });
    inventario.render(inventario.prodotti);
    inventario.simulaVendite(venditeIniziali);
    aggiornaStatisticheUI();
  } catch (error) {
    console.log(`ERRORE: ${error}`);
  }
}

function aggiornaStatisticheUI() {
  const prodottiArray = Object.values(inventario.prodotti);

  //Numero di prodotto
  const numeroProdotti = prodottiArray.length;
  const printNumeroProdotti = document.querySelector(".js-numero-prodotti");
  if (numeroProdotti) {
    printNumeroProdotti.textContent = numeroProdotti;
  }

  //Quantita totale
  const quantitaTotale = prodottiArray.reduce(
    (accumulatore, prodottoCorrente) => {
      return accumulatore + prodottoCorrente.quantita;
    },
    0
  );

  const printQuantitaTotale = document.querySelector(".js-quantita-totale");
  if (printQuantitaTotale) {
    printQuantitaTotale.textContent = quantitaTotale;
  }

  //Costo totale
  const costoTotale = prodottiArray.reduce((accumulatore, prodottoCorrente) => {
    return accumulatore + prodottoCorrente.costo * prodottoCorrente.quantita;
  }, 0);

  const printCostoTotale = document.querySelector(".js-costo-totale");
  if (printCostoTotale) {
    printCostoTotale.textContent = costoTotale + " €";
  }

  //numero tipi di prodotti
  const tipiDiProdotti = prodottiArray.map((prodottoCorrente) => {
    return prodottoCorrente.constructor.name;
  });

  const printTipiProdotti = document.querySelector(".js-numero-tipi-prodotti");
  if (printTipiProdotti) {
    printTipiProdotti.textContent = new Set(tipiDiProdotti).size;
  }

  //date
  const currentDateUi = document.querySelector(".js-date");
  currentDateUi.textContent = currentDate();

  // Calcoli Finanziari Cumulativi
  const guadagno = document.querySelector(".js-guadagno");
  const bilancio = document.querySelector(".js-bilancio");
  // const costo = document.querySelector(".js-costo");

  // 1. Calcoli cumulativi
  guadagno.textContent =
    inventario.contabilita.calcolaGuadagno(inventario.prodotti) + " €";
  // costo.textContent =
  //   inventario.contabilita.calcolaCostoInventario(inventario.prodotti) + " €";
  bilancio.textContent =
    inventario.contabilita.calcolaBilancio(inventario.prodotti) + " €";

  // ---
  // Bilanci Storici
  const bilancioMese = document.querySelector(".js-last-month-balance");
  const bilancioTreMesi = document.querySelector(
    ".js-last-three-month-balance"
  );

  // 2. Calcoli Storici
  let filtroMese = inventario.contabilita.getTransazioniPerPeriodo(
    inventario.transazioni,
    1
  );
  let filtroTreMesi = inventario.contabilita.getTransazioniPerPeriodo(
    inventario.transazioni,
    3
  );

  let calcoloBilancioMese =
    inventario.contabilita.calcolaBilancioStorico(filtroMese);
  let calcoloBilancioTreMesi =
    inventario.contabilita.calcolaBilancioStorico(filtroTreMesi);

  bilancioMese.textContent = calcoloBilancioMese + " €";
  bilancioTreMesi.textContent = calcoloBilancioTreMesi + " €";
}

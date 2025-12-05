import "../scss/main.scss";

import "../js/lucide-icons/lucide.js";

import "./classes/prodotto/Prodotto.js";
import "./classes/prodotto/tipi/Alimentare.js";
import "./classes/prodotto/tipi/Alimentare.js";

import "../js/classes/GestioneInventario.js";
import { GestoreInventario } from "../js/classes/GestioneInventario.js";

export class PageDashboard {
  constructor() {
    console.log("init");
    this.cards = [];
  }

  init() {
    this.fetchCards();

    const spinner = document.querySelector(".js-loader");
    spinner.showModal();

    setTimeout(() => {
      spinner.classList.add("hidden");
      spinner.close();
    }, 2000);
  }
  async fetchCards() {
    //fetch dati
    try {
      const response = await fetch("http://localhost:3000/cards");
      const data = await response.json();
      console.log(data);
      this.createCards(data);
    } catch (error) {
      console.log(error);
    }
  }
  createCards(data) {
    console.log(Array.isArray(this.cards));
    console.log(data.length);
    const template = document.querySelector("#template-card");
    const wrapper = document.querySelector(".cards-riassunto");
    for (let i = 0; i <= data.length; i++) {
      const clone = template.content.cloneNode(true);
      clone.querySelector(".js-card-title").innerHTML = data[i].label;
      clone.querySelector(".js-card-value").innerHTML = data[i].value;
      //   clone
      //     .querySelector(".js-card-icon")
      //     .setAttribute("data-lucide", data[i].icon);
      console.log(clone);
      wrapper.appendChild(clone);
    }
  }
}

// function initInventario() {
//   const inventario = new GestoreInventario();
//   const date = new Date();

//   const gestioneInventario = document.querySelector(".js-gestione-inventario");
//   const verificaTipoSelect = document.querySelector(".js-select-tipo");

//   const venditaForm = document.querySelector(".js-form-vendita");

//   gestioneInventario.addEventListener("submit", inserisciArticolo);
//   verificaTipoSelect.addEventListener("change", verificaTipo);
//   venditaForm.addEventListener("submit", vendiArticolo);

//   let pastDate = date - 25 * 24 * 60 * 60 * 1000;

//   const venditeIniziali = [
//     { id: 1, quantita: 5, data: pastDate },
//     { id: 2, quantita: 3, data: pastDate },
//     { id: 3, quantita: 10, data: pastDate },
//     { id: 1, quantita: 2, data: pastDate }, // Una seconda vendita dello stesso prodotto
//   ];

//   caricaInventarioIniziale();

//   function currentDate() {
//     let day = date.getDate().toString();
//     let month = date.getMonth().toString();
//     let year = date.getFullYear().toString();

//     return `${day}/${month}/${year}`;
//   }

//   function inserisciArticolo(e) {
//     e.preventDefault();
//     let tipo = e.target.elements.tipo.value;
//     let nome = e.target.elements.nome.value;
//     let quantita = Number(e.target.elements.quantita.value);
//     let prezzo = Number(e.target.elements.prezzo.value);
//     let costo = Number(e.target.elements.costo.value);
//     let dataScadenza = e.target.elements.scadenza.value;
//     let garanzia = e.target.elements.garanzia.value;

//     if (tipo.toLowerCase() === "alimentare") {
//       inventario.aggiungiProdotto(
//         tipo,
//         nome,
//         prezzo,
//         quantita,
//         costo,
//         dataScadenza
//       );
//     } else if (tipo.toLowerCase() === "elettronica") {
//       inventario.aggiungiProdotto(
//         tipo,
//         nome,
//         prezzo,
//         quantita,
//         costo,
//         null,
//         garanzia
//       );
//     } else {
//       inventario.aggiungiProdotto(tipo, nome, prezzo, quantita, costo);
//     }

//     gestioneInventario.reset();
//     verificaTipo();
//     aggiornaStatisticheUI();
//   }

//   function verificaTipo() {
//     const dataScadenzaInput = document.querySelector(".js-data-scadenza");
//     const dataGaranziaInput = document.querySelector(".js-garanzia");
//     if (verificaTipoSelect.value === "alimentare") {
//       dataScadenzaInput.classList.remove("hidden");
//     } else {
//       dataScadenzaInput.classList.add("hidden");
//     }

//     if (verificaTipoSelect.value === "elettronica") {
//       dataGaranziaInput.classList.remove("hidden");
//     } else {
//       dataGaranziaInput.classList.add("hidden");
//     }
//   }

//   function vendiArticolo(e) {
//     e.preventDefault();
//     let id = Number(e.target.elements.id.value);
//     let quantita = Number(e.target.elements.quantitaVendita.value);

//     inventario.vendiProdotto(id, quantita);

//     aggiornaStatisticheUI();
//   }

//   async function caricaInventarioIniziale() {
//     try {
//       const response = await fetch("http://localhost:3000/prodotti");
//       const data = await response.json();

//       data.forEach((prodotto) => {
//         inventario.aggiungiProdotto(
//           prodotto.tipo.toLowerCase(),
//           prodotto.nome,
//           Number(prodotto.prezzo),
//           Number(prodotto.quantita),
//           Number(prodotto.costo),
//           prodotto.dataScadenza,
//           prodotto.garanzia,
//           prodotto.dataAcquisto
//         );
//       });

//       inventario.simulaVendite(venditeIniziali);
//       aggiornaStatisticheUI();
//     } catch (error) {
//       console.log(`ERRORE: ${error}`);
//     }
//   }

//   function aggiornaStatisticheUI() {
//     const prodottiArray = Object.values(inventario.prodotti);

//     //Numero di prodotto
//     const numeroProdotti = prodottiArray.length;
//     const printNumeroProdotti = document.querySelector(".js-numero-prodotti");
//     if (numeroProdotti) {
//       printNumeroProdotti.textContent = numeroProdotti;
//     }

//     //Quantita totale
//     const quantitaTotale = prodottiArray.reduce(
//       (accumulatore, prodottoCorrente) => {
//         return accumulatore + prodottoCorrente.quantita;
//       },
//       0
//     );

//     const printQuantitaTotale = document.querySelector(".js-quantita-totale");
//     if (printQuantitaTotale) {
//       printQuantitaTotale.textContent = quantitaTotale;
//     }

//     //Costo totale
//     const costoTotale = prodottiArray.reduce(
//       (accumulatore, prodottoCorrente) => {
//         return (
//           accumulatore + prodottoCorrente.costo * prodottoCorrente.quantita
//         );
//       },
//       0
//     );

//     const printCostoTotale = document.querySelector(".js-costo-totale");
//     if (printCostoTotale) {
//       printCostoTotale.textContent = costoTotale + " €";
//     }

//     //numero tipi di prodotti
//     const tipiDiProdotti = prodottiArray.map((prodottoCorrente) => {
//       return prodottoCorrente.constructor.name;
//     });

//     const printTipiProdotti = document.querySelector(
//       ".js-numero-tipi-prodotti"
//     );
//     if (printTipiProdotti) {
//       printTipiProdotti.textContent = new Set(tipiDiProdotti).size;
//     }

//     //date
//     const currentDateUi = document.querySelector(".js-date");
//     currentDateUi.textContent = currentDate();

//     // Calcoli Finanziari Cumulativi
//     const guadagno = document.querySelector(".js-guadagno");
//     const bilancio = document.querySelector(".js-bilancio");
//     // const costo = document.querySelector(".js-costo");

//     // 1. Calcoli cumulativi
//     guadagno.textContent =
//       inventario.contabilita.calcolaGuadagno(inventario.prodotti) + " €";
//     // costo.textContent =
//     //   inventario.contabilita.calcolaCostoInventario(inventario.prodotti) + " €";
//     bilancio.textContent =
//       inventario.contabilita.calcolaBilancio(inventario.prodotti) + " €";

//     // ---
//     // Bilanci Storici
//     const bilancioMese = document.querySelector(".js-last-month-balance");
//     const bilancioTreMesi = document.querySelector(
//       ".js-last-three-month-balance"
//     );

//     // 2. Calcoli Storici
//     let filtroMese = inventario.contabilita.getTransazioniPerPeriodo(
//       inventario.transazioni,
//       1
//     );
//     let filtroTreMesi = inventario.contabilita.getTransazioniPerPeriodo(
//       inventario.transazioni,
//       3
//     );

//     let calcoloBilancioMese =
//       inventario.contabilita.calcolaBilancioStorico(filtroMese);
//     let calcoloBilancioTreMesi =
//       inventario.contabilita.calcolaBilancioStorico(filtroTreMesi);

//     bilancioMese.textContent = calcoloBilancioMese + " €";
//     bilancioTreMesi.textContent = calcoloBilancioTreMesi + " €";
//   }
// }

var page = new PageDashboard();
page.init();

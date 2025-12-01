import { Prodotto } from "./prodotto/Prodotto";
import { ProdottoAlimentare } from "./prodotto/tipi/Alimentare";
import { ProdottoElettronico } from "./prodotto/tipi/Elettronico";

class GestoreInventario {
  constructor(renderHTML) {
    this.prodotti = {};
    this.nextId = 1;
    this.render = renderHTML;
  }

  aggiungiProdotto(
    tipo,
    nome,
    prezzo,
    quantita,
    costo,
    dataScadenza,
    garanzia
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
        const prodotto = new Prodotto(nome, prezzo, quantita, costo);
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
          dataScadenza
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
          garanzia
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

  vendiProdotto(id, quantita) {
    if (this.prodotti[id]) {
      if (this.prodotti[id].quantita >= quantita) {
        this.prodotti[id].quantita -= quantita;
        this.prodotti[id].venduti += quantita;
        this.render(this.prodotti);
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

  calcolaGuadagnoTotale() {
    let guadagnoTotale = 0;
    Object.values(this.prodotti).forEach((prodotto) => {
      guadagnoTotale += (prodotto.prezzo - prodotto.costo) * prodotto.venduti;
    });
    return guadagnoTotale;
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
          return `<li>ID: ${id} | Nome: ${prodotto.nome} | Quantita: ${prodotto.quantita} | Prezzo: ${prodotto.prezzo}€ | Costo: ${prodotto.costo}€ ${dettagliAggiuntivi}</li>`;
        })
        .join("")}
    </ul>`;
  } else {
    console.log("ERRORE: Nessun prodotto nell'inventario");
  }
}

const inventario = new GestoreInventario(renderHTML);

const gestioneInventario = document.querySelector(".js-gestione-inventario");
const verificaTipoSelect = document.querySelector(".js-select-tipo");

const venditaForm = document.querySelector(".js-form-vendita");

gestioneInventario.addEventListener("submit", inserisciArticolo);
verificaTipoSelect.addEventListener("change", verificaTipo);
venditaForm.addEventListener("submit", vendiArticolo);

caricaInventarioIniziale();
aggiornaGuadagnoUI();

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

  aggiornaGuadagnoUI();
}

function aggiornaGuadagnoUI() {
  const guadagno = document.querySelector(".js-guadagno");
  guadagno.innerHTML = inventario.calcolaGuadagnoTotale();
}

async function caricaInventarioIniziale() {
  try {
    const response = await fetch("http://localhost:3000/prodotti");
    const data = await response.json();

    data.forEach((prodotto) => {
      inventario.aggiungiProdotto(
        prodotto.tipo.toLowerCase(),
        prodotto.nome,
        prodotto.prezzo,
        prodotto.quantita,
        prodotto.costo,
        prodotto.dataScadenza,
        prodotto.garanzia
      );
    });
    inventario.render(inventario.prodotti);
  } catch (error) {
    console.log(`ERRORE: ${error}`);
  }
}

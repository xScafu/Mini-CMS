import {
  createIcons,
  SquareChevronLeft,
  SquareChartGantt,
  List,
  ShoppingCart,
  Scale,
  Settings,
  SquareUserRound,
  Barcode,
  NotebookTabs,
  Weight,
  BanknoteArrowDown,
  CircleQuestionMark,
  Search,
} from "lucide";

export class PageDashboard {
  constructor() {
    this.cards = [];
    this.date = new Date();
  }

  init() {
    this.fetchCards();
    this.fetchBilancio();
  }

  async fetchCards() {
    //fetch dati
    this.loadingDataSpinner();
    try {
      const response = await fetch("http://localhost:3000/cards");
      const data = await response.json();
      this.createCards(data);
    } catch (error) {
      console.log(error);
    }
  }
  createCards(data) {
    const template = document.querySelector("#template-card");
    const wrapper = document.querySelector(".cards-riassunto");
    for (let i = 0; i <= data.length - 1; i++) {
      const clone = template.content.cloneNode(true);
      if (data[i].moneySymbol) {
        clone.querySelector(
          ".js-card-value"
        ).innerHTML = `${data[i].value} ${data[i].moneySymbol}`;
      } else {
        clone.querySelector(".js-card-value").innerHTML = data[i].value;
      }
      clone.querySelector(".js-card-title").innerHTML = data[i].label;
      clone
        .querySelector(".js-card-icon")
        .setAttribute("data-lucide", data[i].icon);

      console.log(data[i].icon);

      createIcons({
        icons: {
          SquareChevronLeft,
          SquareChartGantt,
          List,
          ShoppingCart,
          Scale,
          Settings,
          SquareUserRound,
          Barcode,
          NotebookTabs,
          Weight,
          BanknoteArrowDown,
          CircleQuestionMark,
          Search,
        },
      });

      wrapper.appendChild(clone);
    }
  }

  loadingDataSpinner() {
    const spinner = document.querySelector(".js-loader");
    spinner.showModal();

    setTimeout(() => {
      spinner.classList.add("hidden");
      spinner.close();
    }, 2000);
  }

  async fetchBilancio() {
    try {
      fetch("http://localhost:3000/bilancio")
        .then((data) => data.json())
        .then((data) => this.populateBilancio(data));
    } catch (error) {
      console.log(error);
    }
  }

  populateBilancio(data) {
    document.querySelector(
      ".js-bilancio"
    ).innerHTML = `${data[0].value} ${data[0].moneySymbol}`;
    const template = document.querySelector("#card-bilancio-content");
    const container = document.querySelector(".js-card-data-container");
    for (let i = 1; i <= data.length - 1; i++) {
      const clone = template.content.cloneNode(true);
      if (data[i].label) {
        clone.querySelector(".js-balance-label").innerHTML = data[i].label;
        clone.querySelector(
          ".js-balance-value"
        ).innerHTML = `${data[i].value} ${data[i].moneySymbol}`;
      }
      container.appendChild(clone);
    }

    const spanDate = document.querySelector(".js-date");
    spanDate.innerHTML = `${this.date.getDate()}-${this.date.getMonth()}-${this.date.getFullYear()}`;
  }
}

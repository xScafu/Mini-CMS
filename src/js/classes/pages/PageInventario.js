import "../../../scss/main.scss";
import { LoadingSpinner } from "../components/LoadingSpinner";

export class PageInventario {
  constructor() {
    this.spinner = new LoadingSpinner();
    this.inventario = [];
  }

  init() {
    this.fetchInventario();
    console.log("init");
  }

  fetchInventario() {
    this.spinner.spinnerIsActive(true);
    fetch("http://localhost:3000/prodotti")
      .then((res) => res.json())
      .then((data) => {
        this.populateInventario(data);
        this.populateDialogFilters(data);
      });
    this.spinner.spinnerIsActive(false);
  }

  populateInventario(data) {
    console.log(data);
  }

  populateDialogFilters(data) {
    const template = document.querySelector("#template-dialog-filters");
    const wrapper = document.querySelector(".js-filters-dialog-wrapper");
    let dataArray = [];

    for (let i = 0; i <= data.length - 1; i++) {
      dataArray.push(data[i].tipo);
    }

    let dataArrayFiltered = dataArray.filter(
      (element, index) => dataArray.indexOf(element) === index
    );

    for (let i = 0; i <= dataArrayFiltered.length - 1; i++) {
      const clone = template.content.cloneNode(true);
      const label = clone.querySelector(".js-filter-label");

      label.setAttribute("for", dataArrayFiltered[i].toLowerCase());
      label.innerHTML = dataArrayFiltered[i];

      clone
        .querySelector(".js-filter-checkbox")
        .setAttribute("id", dataArrayFiltered[i].toLowerCase());

      wrapper.appendChild(clone);
    }
  }
}

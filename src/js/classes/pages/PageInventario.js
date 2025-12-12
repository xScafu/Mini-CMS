import "../../../scss/main.scss";
import { LoadingSpinner } from "../components/LoadingSpinner";

export class PageInventario {
  constructor() {
    this.spinner = new LoadingSpinner();
    this.invetario = [];
    this.filterArray = [];
  }

  init() {
    this.fetchInventario();
  }

  fetchInventario() {
    this.spinner.spinnerIsActive(true);
    fetch("http://localhost:3000/prodotti")
      .then((res) => res.json())
      .then((data) => {
        this.invetario = data;
        this.populateDialogFilters(data);
        this.populateInventario(data);
        this.setFilterArray();
      });
    this.spinner.spinnerIsActive(false);
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

  setFilterArray() {
    const filters = document.querySelectorAll(".js-filter-checkbox");
    let filterArray = this.filterArray;

    for (let i = 0; i <= filters.length - 1; i++) {
      let filter = filters[i];
      filter.addEventListener("change", (input) => {
        let filterId = input.target.getAttribute("id");

        if (filterArray.includes(filterId)) {
          for (let i = 0; i <= filterArray.length; i++) {
            let element = filterArray[i];
            let index;
            if (element === filterId) {
              index = filterArray.indexOf(element);
              filterArray.splice(index, 1);
            }
          }
        } else {
          filterArray.push(filterId);
        }

        this.applyFilters();
      });
    }
  }

  applyFilters() {
    let filteredData;

    if (this.filterArray.length === 0) {
      filteredData = this.invetario;
    } else {
      filteredData = this.invetario.filter((item) =>
        this.filterArray.includes(item.tipo.toLowerCase())
      );
    }
    this.populateInventario(filteredData);
  }

  populateInventario(data) {
    const template = document.querySelector("#template-table-body");

    const wrapper = document.querySelector(".js-table-body");
    wrapper.innerHTML = "";

    for (let i = 0; i <= data.length - 1; i++) {
      const clone = template.content.cloneNode(true);
      clone.querySelector(".js-id").innerHTML = data[i].id;
      clone.querySelector(".js-nome").innerHTML = data[i].nome;
      clone.querySelector(".js-genere").innerHTML = data[i].tipo;
      wrapper.appendChild(clone);
    }
  }
}

import "../../../scss/main.scss";
import { LoadingSpinner } from "../components/LoadingSpinner";

export class PageInventario {
  constructor() {
    this.spinner = new LoadingSpinner();
    this.invetario = [];
    this.sortProductsArray = [];
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
        this.sortType();
        this.sortName();
        this.searchFilter();
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

    //Aggiunge a dataArrayFiltered la prima "occorrenza" degli elementi ciclati con filter()
    //Alternativa per array di grandi dimensioni: Set
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

  sortType() {
    const filtersCheckbox = document.querySelectorAll(".js-filter-checkbox");

    let filterArray = [];
    for (let i = 0; i <= filtersCheckbox.length - 1; i++) {
      let filter = filtersCheckbox[i];
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
          filterArray.push(filterId.toLowerCase());
        }
        this.setSortType(filterArray);
      });
    }
  }

  setSortType(filterArray) {
    console.log(filterArray);

    let filteredProducts = [];

    for (let i = 0; i <= filterArray.length - 1; i++) {
      for (let x = 0; x <= this.invetario.length - 1; x++) {
        if (filterArray[i] === this.invetario[x].tipo.toLowerCase()) {
          filteredProducts.push(this.invetario[x]);
        }
      }
    }
    this.sortProductsArray = filteredProducts;
    this.applyFilters();
  }

  sortName() {
    const filterDescendance = document.querySelector(".js-alphabetical-desc");
    const filterAscendance = document.querySelector(".js-alphabetical-asc");

    filterDescendance.addEventListener("change", () =>
      this.setDescendance(filterDescendance, filterAscendance)
    );
    filterAscendance.addEventListener("change", () =>
      this.setAscendance(filterAscendance, filterDescendance)
    );
  }

  setDescendance(filterDescendance, filterAscendance) {
    let productsArray = [];
    let productsArraySorted = [];

    if (this.sortProductsArray.length === 0) {
      productsArray = this.invetario;
    } else {
      productsArray = this.sortProductsArray;
    }
    if (filterDescendance.checked) {
      filterAscendance.checked = false;
      productsArraySorted = productsArray.sort(
        (o1, o2) => o1.nome.localeCompare(o2.nome) //Metodo di string che restituisce un valore numerico in base se questa stringa viene prima, dopo o uguale alla stringa passata in argomento.
      );

      this.applyFilters();
    } else {
      productsArraySorted = productsArray.sort((o1, o2) => o1.id - o2.id);
      this.applyFilters();
    }
  }

  setAscendance(filterAscendance, filterDescendance) {
    let productsArray = [];
    let productsArraySorted = [];

    if (this.sortProductsArray.length === 0) {
      productsArray = this.invetario;
    } else {
      productsArray = this.sortProductsArray;
    }
    if (filterAscendance.checked) {
      filterDescendance.checked = false;
      productsArraySorted = productsArray.sort((o1, o2) =>
        o2.nome.localeCompare(o1.nome)
      );

      this.applyFilters();
    } else {
      productsArraySorted = productsArray.sort((o1, o2) => o1.id - o2.id);
      this.applyFilters();
    }
  }

  searchFilter() {
    const searchInput = document.querySelector(".js-search-filter");
    searchInput.addEventListener("change", () =>
      this.setSearchFilter(searchInput)
    );
  }

  setSearchFilter(searchInput) {
    let searchInputValue = searchInput.value;
    let productsArray = [];
    let productsFilteredArray = [];

    if (this.sortProductsArray.length > 0) {
      productsArray = [...this.sortProductsArray];
    } else {
      productsArray = this.invetario;
    }

    console.log(searchInputValue);

    for (let i = 0; i <= productsArray.length - 1; i++) {
      if (
        productsArray[i].nome
          .toLowerCase()
          .includes(searchInputValue.toLowerCase())
      ) {
        productsFilteredArray.push(productsArray[i]);
        console.log(productsFilteredArray);
      }
    }
    this.sortProductsArray = productsFilteredArray;
    this.applyFilters();
  }

  applyFilters() {
    let filteredData = [];

    if (this.sortProductsArray.length === 0) {
      filteredData = this.invetario;
    } else {
      filteredData = this.sortProductsArray;
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

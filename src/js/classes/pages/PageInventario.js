import { CodeSquare } from "lucide";
import "../../../scss/main.scss";
import { LoadingSpinner } from "../components/LoadingSpinner";

export class PageInventario {
  constructor() {
    this.spinner = new LoadingSpinner();
    this.invetario = [];
    this.sortProductsArray = [];
    this.searchingArray = [];
  }

  init() {
    this.fetchInventario();
    this.addProduct();
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
        this.removeProduct();
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
      productsArraySorted = productsArray.sort((o1, o2) => o1.index - o2.index);
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
      productsArraySorted = productsArray.sort((o1, o2) => o1.index - o2.index);
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
      productsArray = this.sortProductsArray;
    } else {
      productsArray = this.invetario;
    }

    for (let i = 0; i <= productsArray.length - 1; i++) {
      if (
        productsArray[i].nome
          .toLowerCase()
          .includes(searchInputValue.toLowerCase())
      ) {
        productsFilteredArray.push(productsArray[i]);
        console.log(productsFilteredArray);
        this.searchingArray = productsFilteredArray;
      }
      if (searchInputValue.length === 0) {
        this.searchingArray = [];
      }
    }
    this.applyFilters();
  }

  applyFilters() {
    let filteredData = [];
    console.log(this.sortProductsArray, this.searchingArray);

    if (
      this.sortProductsArray.length === 0 &&
      this.searchingArray.length === 0
    ) {
      filteredData = this.invetario;
    } else if (this.searchingArray.length > 0) {
      filteredData = this.searchingArray;
    } else {
      filteredData = this.sortProductsArray;
    }
    this.populateInventario(filteredData);
  }

  addProduct() {
    const addProductCta = document.querySelector(".js-add-product");
    addProductCta.addEventListener("click", () => this.populateAddModal());
  }

  populateAddModal() {
    const template = document.querySelector("#template-modal-form");
    const wrapper = document.querySelector(".js-modal-add-content");
    const modalTitle = document.querySelector(".js-modal-add-header-title");

    wrapper.innerHTML = "";
    modalTitle.innerHTML = "Aggiungi";

    const clone = template.content.cloneNode(true);

    clone.querySelector(".js-form-description").innerHTML =
      "<p>Inserisci i dati relativi al nuovo prodotto. <br> Tutti i campi sono obbligatori. </p>";
    clone.querySelector(".js-nomeProdotto-label").innerHTML = "Nome";
    clone.querySelector(".js-tipoProdotto-label").innerHTML = "Tipo";
    clone.querySelector(".js-prezzoProdotto-label").innerHTML = "Prezzo";
    clone.querySelector(".js-quantitaProdotto-label").innerHTML = "Quantita";
    clone.querySelector(".js-costoProdotto-label").innerHTML = "Costo";
    clone.querySelector(".js-dataAcquistoProdotto-label").innerHTML =
      "Data di acquisto";
    clone.querySelector(".js-dataSpecialeProdotto-label").innerHTML =
      "Data speciale";

    wrapper.appendChild(clone);
    this.setAddProduct();
  }

  setAddProduct() {
    const acceptBtn = document.querySelector(".js-btn-accept");

    acceptBtn.addEventListener("click", (event) => this.checkInputs(event));
  }

  checkInputs(event) {
    event.preventDefault();
    const inputs = document.querySelectorAll(".js-input");
    const labels = document.querySelectorAll(".js-labels");
    let dataObject = {};

    for (let i = 0; i <= inputs.length - 1; i++) {
      let isCompiled = inputs[i].value ? true : false;

      if (!isCompiled) {
        inputs[i].classList.add("error");
        labels[i].classList.add("error");
      } else {
        inputs[i].classList.remove("error");
        labels[i].classList.remove("error");
        let dataAttribute = inputs[i].getAttribute("name");
        let dataValue = inputs[i].value;

        dataObject[dataAttribute] = dataValue;
      }
    }

    if (Object.keys(dataObject).length !== inputs.length) {
      console.log("errore, non tutti i campi sono stati validati");
      return;
    } else {
      this.handleSubmit(dataObject);
    }
  }

  handleSubmit(dataObject) {
    dataObject["index"] = this.invetario.length + 1;
    console.log(dataObject);

    fetch("http://localhost:3000/prodotti", {
      method: "POST",
      body: JSON.stringify(dataObject),
    })
      .then((response) => response.json())
      .then(() => this.fetchInventario());
  }

  removeProduct() {
    const removeBtn = document.querySelectorAll(".js-remove-product-btn");

    for (let i = 0; i <= removeBtn.length - 1; i++) {
      const id =
        removeBtn[i].parentElement.parentElement.getAttribute("data-id");

      removeBtn[i].addEventListener("click", () =>
        this.populateRemoveModal(id)
      );
    }
  }

  populateRemoveModal(id) {
    const template = document.querySelector("#template-modal-form");
    const wrapper = document.querySelector(".js-modal-remove-content");
    const modalTitle = document.querySelector(".js-modal-remove-header-title");
    const inventario = this.invetario;
    let getProduct = {};

    wrapper.innerHTML = "";
    modalTitle.innerHTML = "Rimuovi";

    const clone = template.content.cloneNode(true);
    clone.querySelector(".js-form-description").innerHTML =
      "<p>Sei sicuro di voler rimuovere questo prodotto?</p>";

    for (let i = 0; i <= inventario.length - 1; i++) {
      if (id === inventario[i].id) {
        getProduct = inventario[i];
      }
    }

    const nomeProdotto = clone.querySelector(".js-nomeProdotto");
    const tipoProdotto = clone.querySelector(".js-tipoProdotto");
    const prezzoProdotto = clone.querySelector(".js-prezzoProdotto");
    const quantitaProdotto = clone.querySelector(".js-quantitaProdotto");
    const costoProdotto = clone.querySelector(".js-costoProdotto");
    const dataAcquistoProdotto = clone.querySelector(
      ".js-dataAcquistoProdotto"
    );
    const dataSpecialeProdotto = clone.querySelector(
      ".js-dataSpecialeProdotto"
    );

    nomeProdotto.value = getProduct.nome;
    tipoProdotto.value = getProduct.tipo;
    prezzoProdotto.value = getProduct.prezzo;
    quantitaProdotto.value = getProduct.quantita;
    costoProdotto.value = getProduct.costo;
    dataAcquistoProdotto.value = getProduct.dataAcquisto;
    if (tipoProdotto === "Alimentare") {
      clone.querySelector(".js-dataSpeciale").classList.remove("hidden");
      dataSpecialeProdotto.value = getProduct.dataScadenza;
    } else {
      clone.querySelector(".js-dataSpeciale").classList.add("hidden");
    }

    nomeProdotto.setAttribute("readonly", "");
    tipoProdotto.setAttribute("readonly", "");
    prezzoProdotto.setAttribute("readonly", "");
    quantitaProdotto.setAttribute("readonly", "");
    costoProdotto.setAttribute("readonly", "");
    dataAcquistoProdotto.setAttribute("readonly", "");
    dataSpecialeProdotto.setAttribute("readonly", "");

    clone.querySelector(".js-nomeProdotto-label").innerHTML = "Nome";
    clone.querySelector(".js-tipoProdotto-label").innerHTML = "Tipo";
    clone.querySelector(".js-prezzoProdotto-label").innerHTML = "Prezzo";
    clone.querySelector(".js-quantitaProdotto-label").innerHTML = "Quantita";
    clone.querySelector(".js-costoProdotto-label").innerHTML = "Costo";
    clone.querySelector(".js-dataAcquistoProdotto-label").innerHTML =
      "Data di acquisto";
    clone.querySelector(".js-dataSpecialeProdotto-label").innerHTML =
      "Data speciale";

    wrapper.appendChild(clone);

    const acceptBtn = document.querySelector(".js-btn-accept");

    acceptBtn.addEventListener("click", () =>
      this.handleRemoveProduct(getProduct)
    );
  }

  handleRemoveProduct(getProduct) {
    this.spinner.spinnerIsActive(true);

    fetch(`http://localhost:3000/prodotti/${getProduct.id}`, {
      method: "DELETE",
    })
      .then(() => this.fetchInventario())
      .then(this.spinner.spinnerIsActive(false));
  }

  populateInventario(data) {
    const template = document.querySelector("#template-table-body");

    const wrapper = document.querySelector(".js-table-body");
    wrapper.innerHTML = "";

    for (let i = 0; i <= data.length - 1; i++) {
      const clone = template.content.cloneNode(true);
      clone.querySelector(".js-product").setAttribute("data-id", data[i].id);
      clone.querySelector(".js-index").innerHTML = data[i].index;
      clone.querySelector(".js-nome").innerHTML = data[i].nome;
      clone.querySelector(".js-genere").innerHTML = data[i].tipo;
      clone.querySelector(".js-table-btns");
      wrapper.appendChild(clone);
    }
  }
}

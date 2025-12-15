import { LoadingSpinner } from "../components/LoadingSpinner";

export class PageNegozio {
  constructor() {
    this.spinner = new LoadingSpinner();
  }

  init() {
    console.log("page negozio");
    this.spinner.spinnerIsActive(false);
  }
}

import { LoadingSpinner } from "../components/LoadingSpinner";

export class PageBilancio {
  constructor() {
    this.spinner = new LoadingSpinner();
  }

  init() {
    console.log("page bilancio");
    this.spinner.spinnerIsActive(false);
  }
}

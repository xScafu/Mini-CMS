import { LoadingSpinner } from "../components/LoadingSpinner";

export class PageImpostazioni {
  constructor() {
    this.spinner = new LoadingSpinner();
  }

  init() {
    console.log("page impostazioni");
    this.spinner.spinnerIsActive(false);
  }
}

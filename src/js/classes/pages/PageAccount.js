import { LoadingSpinner } from "../components/LoadingSpinner";

export class PageAccount {
  constructor() {
    this.spinner = new LoadingSpinner();
  }
  init() {
    console.log("page account");
    this.spinner.spinnerIsActive(false);
  }
}

export class LoadingSpinner {
  constructor() {}

  spinnerIsActive(isActive) {
    const spinner = document.querySelector(".js-loader");
    if (isActive === true) {
      spinner.showModal();
    } else {
      spinner.classList.add("hidden");
      spinner.close();
    }
  }
}

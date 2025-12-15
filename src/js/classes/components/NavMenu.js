export class NavMenu {
  constructor() {}

  init() {
    this.changePath();
  }

  resetPath() {
    window.location.assign("/");
  }

  newPath(pathName) {
    window.location.assign(`src/pages/${pathName}`);
  }

  changePath() {
    const link = document.querySelectorAll(".js-navigation-link");

    link.forEach((element) => {
      element.addEventListener("click", () => {
        this.resetPath();
        let path = link.getAttribute("href");
        console.log(path);
        this.newPath(path);
      });
    });
  }
}

const EXPAND_SVG = `
  <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="expand-alt" class="svg-inline--fa fa-expand-alt fa-w-14" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path fill="currentColor" d="M212.686 315.314L120 408l32.922 31.029c15.12 15.12 4.412 40.971-16.97 40.971h-112C10.697 480 0 469.255 0 456V344c0-21.382 25.803-32.09 40.922-16.971L72 360l92.686-92.686c6.248-6.248 16.379-6.248 22.627 0l25.373 25.373c6.249 6.248 6.249 16.378 0 22.627zm22.628-118.628L328 104l-32.922-31.029C279.958 57.851 290.666 32 312.048 32h112C437.303 32 448 42.745 448 56v112c0 21.382-25.803 32.09-40.922 16.971L376 152l-92.686 92.686c-6.248 6.248-16.379 6.248-22.627 0l-25.373-25.373c-6.249-6.248-6.249-16.378 0-22.627z"></path></svg>
`;
const COMPRESS_SVG = `
  <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="compress-alt" class="svg-inline--fa fa-compress-alt fa-w-14" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path fill="currentColor" d="M4.686 427.314L104 328l-32.922-31.029C55.958 281.851 66.666 256 88.048 256h112C213.303 256 224 266.745 224 280v112c0 21.382-25.803 32.09-40.922 16.971L152 376l-99.314 99.314c-6.248 6.248-16.379 6.248-22.627 0L4.686 449.941c-6.248-6.248-6.248-16.379 0-22.627zM443.314 84.686L344 184l32.922 31.029c15.12 15.12 4.412 40.971-16.97 40.971h-112C234.697 256 224 245.255 224 232V120c0-21.382 25.803-32.09 40.922-16.971L296 136l99.314-99.314c6.248-6.248 16.379-6.248 22.627 0l25.373 25.373c6.248 6.248 6.248 16.379 0 22.627z"></path></svg>
`;

const strategies = {};

strategies.gitlab = {
  name: "gitlab",
  anchorSelector: "h3.board-title",
  buttonInnerHtml: `
      <button 
        title="Expand list" 
        class="btn issue-count-badge-add-button no-drag btn-default btn-md btn-icon gl-button has-tooltip ml-1" 
        type="button" 
        data-placement="bottom" 
      >
        <i aria-hidden="true" data-hidden="true" class="fa fa-expand" style="width: 16px; height: 16px;"></i>
      </button>
`,
  expanderSelector: "button",
  insertExpander: (anchor, expander) => anchor.appendChild(expander),
  getBoard: (button) => button.parentNode.parentNode.parentNode.parentNode,
  getCardList: (board) => $("ul", board),
  getIcon: (button) => $("i", button),
  isCompressed: (icon) => icon.classList.contains("fa-compress"),
  cardMinWidth: "374px",
  expandClass: "fa-expand",
  compressClass: "fa-compress",
};

strategies.github = {
  name: "github",
  anchorSelector: "div.hide-sm.position-relative.p-sm-2",
  buttonInnerHtml: `
  <button type="button">
    <svg class="octicon octicon-plus" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true">
      <path fill-rule="evenodd" d="M8 2a.75.75 0 01.75.75v4.5h4.5a.75.75 0 010 1.5h-4.5v4.5a.75.75 0 01-1.5 0v-4.5h-4.5a.75.75 0 010-1.5h4.5v-4.5A.75.75 0 018 2z"></path>
    </svg>
  </button>
`,
  expanderSelector: "button",
  insertExpander: (anchor, expander) => anchor.appendChild(expander),
  getBoard: (button) => button.parentNode.parentNode.parentNode,
  getCardList: (board) => $(".js-project-column-cards", board),
  getIcon: (button) => $("svg", button),
  isCompressed: (icon) => icon.classList.contains("octicon-plus"),
  cardMinWidth: "335px",
  expandClass: "octicon-plus",
  compressClass: "octicon-minus",
};

strategies.trello = {
  name: "trello",
  anchorSelector:
    ".js-card-templates-button.card-templates-button-container.dark-background-hover",
  buttonInnerHtml: `
   <div class="js-card-templates-button card-templates-button-container dark-background-hover expander-extension">
    <a class="_2arBFfwXVxA0AM" role="button" href="#">
      <span class="icon-sm icon-toExpand dark-background-hover">
        ${EXPAND_SVG}
      </span>
    </a>
  </div>
`,
  expanderSelector: ".expander-extension",
  insertExpander: (anchor, expander) =>
    anchor.parentNode.insertBefore(expander, anchor),
  getBoard: (button) => button.parentNode.parentNode.parentNode,
  getCardList: (board) => $(".list-cards", board),
  getIcon: (button) => $("span", button),
  isCompressed: (icon) => icon.classList.contains("icon-remove"),
  cardMinWidth: "248px",
  expandClass: "icon-toExpand",
  compressClass: "icon-toCompress",
};

let strategy;
switch (location.host) {
  case "gitlab.com":
    strategy = strategies.gitlab;
    break;
  case "github.com":
    strategy = strategies.github;
    break;
  case "trello.com":
    strategy = strategies.trello;
    break;
  default:
    strategy = false;
}

function $(seletor, element = document) {
  return element.querySelector(seletor);
}

function $$(seletor, element = document) {
  return element.querySelectorAll(seletor);
}

window.onload = () => {
  if (!strategy) {
    return;
  }
  if (strategy.name === "github") {
    $(".project-columns-container").setAttribute(
      "style",
      `
    overflow-x: unset!important;
  `
    );
    $(".js-project-columns-container").setAttribute(
      "style",
      `
    width: auto!important;
  `
    );
  }

  let anchors = $$(strategy.anchorSelector);

  anchors.forEach((anchor, i) => {
    let canvas = document.createElement("div");
    canvas.innerHTML = strategy.buttonInnerHtml;
    let expander = $(strategy.expanderSelector, canvas);

    strategy.insertExpander(anchor, expander);

    expander.onclick = function () {
      let board = strategy.getBoard(this);
      let cardList = strategy.getCardList(board);
      let icon = strategy.getIcon(this);

      if (strategy.isCompressed(icon)) {
        // compress
        this.setAttribute("title", "Expand list");

        board.setAttribute("style", "");

        cardList.style.display = "block";
        Array.from(cardList.children).forEach((card) => {
          card.setAttribute("style", ``);
        });

        icon.innerHTML = EXPAND_SVG;
      } else {
        // expand
        this.setAttribute("title", "Compress list");

        board.setAttribute(
          "style",
          `
          width: 100vw;
          max-width: unset;
          flex: 1 1 100%!important;
        `
        );

        cardList.style.display = "grid";
        cardList.style[
          "grid-template-columns"
        ] = `repeat(auto-fill, minmax(${strategy.cardMinWidth}, 1fr))`;
        cardList.style["grid-auto-rows"] = "min-content";
        cardList.style["grid-gap"] = "4px";

        Array.from(cardList.children).forEach((card) => {
          card.setAttribute("style", `margin: 0px!important;`);
        });

        cardList.scrollIntoView({
          behavior: "smooth",
          block: "start",
          inline: "center",
        });
      }

      icon.classList.toggle(strategy.expandClass);
      icon.classList.toggle(strategy.compressClass);

      icon.innerHTML = COMPRESS_SVG;
    };
  });
};

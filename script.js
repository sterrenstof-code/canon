/* Toggle between showing and hiding the navigation menu links when the user clicks on the hamburger menu / bar icon */
// function myFunction() {
//     var x = document.getElementById("myLinks");
//     if (x.style.display === "block") {
//       x.style.display = "none";
//     } else {
//       x.style.display = "block";
//     }
//   }

// get random item

async function getRandomPiece() {
  const result = await searchBy("a", true);
  const random = Math.floor(Math.random() * result.total);
  const randomPieceID = result.objectIDs[random];
  const randomPiece = await getDataById(randomPieceID);
  return randomPiece;
}

/* get data */

const getData = async () => {
  const response = await fetch(
    "https://collectionapi.metmuseum.org/public/collection/v1/objects"
  );
  const respData = await response.json();
};

/* get data by id */

const getDataById = async (id) => {
  const resp = await fetch(
    `https://collectionapi.metmuseum.org/public/collection/v1/objects/${id}`
  );
  const data = await resp.json();
  return data;
};

/* get data by searching */

const searchBy = async (term, isHighlight = true) => {
  const resp = await fetch(
    `https://collectionapi.metmuseum.org/public/collection/v1/search?isHighlight=${isHighlight}&q=${term}`
  );
  const data = await resp.json();
  return data;
};

// create search section that displays underneath it

document.querySelector("#search").addEventListener("click", () => {
  const searchTerm = document.querySelector("#search-term");
  const userInput = searchTerm.value;
  const userQuantity = document.querySelector("#quantity");
  const inputQuantity = userQuantity.value;
  const isHighlightBtn = document.querySelector("#isHighlightchecked");
  const isHighlightCheck = isHighlightBtn.checked;
  const data = searchUserInput(userInput, isHighlightCheck, inputQuantity);
});

const searchUserInput = async (userInput, checked, quantity) => {
  const data = await searchBy(userInput, checked);

  const searchItemSection = document.createElement("div");
  searchItemSection.classList.add("popular-section");
  searchItemSection.innerHTML = ` <h2 class="h2">Search results for "${userInput}"</h2>`;

  if (data.objectIDs) {
    const awaitedQ = waitForQ(quantity, data);
    for (let i = 0; i < awaitedQ; i++) {
      const result = await getDataById(data.objectIDs[i]);
      searchItemSection.innerHTML += `
  <div class="horizontal-line"></div>
  <div class="search-result-container">

    <div class="search-result-container-left">
      <div>
      <h1 class="title-section-first">${result.title}</h1>
      <p class="">-${result.objectDate}</p>
      </div>
      <h1>${i + 1}/${quantity}</h1>
      <p>${result.artistDisplayName}</p>
      <p>${result.artistDisplayBio}</p>
      <p>${result.artistEndDate}</p>
      <p>${result.medium}</p>
      <p>${result.repository}</p>
    </div>

    <div class="search-result-container-right">
      <a href="${result.artistWikidata_URL}">
      <img src="${result.primaryImage}" alt="" />
      </a>
    </div>
  </div>
  <div class="horizontal-line"></div>
  `;
    }
  } else {
    searchItemSection.innerHTML = ` <h2 class="h2">There are no search results for "${userInput}"</h2>`;
  }
  const searchResultsDOM = document.querySelector(".search-results");
  searchResultsDOM.appendChild(searchItemSection);
};

const waitForQ = (quantity, data) => {
  if (quantity < data.objectIDs.length) {
    const showQ = quantity;
    return showQ;
  } else {
    const showQ = data.objectIDs.length;
    return showQ;
  }
};

/* give  */

async function addArtPiece(randomPiece) {
  const pieceIntro = await getRandomPiece();
  const vermeerIntro = await searchBy("vermeer", true);
  const vermeerData = await getDataById(vermeerIntro.objectIDs[0]);

  const introImageSection = document.createElement("div");
  introImageSection.classList.add("intro-section");

  /* change vermeerIntro to Intro */

  introImageSection.innerHTML = `
    <h1 class="h1">The Metro&shy;politan Museum of Art</h1>
        <p>circa 1900 - England</p>
        <div class="intro-image-container">
        <a href="#search-results">
        <img
          class="intro-image"
          src="${pieceIntro.primaryImage}"
          alt=""
        />  
        </a>
        <i class="fas fa-heart"></i>
        </div>
        <p class="main-title-info">
          <a href="#">&dashv; ${pieceIntro.title} - ${pieceIntro.objectDate}</a>
        </p>
    `;
  const mainTitle = document.querySelector(".main-title");
  mainTitle.appendChild(introImageSection);

  /* fill in vermeer search */

  const vermeerImageSection = document.createElement("div");
  vermeerImageSection.classList.add("info-image-container");
  vermeerImageSection.innerHTML = `
    <img class="info-image" src="${vermeerData.primaryImageSmall}" alt="" />
    <i class="fas fa-heart"></i>
    `;
  const vermeerTitle = document.querySelector(".info-image-container-pin");
  vermeerTitle.appendChild(vermeerImageSection);

  /* fill in carousel */

  const carouselExhibitionList = document.createElement("ul");
  carouselExhibitionList.classList.add("exhibition-carousel-list");

  for (let i = 0; i < 7; i++) {
    const result = await getDataById(vermeerIntro.objectIDs[i]);
    /* for every item, fill in this */
    carouselExhibitionList.innerHTML += `
    <li>
    <div class="carousel-item">
      <p>${i}</p>
      <a href="${result.objectURL}" target="_blank">
      <img src="${result.primaryImageSmall}" alt="" />
      <i class="fas fa-heart"></i>
      </a>
      <p>${result.repository}</p>
      <p>${result.title}</p>
      <p>${result.medium}</p>
    </div>
  </li>
    `;
  }
  const carouselExhibition = document.querySelector(".exhibition-carousel");
  carouselExhibition.appendChild(carouselExhibitionList);
}

/* init */
addArtPiece();
// searchUserInput("sandro botticelli", true, 1);


const searchTerm = document.querySelector("#search-term");
const searchBtn = document.querySelector("#search");

searchTerm.addEventListener("keyup", function(event) {
  if (event.keyCode === 13) {
   event.preventDefault();
   searchBtn.click();
  }
});

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

searchBtn.addEventListener("click", () => {
  const userInput = searchTerm.value;
  const userQuantity = document.querySelector("#quantity");
  const inputQuantity = userQuantity.value;
  const isHighlightBtn = document.querySelector("#isHighlightchecked");
  const isHighlightCheck = isHighlightBtn.checked;
  const data = searchUserInput(userInput, isHighlightCheck, inputQuantity);
});

const searchUserInput = async (userInput, checked, quantity) => {
  const data = await searchBy(userInput, checked);
  const searchResultsDOM = document.querySelector(".search-results");
  const searchItemSection = document.createElement("div");
  searchItemSection.classList.add("popular-section");
  searchResultsDOM.innerHTML = ``;
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
      <a href="${result.artistWikidata_URL}" target="_blank">
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

async function addArtPiece(randomPiece) {
  const vermeerIntro = await searchBy("vermeer", true);
  const random = Math.floor(Math.random() * vermeerIntro.objectIDs.length);
  const vermeerData = await getDataById(vermeerIntro.objectIDs[random]);
  const bgImage = document.querySelector(".background-img");
  bgImage.style.backgroundImage = `url('${vermeerData.primaryImage}')`;
  const titleSection = document.querySelector(".title-section");
  const titleSectionTitle = document.createElement("div");
  titleSectionTitle.classList.add("title-section-title");
  titleSectionTitle.innerHTML = `
    Discover
    ${vermeerData.artistDisplayName}
  `;

  titleSection.appendChild(titleSectionTitle);

  const pieceIntro = await getRandomPiece();
  const introImageSection = document.createElement("div");
  introImageSection.classList.add("intro-section");

  /* change vermeerIntro to Intro */

  introImageSection.innerHTML = `
    <h1 class="h1">The Metro&shy;politan Museum of Art</h1>
        <p>circa 1900 - England</p>
        <div class="intro-image-container">
        <a href="${pieceIntro.objectURL}" target="_blank">
        <img
          class="intro-image"
          src="${pieceIntro.primaryImage}"
          alt=""
        />  
        </a>

        </div>
        <p class="main-title-info">
          <a href="${pieceIntro.artistWikidata_URL}" target="_blank">&dashv; ${pieceIntro.title} - ${pieceIntro.objectDate}</a>
        </p>
    `; 
  const mainTitle = document.querySelector(".main-title");
  mainTitle.appendChild(introImageSection);

  /* fill in vermeer search */

  const vermeerImageSection = document.createElement("div");
  vermeerImageSection.classList.add("info-image-container");
  vermeerImageSection.innerHTML = `
    <img class="info-image" src="${vermeerData.primaryImageSmall}" alt="" />
    `;
  const vermeerTitle = document.querySelector(".info-image-container-pin");
  vermeerTitle.appendChild(vermeerImageSection);

  /* fill in carousel */

  fillCarousel(vermeerIntro);
}

const carouselExhibition = document.querySelector(".exhibition-carousel");

const fillCarousel = async (data) => {
  const carouselExhibitionList = document.createElement("ul");
  carouselExhibitionList.classList.add("exhibition-carousel-list");
  for (let i = 0; i < 10; i++) {
    const result = await getDataById(data.objectIDs[i]);
    /* for every item, fill in this */
    carouselExhibitionList.innerHTML += `
    <li>
    <div class="carousel-item">
      <p>${i+1}</p>
      <div class="carousel-item-image-container">
      
      <img src="${result.primaryImageSmall}" alt="" />
     
      <i class="fas fa-heart ${data.objectIDs[i]}"></i>
      </div>
      <a href="${result.objectURL}" target="_blank">
      <p>${result.title}</p>
      </a>
      <p>${result.medium}</p>
      <p>${result.artistDisplayName}</p>     
    </div>
  </li>
    `;
    
  }
  carouselExhibition.appendChild(carouselExhibitionList); 
  fetchFavPieces();
  activeOrInactive(data.objectIDs);
  updateDomHearts();
}

const activeOrInactive = (objectIDs) => {
  const btn = carouselExhibition.querySelectorAll(".fa-heart");
  for(let i = 0; i < btn.length; i++){
    btn[i].addEventListener("click", () => {
      if (btn[i].classList.contains("active")) {
        btn[i].classList.remove("active");
        removePieceLS(objectIDs[i]);
      } else {
        btn[i].classList.add("active");
        addPieceLS(objectIDs[i]);
      }
      fetchFavPieces();
    });
  }
}

const updateDomHearts = () => {
  const allIds = getPieceLS();
  const deleteHeart = document.querySelector(".carousel-item-image-container .fa-heart");
  deleteHeart.classList.remove("active");
  for(id of allIds){
    const deleteHeart = document.querySelector(`.carousel-item-image-container .${CSS.escape(id)}`);
    deleteHeart.classList.add("active");
  }
}

function addPieceLS(pieceId) {
  const set = getPieceLS();
  set.add(pieceId)
  const toArr=Array.from(set)
localStorage.setItem("pieceIds",JSON.stringify(toArr));
}

function removePieceLS(pieceId) {
  const set = getPieceLS();
  set.delete(pieceId)
const toArr=Array.from(set)
localStorage.setItem("pieceIds",JSON.stringify(toArr));
}

function getPieceLS() {
  const pieceIds = JSON.parse(localStorage.getItem("pieceIds"));
  let set = new Set(pieceIds);
  return set === null ? [] : set;
}
const favoListContainer = document.querySelector(".dropdown-content");

async function fetchFavPieces() {
  favoListContainer.innerHTML = "";
  let pieceIdsAwait = getPieceLS();
  const uniquePieceIds = new Set(pieceIdsAwait);
  const pieceIds = Array.from(uniquePieceIds);
  pieceIds.filter((id, index) => { id !== index })
  const arrayLength = pieceIds.length;
  for(let i = 0; i < arrayLength; i++){
      piece = await getDataById(pieceIds[i]);
      addPieceToFavo(piece,pieceIds[i]);
      deleteBtnToHeart(pieceIds[i]);
  }
}

const addPieceToFavo = (piece, pieceId) => {
  const dropdownContentContainer = document.createElement("div");
  dropdownContentContainer.classList.add("dropdown-content-item");
  dropdownContentContainer.innerHTML = ` 
  <div class="favorites-btn-container">
  <a href="${piece.artistWikidata_URL}" target="_blank">
    <img src="${piece.primaryImage}" alt="" />
    </a>
    <div class="favo-info">
      <p>${piece.artistDisplayName}</p>
      <p class="favo-info-cross ${pieceId}">&Cross;</p>
    </div>
  </div>
`
  favoListContainer.appendChild(dropdownContentContainer);
}

const deleteBtnToHeart = (pieceId) => {
  const deleteBtn = document.querySelector(`.favo-info .${CSS.escape(pieceId)}`);
  const deleteHeart = document.querySelector(`.carousel-item-image-container .${CSS.escape(pieceId)}`);
  deleteBtn.addEventListener("click", () => {
    if (deleteHeart.classList.contains("active")) {
      deleteHeart.classList.remove("active");
      removePieceLS(pieceId);
      updateDomHearts();
      fetchFavPieces();
    } 
  })
} 

/* init */
addArtPiece();
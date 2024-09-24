/* AUTOR VICTOR KOGA DATA 24/09/2054 */

// é um objeto de objetos onde guarda o estado de memoria daquela caracterisca
const state ={
  score:{
    playScore: 0,
    computerScore: 0,
    scoreBox: document.getElementById("score_points"),
  },
  //são as imagens
  cardSprites: {
    avatar: document.getElementById("card-image"),
    name: document.getElementById("card-name"),
    type: document.getElementById("card-type"),
  },
  fieldCards:{
    player: document.getElementById("player-field-card"),
    computer: document.getElementById("computer-field-card"),
  },
  actions: {
  button: document.getElementById("next-duel"),
  }
}
// cria a varial do lado dos jogadores jogador vs computador
const playersSides = {
  player1: "player-cards",
  computer: "computer-cards",
}
const pathImages = "assets/icons/"
// criando as cartas atribuindo valores para elas
const cardData = [
  {
    id: 0,
    name: "Blue Eyes White Dragon",
    type: "Paper",
    img: `${pathImages}dragon.png`,
    WinOf:[1],
    LoseOf:[2],
  },
  {
    id: 1,
    name: "Dark Magician",
    type: "Rock",
    img: `${pathImages}magician.png`,
    WinOf:[2],
    LoseOf:[0],
  },
  {
    id: 2,
    name: "Exodia",
    type: "Scissors",
    img: `${pathImages}exodia.png`,
    WinOf:[0],
    LoseOf:[1],
  },
]
// função para gerar id da carta aleatorio
async function getRandomCardId() {
  const randomIndex = Math.floor(Math.random() * cardData.length) 
  return cardData[randomIndex].id
}
// função para gerar imagem da carta
async function createCardImage(randomIdCard, fieldSide) {
  // cria um elemento img para a carta
  const cardImage = document.createElement("img")
    // cria um elemento img setando o atributo e atribuindo os valor
    cardImage.setAttribute("height", "100px")
    // cria um elemento img setando o caminho da imagem
    cardImage.setAttribute("src", `${pathImages}card-back.png`)
    // atribui um ID aleatorio no data-id
    cardImage.setAttribute("data-id", randomIdCard)  
    // adiciona o card numa lista  
    cardImage.classList.add("card")

  if (fieldSide === playersSides.player1) {
    // adiciona o evento de mouseover
    cardImage.addEventListener("mouseover", () => {
      drawSelectCard(randomIdCard)
    })
    // adiciona o evento de click
    cardImage.addEventListener("click", () => {
      setCardsField(cardImage.getAttribute("data-id"))
    })    
  } 
  // retorna a imagem da carta
  return cardImage
}

async function setCardsField(cardId,) {
  // remove todas as cartas antes
  await removeAllCardsImages()
  // sortea um carta aleatorio
  let computerCardId = await getRandomCardId()
  // muda pra display block 
  showHiddenCardFieldsImages(true)
  await hiddenCardDetails()
  await drawCardInFields(cardId, computerCardId)
  // checka o resultado comparando resultado com a outroa
  let duelResults = await checkDuelResults(cardId, computerCardId)
  // atualizar os pontos
  await updateScore()
  // mostra o resultado no botão GANHOU OU PERDEU
  await drawButton(duelResults)
}
async function drawCardInFields(cardId, computerCardId){ 
  // seta as imagem
  state.fieldCards.player.src = cardData[cardId].img
  state.fieldCards.computer.src = cardData[computerCardId].img  
}
async function showHiddenCardFieldsImages(value) {
  if (value === true) {
    state.fieldCards.player.style.display = "block"
    state.fieldCards.computer.style.display = "block"  
  }

  if (value === false) {
    state.fieldCards.player.style.display = "none"
    state.fieldCards.computer.style.display = "none"    
  }
  
}
async function hiddenCardDetails() {  
  state.cardSprites.avatar.src = ""
  state.cardSprites.name.innerText = ""
  state.cardSprites.type.innerText = ""
  
}
async function drawButton(text) {
  state.actions.button.innerText = text
  state.actions.button.style.display = "block"  
}
async function checkDuelResults(playerCardId, computerCardId) {
  let duelResults = "DRAW"
  let playerCard = cardData[playerCardId]

  if (playerCard.WinOf.includes(computerCardId)) {
    duelResults = "WIN"
    await playAudio(duelResults)
    state.score.playScore++     
  }
  
  if (playerCard.LoseOf.includes(computerCardId)) {
    duelResults = "LOSE"
    await playAudio(duelResults)
    state.score.computerScore++    
  }
  return duelResults
}
async function updateScore() {
  state.score.scoreBox.innerText = `Win: ${state.score.playScore} | Lose: ${state.score.computerScore}`
}
async function resetDuel() {
  state.cardSprites.avatar.src = ""
  state.actions.button.style = "none"
  state.fieldCards.player.style = "none"
  state.fieldCards.computer.style = "none"
  init()
}
async function removeAllCardsImages() {
  // faz um select dentro do documento onde tem o ID COMPUTER-CARD
  let cards = document.querySelector("#computer-cards")
  // remove todas as cartas do computer
  let imgElements = cards.querySelectorAll("img")
  imgElements.forEach((img) => img.remove())

  // faz um select dentro do documento onde tem o ID PLAYER-CARD
  cards = document.querySelector("#player-cards")
  // seleciona todas as imagem
  imgElements = cards.querySelectorAll("img")
  // remove todas as cartas do player
  imgElements.forEach((img) => img.remove())  
}
async function drawSelectCard(index) {
  state.cardSprites.avatar.src = cardData[index].img
  state.cardSprites.name.innerText = cardData[index].name
  state.cardSprites.type.innerText = "Attribute : " + cardData[index].type  
}
async function drawCards(cardNumbers, fieldSide) {{
  for (let i = 0; i < cardNumbers; i++) {
    // espera gerar uma carta aleatorioa
    const randomIdCard = await getRandomCardId()
    // cria a função createcardimage trazendo o id aleatorio e o lado do player
    const cardImage = await createCardImage(randomIdCard, fieldSide)
    // adiciona a carta no campo do player/computador
    document.getElementById(fieldSide).appendChild(cardImage)
  }
}
  
}
async function playAudio(status) {
  const audio = new Audio(`assets/audios/${status}.wav`)
  audio.play()
}
// função inicial sempre vai ser inicializada por primeiro chamando os metodos
function init(){
  showHiddenCardFieldsImages(false)

  drawCards(5, playersSides.player1)
  drawCards(5, playersSides.computer)

  const bgm = document.getElementById('bgm')
  bgm.volume = 0.1  // altera o volume do audio para 50%
  bgm.play()
  
}
init()
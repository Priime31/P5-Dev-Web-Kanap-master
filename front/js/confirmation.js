//stock l'url de la page product dans une variable.
const url = new URL(window.location.href);

//cherche dans l'url l'id du produit puis le stock dans une variable.
const orderId = url.searchParams.get("orderId");

const displayOrderId = document.getElementById("orderId");
displayOrderId.innerText = orderId;

//vide le localStorage.
localStorage.clear();
const url = new URL(window.location.href);
console.log("l'url du site est" + url);

const id = url.searchParams.get("id");
console.log(id);

async function getProductsById() {
    const reponseId = await fetch('http://localhost:3000/api/products/' + id);
    return await reponseId.json();
}

function generateProductsById(product) {
    const color = product.colors;

    const itemImg = document.querySelector(".item__img");
    const itemName = document.querySelector("#title");
    const itemPrice = document.querySelector("#price");
    const itemDescription = document.querySelector("#description");
    const itemColor = document.querySelector("#colors");

    const idImage = document.createElement("img");
    idImage.src = product.imageUrl;
    itemImg.appendChild(idImage);
    itemName.innerText = product.name;
    itemPrice.innerHTML = product.price;
    itemDescription.innerHTML = product.description;

    for (let color of product.colors) {
        const colorOption = document.createElement("option");
        colorOption.innerText = color;
        colorOption.value = color;

        itemColor.appendChild(colorOption);
    }
}

function createOptionElement(value, text = value) {
    const option = document.createElement("option");

    option.innerText = text;
    option.value = value;

    return option;
}

async function startProduct() {
    const product = await getProductsById();
    generateProductsById(product);
}

startProduct();

const addButton = document.querySelector(".item__content__addButton");
addButton.addEventListener("click", function pushCart() {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    console.log(cart);
    let color = document.getElementById("colors").value;
    let quantity = document.getElementById("quantity").value;

    if (color != "--SVP, choisissez une couleur --" && quantity != 0) {
        let cartObject = {
            id: id,
            couleur: color,
            quantité: quantity,
        };

        cart.push(cartObject);

        localStorage.setItem("cart", JSON.stringify(cart));
    }


});






/**
 * mon but maintenant est de vérifier si les values (id / couleurs) selectionnées par le client sont déjà présentes dans le localstorage
 * et si oui, les incrémenter aux précédentes plutôt que les dupliquer.
 * 
 * j'ai besoin de :
 * 
 * - données du localstorage (id / couleurs),
 * - données selectionnées par le client (quantité / couleurs),
 * - d'une boucle qui check les données du panier,
 * - d'une fonction qui ajoute les données renvoyées par le client au panier (si elles sont déjà présentes),
 * - ca se fasse avant le localStorage.setItem,
 */
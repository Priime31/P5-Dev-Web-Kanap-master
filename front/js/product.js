//stock l'url de la page product dans une variable.
const url = new URL(window.location.href);

//cherche dans l'url l'id du produit puis le stock dans une variable.
const id = url.searchParams.get("id");

//récupère dans l'API les données du produit correspondant à l'id de la page au format JSON.
const getProductsById = async () => {
    const answerId = await fetch("http://localhost:3000/api/products/" + id);
    return await answerId.json();
};

//créer du contenu HTML avec les données retournées par l'API.
const generateProducts = (product) => {
    const itemImg = document.querySelector(".item__img");
    const itemName = document.querySelector("#title");
    const itemPrice = document.querySelector("#price");
    const itemDescription = document.querySelector("#description");
    const itemColor = document.querySelector("#colors");

    const idImage = document.createElement("img");
    idImage.src = product.imageUrl;
    itemImg.appendChild(idImage);
    itemName.innerText = product.name;
    itemPrice.innerText = product.price;
    itemDescription.innerText = product.description;

    //créer une balise <option> pour chaque couleur proposée pour le produit.
    for (let color of product.colors) {
        const colorOption = document.createElement("option");
        colorOption.innerText = color;
        colorOption.value = color;

        itemColor.appendChild(colorOption);
    }
};

//stock les données liées à l'id du produit dans une constante puis créer le HTML.
const start = async () => {
    const product = await getProductsById();
    generateProducts(product);
};

start();

//créer un évenement sur le bouton "ajouter au panier"
const addButton = document.querySelector(".item__content__addButton");
addButton.addEventListener("click", function pushCart() {
    //stock dans la variable "cart" soit le panier déjà présent dans le localStorage soit s'il n'y a rien, un panier vide.
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    let color = document.getElementById("colors").value;
    let quantity = parseInt(document.getElementById("quantity").value);

    /*checkValues recherche une correspondance aux informations selectionnées par l'utilisateur dans le panier (local storage) puis renvois
    "true" si c'est le cas pour pouvoir entrer dans une fonction.*/
    const checkValues = () => {
        for (let item of cart) {
            if (item.id === id && item.color === color) {
                return true;
            }
        }
    };

    if (cart.length === 0) {
        //Si le panier est vide, créer un nouvel objet panier.
        if (color !== "" && quantity != 0) {
            let cartObject = {
                id: id,
                color: color,
                quantity: parseInt(quantity),
            };

            cart.push(cartObject);

            localStorage.setItem("cart", JSON.stringify(cart));
        }
    } else if (checkValues() === true) {
        //indentObject est une copie du panier(cart) modifiée pour que les nouvelles quantités soient incrémentées.
        let indentObject = cart.map((product) => {
            if (product.id === id && product.color === color) {
                product.quantity += quantity;
            }
            return product;
        });
        cart = indentObject;
        localStorage.setItem("cart", JSON.stringify(cart));
    } else {
        //Si le panier n'est pas vide MAIS que les informations selectionnées par l'utilisateur ne correspondent pas, créer un nouvel objet.
        if (color !== "" && quantity != 0) {
            let cartObject = {
                id: id,
                color: color,
                quantity: parseInt(quantity),
            };

            cart.push(cartObject);

            localStorage.setItem("cart", JSON.stringify(cart));
        }
    }
});

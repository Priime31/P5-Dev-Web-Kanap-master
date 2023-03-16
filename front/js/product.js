//stock l'url de la page product dans une variable.
const url = new URL(window.location.href);

//cherche dans l'url l'id du produit puis le stock dans une variable.
const id = url.searchParams.get("id");

//récupère dans l'API les données du produit correspondant à l'id de la page au format JSON.
const getProductsById = async () => {
    const reponseId = await fetch("http://localhost:3000/api/products/" + id);
    return await reponseId.json();
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
    itemPrice.innerHTML = product.price;
    itemDescription.innerHTML = product.description;

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

    /*cherche un objet dans le panier correspondant aux valeurs id et color de la page produit puis s'il y a une correspondance, incrémente
    la quantité selectionnée par l'utilisateur, sinon créer l'objet dans le panier.*/

    const checkValues = () => {
        for (let item of cart) {
            if (item.id === id && item.color === color) {
                return true;
            }
        }
    };

    if (cart.length === 0) {
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
        let indentObject = cart.map((product) => {
            if (product.id === id && product.color === color) {
                product.quantity += quantity;
            }
            return product;
        });
        cart = indentObject;
        localStorage.setItem("cart", JSON.stringify(cart));
    } else {
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

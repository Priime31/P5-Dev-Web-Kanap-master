//stock l'url de la page product dans une variable.
const url = new URL(window.location.href);

//cherche dans l'url l'id du produit puis le stock dans une variable.
const id = url.searchParams.get("id");

//récupère dans l'API les données du produit correspondant à l'id de la page au format JSON.
async function getProductsById() {
    const reponseId = await fetch('http://localhost:3000/api/products/' + id);
    return await reponseId.json();
}

//créer du contenu HTML avec les données retournées par l'API.
function generateProducts(product) {
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
}

//stock les données liées à l'id du produit dans une constante puis créer le HTML.
async function start() {
    const product = await getProductsById();
    generateProducts(product);
}

start();

//créer un évenement sur le bouton "ajouter au panier"
const addButton = document.querySelector(".item__content__addButton");
addButton.addEventListener("click", function pushCart() {
    //stock dans la variable "cart" soit le panier déjà présent dans le localStorage soit s'il n'y a rien, un panier vide.
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    let color = document.getElementById("colors").value;
    console.log(color);
    let quantity = document.getElementById("quantity").value;
    
    //cherche un objet dans le panier correspondant aux valeurs id et color de la page produit 
    function indentObject(id, color, quantity) {
        
/*
        const toto = cart.map((product) => {
            console.log(product.quantity);
            product.quantity++;
            console.log(product.quantity);
            return product;
        });*/
        //console.log(toto);


        for (let product of cart) {
            console.log(product);
            if (product.id === id && product.coulor === color) {
                console.log("id et color dans le panier");
                /*const cartQuantity = parseInt(product["quantity"]);
                const objectQuantity = parseInt(quantity);*/

                product.quantity = product.quantity + parseInt(quantity);

            } else {
                console.log("non présent dans le panier");
                if (color !== "" && quantity !== 0) {
                    let cartObject = {
                        id: id,
                        coulor: color,
                        quantity: parseInt(quantity),
                    };
                
                    cart.push(cartObject);
                
                    
                }
            }
            
        }
        localStorage.setItem("cart", JSON.stringify(cart));
    }

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
    } else {
        indentObject(id, color, quantity);
    }

    console.log(cart);
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
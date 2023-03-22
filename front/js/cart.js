//getProductsById récupère dans l'API les données du produit correspondant à son id au format JSON.
const getProductsById = async (product) => {
    const answerId = await fetch(
        "http://localhost:3000/api/products/" + product.id
    );
    return await answerId.json();
};
let cart = JSON.parse(localStorage.getItem("cart"));

//Créer du contenu HTML pour chaque élément du panier grâce aux informations complémentaires récupérées dans l'API.
const generateProducts = async (cart) => {
    let display = "";

    for (let product of cart) {
        const productInfo = await getProductsById(product);
        display += `
            <article class="cart__item" data-id="${product.id}" data-color="${product.color}">
                <div class="cart__item__img">
                    <img src="${productInfo.imageUrl}" alt="${productInfo.altTxt}">
                </div>
                <div class="cart__item__content">
                    <div class="cart__item__content__description">
                        <h2>${productInfo.name}</h2>
                        <p>${product.color}</p>
                        <p>${productInfo.price} €</p>
                    </div>
                    <div class="cart__item__content__settings">
                        <div class="cart__item__content__settings__quantity">
                            <p>Qté :</p>
                            <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${product.quantity}">
                        </div>
                        <div class="cart__item__content__settings__delete">
                            <p class="deleteItem">Supprimer</p>
                        </div>
                    </div>
                </div>
            </article>
        `;
    }
    document.querySelector("#cart__items").innerHTML = display;
};

//génère le prix total et la quantité totale liés aux articles du panier.
const generatePrice = async (cart) => {
    let price = 0;
    let quantity = 0;
    for (let product of cart) {
        const productInfo = await getProductsById(product);
        price += parseInt(productInfo.price) * product.quantity;
        quantity += product.quantity;
    }
    const totalQuantity = document.querySelector("#totalQuantity");
    const totalPrice = document.querySelector("#totalPrice");
    totalQuantity.innerText = quantity;
    totalPrice.innerText = price;
};

//lance étape par étape les fonctions pour qu'elles s'attendent.
const start = async () => {
    await generateProducts(cart);
    await generatePrice(cart);
    await addListener();
};

start();

//ajoute des eventListeners sur chaque élément du panier.
const addListener = () => {
    const inputQuantity = document.querySelectorAll(".itemQuantity");
    for (let input of inputQuantity) {
        //le premier type de listener modifie la quantité de produits dans le localStorage dès que l'utilisateur la modifie dans le panier.
        input.addEventListener("change", function modifyQuantity() {
            const closestArticle = input.closest("article");
            const closestId = closestArticle.getAttribute("data-id");
            const closestColor = closestArticle.getAttribute("data-color");
            cart.map((product) => {
                if (
                    product.id === closestId &&
                    product.color === closestColor
                ) {
                    product.quantity = parseInt(input.value);
                }
            });
            localStorage.setItem("cart", JSON.stringify(cart));

            //regénère le panier avec les nouvelles informations.
            generatePrice(cart);
        });
    }

    const inputDelete = document.querySelectorAll(".deleteItem");
    for (let input of inputDelete) {
        //permet de supprimer un produit du panier puis raffraichi le panier.
        input.addEventListener("click", function deleteItem() {
            const closestArticle = input.closest("article");
            const closestId = closestArticle.getAttribute("data-id");
            const closestColor = closestArticle.getAttribute("data-color");
            cart.map((product) => {
                if (
                    product.id === closestId &&
                    product.color === closestColor
                ) {
                    const productIndex = cart.indexOf(product);
                    cart.splice(productIndex, 1);
                }
            });
            closestArticle.remove();
            localStorage.setItem("cart", JSON.stringify(cart));

            generatePrice(cart);
        });
    }

    const submitInput = document.getElementById("order");
    //permet d'envoyer les informations de contacts et les éléments du panier à l'API qui nous retourne un Numéro de commande.
    submitInput.addEventListener("click", async function submit(e) {
        e.preventDefault();
        console.log("on est passé par là");

        const nameRegex = /^[a-z ,.'-]+$/i;
        const addressRegex =
            /^[a-zA-Z0-9àèìòùÀÈÌÒÙáéíóúýÁÉÍÓÚÝâêîôûÂÊÎÔÛãñõÃÑÕäëïöüÿÄËÏÖÜŸçÇßØøÅåÆæœ\s,'-]*$/;
        const cityRegex =
            /^([a-zA-Z\u0080-\u024F]+(?:. |-| |'))*[a-zA-Z\u0080-\u024F]*$/;
        const emailRegex = /^[\w-.]+@([\w-]+.)+[\w-]{2,4}$/;

        const firstName = document.getElementById("firstName");
        const lastName = document.getElementById("lastName");
        const address = document.getElementById("address");
        const city = document.getElementById("city");
        const email = document.getElementById("email");

        const validFirstName = nameRegex.test(firstName.value);
        const validLastName = nameRegex.test(lastName.value);
        const validAddress = addressRegex.test(address.value);
        const validCity = cityRegex.test(city.value);
        const validEmail = emailRegex.test(email.value);

        const firstNameErr = document.getElementById("firstNameErrorMsg");
        const lastNameErr = document.getElementById("lastNameErrorMsg");
        const addressErr = document.getElementById("addressErrorMsg");
        const cityErr = document.getElementById("cityErrorMsg");
        const emailErr = document.getElementById("emailErrorMsg");

        if (validFirstName === false) {
            firstNameErr.innerText = "Veuillez entrer un Prénom valide.";
        }
        if (validLastName === false) {
            lastNameErr.innerText = "Veuillez entrer un Nom valide.";
        }
        if (validAddress === false || address.value === "") {
            addressErr.innerText = "Veuillez entrer une adresse valide.";
        }
        if (validCity === false || city.value === "") {
            cityErr.innerText = "Veuillez entrer un nom de ville valide.";
        }
        if (validEmail === false) {
            emailErr.innerText = "Veuillez entrer une adresse mail valide.";
        }

        //vérifie la validité des informations entrées par l'utilisateur puis les envois à l'API et récupère la réponse au format JSON.
        const postOrder = async () => {
            if (
                validFirstName === true &&
                validLastName === true &&
                validAddress === true &&
                validCity === true &&
                validEmail === true
            ) {
                const order = [];
                cart.map((product) => {
                    order.push(product.id);
                })
                let userOrder = {
                    contact: {
                        firstName: firstName.value,
                        lastName: lastName.value,
                        address: address.value,
                        city: city.value,
                        email: email.value,
                    },
                    products: order,
                };

                fetch("http://localhost:3000/api/products/order", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(userOrder),
                })
                    .then((answer) => {
                        return answer.json();
                    })
                    .then((answer) => window.location.href = `../html/confirmation.html?orderId=${answer.orderId}`)
                    .catch((err) => {
                        console.log(
                            "Une erreur est survenue lors de la requête :" + err
                        );
                    });
            }
        };

        postOrder();
    });
};

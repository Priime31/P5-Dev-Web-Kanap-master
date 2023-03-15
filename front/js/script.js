//getProducts récupère les données de l'API et les retournes en format JSON.
async function getProducts() {
    const reply = await fetch("http://localhost:3000/api/products");
    return await reply.json();
}

//generateProducts créer du contenu HTML pour chaque produit récupéré.
// const generateProducts = (products) => {
function generateProducts(products) {
    let display = "";

    for (let product of products) {
        display += `
            <a href="./product.html?id=${product._id}">
                <article>
                    <img src="${product.imageUrl}" alt="${product.altTxt}">
                    <h3 class="productName">${product.name}</h3>
                    <p class="productDescription">${product.description}</p>
                </article>
            </a>
        `;
    }
    document.querySelector("#items").insertAdjacentHTML("beforeend", display);
}

//start permet d'attendre que la liste de produits soit stocké avant de lancer la création du contenu HTML.
async function start() {
    const products = await getProducts();
    generateProducts(products);
}

start();
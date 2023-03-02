async function getProducts() {
    const reply = await fetch("http://localhost:3000/api/products");
    return await reply.json();
}

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
        console.log(display);
    }
    document.querySelector("#items").insertAdjacentHTML("beforeend", display);
}

async function start() {
    const products = await getProducts();
    generateProducts(products);
    console.log(products);
}

start();

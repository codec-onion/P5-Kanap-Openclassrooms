// Récupération des produits depuis l'API
fetch('http://localhost:3000/api/products')
    .then(function(response) {
    return response.json();
    })
    .then(function(products) {
        generateElements(products);
});

//Création des fiches de produit
function generateElements (productsArray) {
    for (let product of productsArray) {
        const id = product._id;

        const productSection = document.querySelector("#items");

        const productLink = document.createElement("a");
        productLink.setAttribute("href", `./product.html?id=${id}`);

        const productCard = document.createElement("article");

        const productImg = document.createElement("img");
        productImg.src = product.imageUrl;
        productImg.alt = product.altTxt;

        const productName = document.createElement("h2");
        productName.className = "productName";
        productName.innerText = product.name;

        const productDescription = document.createElement("p");
        productDescription.className = "productDescription";
        productDescription.innerText = product.description;

        productSection.appendChild(productLink);
        productLink.appendChild(productCard);
        productCard.appendChild(productImg);
        productCard.appendChild(productName);
        productCard.appendChild(productDescription);
    }
}

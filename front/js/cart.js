//Récupération et désérialisation du panier dans le localStorage
const cartStorage = window.localStorage.getItem("cart");
const cart = JSON.parse(cartStorage);


fetch(`http://localhost:3000/api/products/`)
.then(function(response) {
    return response.json();
})
.then(function(products) {
    generateElements(products);
    totalPriceCalculate(products);
    totalQuantityCalculate();
    changeQuantity(products);
    removeProduct(products);
    checkValidInputs();
    sendOrder();
});


//Création de la fiche produit
function generateElements (products) {
    if (cart) {
        for (let element of cart) {
            const product = products.find(el => el._id === element.id);

            const productsList = document.querySelector("#cart__items");
            const productArticle = document.createElement("article");
            productArticle.className = "cart__item";
            productArticle.dataset.id = element.id;
            productArticle.dataset.color = element.color;
            productsList.appendChild(productArticle);


            const productDivImg = document.createElement("div");
            productDivImg.className = "cart__item__img";
            const productImg = document.createElement("img");
            productImg.src = product.imageUrl;
            productImg.alt = product.altTxt;

            productDivImg.appendChild(productImg);
            productArticle.appendChild(productDivImg);


            const productDivContent = document.createElement("div");
            productDivContent.className = "cart__item__content";
            productArticle.appendChild(productDivContent);


            const productDescriptionDiv = document.createElement("div");
            productDescriptionDiv.className = "cart__item__content__description";
            const productName = document.createElement("h2");
            productName.innerText = product.name;
            const productTextColor = document.createElement("p");
            productTextColor.innerText = element.color;
            const productPrice = document.createElement("p");
            productPrice.innerText = `${product.price} €`;

            productDescriptionDiv.appendChild(productName);
            productDescriptionDiv.appendChild(productTextColor);
            productDescriptionDiv.appendChild(productPrice);
            productDivContent.appendChild(productDescriptionDiv);


            const productDivSettings = document.createElement("div");
            productDivSettings.className = "cart__item__content__settings";
            const productDivQuantity = document.createElement("div");
            productDivQuantity.className = "cart__item__content__settings__quantity";
            const productTextQuantity = document.createElement("p");
            productTextQuantity.innerText = "Qté : ";
            const productQuantityInput = document.createElement("input");
            productQuantityInput.setAttribute("type", "number");
            productQuantityInput.className = "itemQuantity";
            productQuantityInput.setAttribute("name", "itemQuantity");
            productQuantityInput.setAttribute("min", "1");
            productQuantityInput.setAttribute("max", "100");
            productQuantityInput.setAttribute("value", element.quantity);

            productDivQuantity.appendChild(productTextQuantity);
            productDivQuantity.appendChild(productQuantityInput);
            productDivSettings.appendChild(productDivQuantity);
            productDivContent.appendChild(productDivSettings);


            const productDivDelete = document.createElement("div");
            productDivDelete.className = "cart__item__content__settings__delete";
            const productTextDelete = document.createElement("p");
            productTextDelete.className = "deleteItem";
            productTextDelete.innerText = "Supprimer";

            productDivDelete.appendChild(productTextDelete);
            productDivSettings.appendChild(productDivDelete);
        }
    }
}

//Calcul du nombre de produits totaux
function totalQuantityCalculate () {
    let totalQuantity = 0;
    for (let element of cart) {
        totalQuantity +=  element.quantity;
    }
    const totalQuantityText = document.querySelector("#totalQuantity");
    totalQuantityText.innerText = totalQuantity;
}

//Calcul du prix total
function totalPriceCalculate (products) {
    let totalPrice = 0;
    for (let element of cart) {
        const product = products.find(el => el._id === element.id);
        let totalPriceProduct = product.price * element.quantity;
        totalPrice += totalPriceProduct;
    }
    const totalPriceText = document.querySelector("#totalPrice");
    totalPriceText.innerText = totalPrice;
}

//Modification nombre d'articles
function changeQuantity (products) {
    const quantityInput = document.querySelectorAll(`.itemQuantity`);
    for (let input of quantityInput) {
        input.addEventListener("change", function (e){
            const article = input.closest("article.cart__item");
            const id = article.dataset.id;
            const color = article.dataset.color;
            const productCart = cart.find(el => el.id === id && el.color === color);

            let newQuantity = e.target.value;

            if (newQuantity >= 1) {
                productCart.quantity = parseInt(newQuantity);

                window.localStorage.removeItem("cart");
                window.localStorage.setItem("cart", JSON.stringify(cart));

                totalQuantityCalculate();
                totalPriceCalculate(products);
            }
        });
    }
}

//Sppression d'un article du panier
function removeProduct (products) {
    const removeInput = document.querySelectorAll(`.deleteItem`);
    for (let input of removeInput) {
        input.addEventListener("click", function () {
            const article = input.closest("article.cart__item");
            const id = article.dataset.id;
            const color = article.dataset.color;
            const productCart = cart.find(el => el.id === id && el.color === color);
            const productCartIndex = cart.indexOf(productCart);

        
            cart.splice(productCartIndex,1);
            article.remove();

            window.localStorage.removeItem("cart");
            window.localStorage.setItem("cart", JSON.stringify(cart));

            totalQuantityCalculate();
            totalPriceCalculate(products);
        });
    }
}

//Ciblage des différents inputs
const firstNameInput = document.querySelector("#firstName");
const lastNameInput = document.querySelector("#lastName");
const addressInput = document.querySelector("#address");
const cityInput = document.querySelector("#city");
const emailInput = document.querySelector("#email");

//Vérification des inputs grâce au regex et affichage du message d'erreur
function checkValidInputs () {
    const nameRegex = /^[A-Za-zÀÁÂÃÄÅàáâãäåÒÓÔÕÖòóôõöÈÉÊËèéêëÇçÌÍÎÏìíîïÙÚÛÜùúûüÿÑñ-\s]+$/;
    const addressRegex = /^[\w\s,'-]+$/;
    const cityRegex = /^[A-Za-z-]+$/;
    const mailRegex = /^[^.][a-z0-9._-]+[^.]@[^-][a-z0-9-]+[^-]\.[a-z]{2,6}$/;

    const firstNameErrorMsg = document.querySelector("#firstNameErrorMsg");
    firstNameInput.addEventListener("keyup", function () {
        if (nameRegex.test(firstNameInput.value)) {
            firstNameErrorMsg.innerText = "";
        } else {
            firstNameErrorMsg.innerText ="Prénom invalide. Le prénom ne peut contenir de caractères spéciaux sauf le tiret ou l'espace"
        }
    });
    
    const lastNameErrorMsg = document.querySelector("#lastNameErrorMsg");
    lastNameInput.addEventListener("keyup", function () {
        if (nameRegex.test(lastNameInput.value)) {
            lastNameErrorMsg.innerText = "";
        } else {
            lastNameErrorMsg.innerText ="Nom invalide. Le nom ne peut contenir de caractères spéciaux sauf le tiret ou l'espace"
        }
    });

    const addressErrorMsg = document.querySelector("#addressErrorMsg");
    addressInput.addEventListener("keyup", function () {
        if (addressRegex.test(addressInput.value)) {
            addressErrorMsg.innerText = "";
        } else {
            addressErrorMsg.innerText ="Addresse invalide. Si votre adresse contient des lettres accentuées, vous pouvez remplacer par les mêmes lettres sans accents."
        }
    });

    const cityErrorMsg = document.querySelector("#cityErrorMsg");
    cityInput.addEventListener("keyup", function () {
        if (cityRegex.test(cityInput.value)) {
            cityErrorMsg.innerText = "";
        } else {
            cityErrorMsg.innerText ="Nom de ville invalide. Si le nom de votre ville contient des lettres accentuées, vous pouvez remplacer par les mêmes lettres sans accents."
        }
    });

    const emailErrorMsg = document.querySelector("#emailErrorMsg");
    emailInput.addEventListener("keyup", function () {
        if (mailRegex.test(emailInput.value)) {
            emailErrorMsg.innerText = "";
        } else {
            emailErrorMsg.innerText ="Email incorrect. Exemple: ex-am_ple98@exa-mple.com"
        }
    });
}

//Envoie de la commande vers l'API
function sendOrder () {
    const sendButton = document.querySelector("#order");
    sendButton.addEventListener("click", function (event) {
        event.preventDefault();

        const productsId = [];
        for (let element of cart) {
            productsId.push(element.id);
        }

        fetch("http://localhost:3000/api/products/order", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                contact: {
                    firstName: firstNameInput.value,
                    lastName: lastNameInput.value,
                    address: addressInput.value,
                    city: cityInput.value,
                    email: emailInput.value
                },
                products: productsId
            })
        })
        .then(function(response) {
            return response.json();
        })
        .then(function(orderData) {
            localStorage.clear();
            location.assign(`./confirmation.html?orderid=${orderData.orderId}`);
        })
        .catch((error) => {
            alert ("Problème avec fetch : " + error.message);
        });
    });
}



//Test des inputs
// Jean Michel
// Bedouin
// 23 avenue du clown des chatelains
// Pomme-Perdue
// garou@rock.com
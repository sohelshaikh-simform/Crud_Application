function getLocalData() {
    var peopleList;
    if (localStorage.getItem("peopleList") == null) {
        peopleList = [];
    }
    else {
        peopleList = JSON.parse(localStorage.getItem("peopleList"));
    }
    return peopleList;
}


let pageURL = new URL(window.location.href);
let product_id = pageURL.searchParams.get("id");
console.log(product_id)
let productsArray = getLocalData();
console.log(productsArray);
let product = productsArray.find((p) => {
    if (p.ProductId == product_id)
        return p;
});
console.log(product);
let img=`<img src=${product.Image}>`
document.querySelector(".container .img").innerHTML = img;

let html = ""
html += `
                <div class="card">
                    <div class="header">
                        <p>${product.ProductName}</p>
                    </div>
                    <div class="info">
                    <p>ID:${product.ProductId}</p>
                       <p>Description:${product.Description}</p>
                    </div>
                    <div class="footer">
                    <button type="button" class="action">${product.Price}$</button>
                    </div>
                    </div>            
                    
                    <div>`
document.querySelector(".container .content").innerHTML = html;
let productImage = document.getElementById("Image");
let ProductName = document.getElementById("ProductName");
let ProductId = document.getElementById("ProductId");
let Price = document.getElementById("Price").value;
let Description = document.getElementById("Description").value;

function validForm() {

    let productsArray = getLocalData();
    productsArray.find((p) => {
        if (ProductId.value == p.ProductId) {
            alert("Product with the same ID already exists. Please enter unique IDs only.");
            ProductId.value = "";
        }
    });
    if (ProductId.value == "") {
        alert("ProductId is Require");
        return false;
    }

    if (ProductName.value == "") {
        alert("ProductName is Require");
        return false;
    }
    if (Price.value == "") {
        alert("Price is required");
        return false;
    }
    if (Description.value == "") {
        alert("Price is required");
        return false;
    }
    if (productImage.value == "") {
        alert("ProductImage is Require");
        return false;
    }
    return true;
}
//this function encode image file as url (asynchronously) which can be used as src (base64)
const encodeAsUrl = (file) => {
    return new Promise(function (resolve, reject) {
        const reader = new FileReader();
        if (file.type == "image/png" || file.type == "image/jpeg" || file.type == "image/webp") {
            reader.readAsDataURL(file);
            reader.onloadend = () => {
                resolve(reader.result);
            };
            reader.onerror = () => {
                reject(new Error("Problem encoding file!"))
            }
        }
        else {
            reject(new Error("Type of file should be image."))
        }
    });
};

//getting encoded image as preview and to store it later
var imgEncoded = '';
const getEncodedImage = async () => {
    try {
        imgEncoded = await encodeAsUrl(productImage.files[0]);
    }
    catch (err) {
        productImage.value = '';
        imgEncoded = '';
        alert(err.message);
    }

}
productImage.addEventListener('change', getEncodedImage);

// To Get LocalData
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

// To ADD Data
function addData() {

    if (validForm() == true) {
        var ProductId = document.getElementById("ProductId");
        var ProductName = document.getElementById("ProductName");
        var Price = document.getElementById("Price");
        var Description = document.getElementById("Description");
        var peopleList = getLocalData();

        let product = {
            ProductId: ProductId.value,
            ProductName: ProductName.value,
            Image: imgEncoded,
            Price: Price.value,
            Description: Description.value
        };
        peopleList.push(product)
        localStorage.setItem("peopleList", JSON.stringify(peopleList));
        alert("successfully added")
        showData();
        document.getElementById("ProductId").value = ""
        document.getElementById("ProductName").value = ""
        document.getElementById("Image").value = ""
        document.getElementById("Price").value = ""
        document.getElementById("Description").value = ""
    }
}

//To Show data
function showData() {
    var peopleList = getLocalData();

    const tableRow = (index, ProductId, ProductName, Image, Price) => {
        let p = '?id=' + ProductId;
        return `    
                        <div class="card">
                            <img class="image-of-product" src=${Image}>
                            <h2>Name:${ProductName}</h2>
                            <h3>Id:${ProductId}</p>
                            
                            <div class="iconImg">
                                <a href='view.html${p}' target="_blank"><image src="images/eye.png" onclick="veiwFuc(${index})" class="view"></a>
                                <image src="images/edit.png" onclick="updateData(${index})" class="edit">
                                <image src="images/delete.png" onclick="deleteData(${index})" class="delete">
                            </div>
                        </div>`;
    };
    var html = "";
    peopleList.forEach((element, index) => {
        html += tableRow(index, element.ProductId, element.ProductName, element.Image, element.Price);
    });
    document.querySelector(".carView").innerHTML = html;
}
document.onload = showData();

// To Delete the data
function deleteData(index) {
    var peopleList = getLocalData();
    peopleList.splice(index, 1);
    localStorage.setItem("peopleList", JSON.stringify(peopleList));
    showData();
}

// To UpdateData
function updateData(index) {
    document.getElementById("submit").style.display = "none";
    document.getElementById("update").style.display = "block";
    var peopleList = getLocalData();
    document.getElementById("ProductId").value = peopleList[index].ProductId;
    document.getElementById("ProductName").value = peopleList[index].ProductName;
    document.getElementById("Price").value = peopleList[index].Price;
    document.getElementById("Description").value = peopleList[index].Description;
    // document.getElementById("Image") = peopleList[index].Image;
    deleteData(index)

    document.querySelector("#update").onclick = function () {
        if (validForm() == true) {
            peopleList[index].ProductId = document.getElementById("ProductId").value;
            peopleList[index].ProductName = document.getElementById("ProductName").value;
            peopleList[index].Image = imgEncoded;
            peopleList[index].Price = document.getElementById("Price").value;
            peopleList[index].Description = document.getElementById("Description").value;

            localStorage.setItem("peopleList", JSON.stringify(peopleList));
            showData();
            document.getElementById("ProductId").value = ""
            document.getElementById("ProductName").value = ""
            document.getElementById("Image").value = ""
            document.getElementById("Price").value = ""
            document.getElementById("Description").value = ""

            document.getElementById("submit").style.display = "block";
            document.getElementById("update").style.display = "none";

        }
    }

}
// To Search the Product By Id
function searchfun() {
    let filter = document.getElementById("myInput").value;
    let item = document.querySelectorAll(".card");
    let l = document.getElementsByTagName("h3");
    try {

        for (i = 0; i <= l.length; i++) {
            let a = item[i].getElementsByTagName('h3')[0];
            let value = a.innerHTML || a.innnerText || a.textContent
            if (value.indexOf(filter) > -1) {
                item[i].style.display = ""

            }
            else {
                item[i].style.display = "none"
            }
        }
    }
    catch { }

}

// To Sort the Data By Specific Value
function sortData(sortValue) {
    var peopleList = getLocalData();
    function dynamicSort(property) {
        return function (a, b) {
            var result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
            return result;
        }
    }
    let aftersort = peopleList.sort(dynamicSort(sortValue));
    localStorage.setItem("peopleList", JSON.stringify(aftersort));
    showData();


}
let ProductId = document.getElementById("ProductId").value;
let ProductName = document.getElementById("ProductName").value;
let productImage = document.getElementById("Image");
let Price = document.getElementById("Price").value;

function validForm() {
    let ProductId = document.getElementById("ProductId").value;
    let ProductName = document.getElementById("ProductName").value;
    let productImage = document.getElementById("Image").value;
    let Price = document.getElementById("Price").value;
    if (ProductId == "") {
        alert("ProductId is Require");
        return false;
    }
    if (productImage == "") {
        alert("ProductImage is Require");
        return false;
    }

    if (ProductName == "") {
        alert("ProductName is Require");
        return false;
    }
    if (Price == "") {
        alert("Price is required");
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
        // console.log(imgEncoded);

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
        var productImage = document.getElementById("Image");
        var Price = document.getElementById("Price");
        var peopleList = getLocalData();


        let product = {
            ProductId: ProductId.value,
            ProductName: ProductName.value,
            Image: imgEncoded,
            Price: Price.value
        };
        peopleList.push(product)
        localStorage.setItem("peopleList", JSON.stringify(peopleList));
        console.log("after add", peopleList);
        showData();
        // console.log(peopleList);
        document.getElementById("ProductId").value = ""
        document.getElementById("ProductName").value = ""
        document.getElementById("Image").value = ""
        document.getElementById("Price").value = ""
    }
}


//To Show data
function showData() {
    var peopleList = getLocalData();

    const tableRow = (index, ProductId, ProductName, Image, Price) => {
        return `<tr>
                    <td>${ProductId}</td>
                    <td>${ProductName}</td>
                    <td><img class="image-of-product" src=${Image}></td>
                    <td>${Price}</td>
                    <td> <button onclick="deleteData(${index})" class="delete">Delete</button><button onclick="updateData(${index})" class="edit">Edit</button>
                    </td>
                </tr>`;
    };
    var html = "";
    peopleList.forEach((element, index) => {
        html += tableRow(index, element.ProductId, element.ProductName, element.Image, element.Price);
    });
    document.querySelector("#table tbody").innerHTML = html;
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
function sort() {
    var peopleList = getLocalData();

    const pairs = Object.entries(peopleList)
        .map((ProductId) => ({
            key: parseInt(ProductId),
        }))
        .sort(({ key: keyA }, { key: keyB }) => keyA - keyB);

    console.log(pairs);
    showData();
}
function updateData(index) {
    document.getElementById("submit").style.display = "none";
    document.getElementById("update").style.display = "block";

    var peopleList = getLocalData();
    document.getElementById("ProductId").value = peopleList[index].ProductId;
    document.getElementById("ProductName").value = peopleList[index].ProductName;
    document.getElementById("Price").value = peopleList[index].Price;
    // document.getElementById("Image").src = peopleList[index].Image;

    document.querySelector("#update").onclick = function () {
        // console.log("Updat Call");
        if (validForm() == true) {
            peopleList[index].ProductId = document.getElementById("ProductId").value;
            peopleList[index].ProductName = document.getElementById("ProductName").value;
            peopleList[index].Image = imgEncoded;
            peopleList[index].Price = document.getElementById("Price").value;

            localStorage.setItem("peopleList", JSON.stringify(peopleList));
            showData();
            document.getElementById("ProductId").value = ""
            document.getElementById("ProductName").value = ""
            document.getElementById("Image").value = ""
            document.getElementById("Price").value = ""

            document.getElementById("submit").style.display = "block";
            document.getElementById("update").style.display = "none";

        }
    }

}

function searchfun() {
    let item = document.getElementById("myInput").value;
    let myTable = document.getElementById('table');
    let tr = myTable.getElementsByTagName('tr');
    for (i = 0; i < tr.length; i++) {
        let td = tr[i].getElementsByTagName('td')[0];
        if (td) {
            let textValue = td.textContent || td.innerHTML;
            if (textValue.indexOf(item) > -1) {
                tr[i].style.display = ""
            } else {
                tr[i].style.display = "none";
            }
        }
    }

}

function sortData() {
    let sortValue = document.getElementById("sortInput").value
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
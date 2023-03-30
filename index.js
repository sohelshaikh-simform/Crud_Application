let productImage = document.getElementById("Image");
let ProductName = document.getElementById("ProductName");
let Price = document.getElementById("Price").value;
let Description = document.getElementById("Description").value;

//this function encode image file as url (asynchronously) which can be used as src (base64)
const encodeAsUrl = (file) => {
    return new Promise(function (resolve, reject) {
        const reader = new FileReader();
        if (file) {
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
    var productList;
    if (localStorage.getItem("productList") == null) {
        productList = [];
    }
    else {
        productList = JSON.parse(localStorage.getItem("productList"));
    }
    return productList;
}

// To ADD Data
function addData() {
    let ProductName = document.getElementById("ProductName");
    let Price = document.getElementById("Price");
    let Description = document.getElementById("Description");
    let Image = document.getElementById("Image");
    
    let productList = getLocalData();
    let id=0;
    for(i=0;i<productList.length;i++){
        id=productList[i].ProductId
    }
    let product = {
        ProductId: id + 1,
        ProductName: ProductName.value,
        Image: imgEncoded,
        ImageName: Image.files[0].name,
        Price: Price.value,
        Description: Description.value
    };
    productList.push(product)
    localStorage.setItem("productList", JSON.stringify(productList));
    alert("Successfully added")
    showData(productList);
    document.getElementById("ProductId").value = ""
    document.getElementById("ProductName").value = ""
    document.getElementById("Image").value = ""
    document.getElementById("Price").value = ""
    document.getElementById("Description").value = ""
}


//To Show data
function showData(productList) {

    const tableRow = (index, ProductId, ProductName, Image, Price) => {
        let p = '?id=' + ProductId;
        return `    
                        <div class="card">
                            <img class="image-of-product" src=${Image}>
                            <h2 style="text-transform:capitalize;">Name: ${ProductName}</h2>
                            <h3>Id: ${ProductId}</p>
                            
                            <div class="iconImg">
                                <a href='view.html${p}' target="_blank"><image src="images/eye.png" class="view"></a>
                                <image src="images/edit.png" onclick="updateData(${index})" class="edit">
                                <image src="images/delete.png" onclick="deleteData(${index})" class="delete">
                            </div>
                        </div>`;
    };
    var html = "";
    productList.forEach((element, index) => {
        html += tableRow(index, element.ProductId, element.ProductName, element.Image, element.Price);
    });
    document.querySelector(".carView").innerHTML = html;
}
let productList=getLocalData();
document.onload = showData(productList);

// To Delete the data
function deleteData(index) {
    var productList = getLocalData();
    productList.splice(index, 1);
    localStorage.setItem("productList", JSON.stringify(productList));
    showData(productList);
}

// To UpdateData
function updateData(index) {

    document.getElementById("submit").style.display = "none";
    document.getElementById("update").style.display = "block";

    var productList = getLocalData();

    document.getElementById("ProductName").value = productList[index].ProductName;
    document.getElementById("Price").value = productList[index].Price;
    document.getElementById("Description").value = productList[index].Description;

    let b = dataURItoBlob(productList[index].Image);
    //Create a file object with with that blob object and stored file name    
    let file = new File([b], productList[index].ImageName);
    //create datatransfer object    
    let transferObj = new DataTransfer();
    transferObj.items.add(file);
    //add file to it    
    //assign datatransfer object to form    
    document.getElementById("Image").files = transferObj.files;
    getEncodedImage();

    //function to convert URL to blob object
    function dataURItoBlob(dataURI) {
        // convert base64 to raw binary data held in a string    
        // doesn't handle URLEncoded DataURIs - see SO answer #6850276 for code that does this    
        var byteString = atob(dataURI.split(',')[1]);
        // separate out the mime component    
        var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
        // write the bytes of the string to an ArrayBuffer    
        var ab = new ArrayBuffer(byteString.length);
        var ia = new Uint8Array(ab);
        for (var i = 0; i < byteString.length; i++) {
            ia[i] = byteString.charCodeAt(i);
        }
        return new Blob([ab], { type: mimeString });
    }

    document.querySelector("#update").onclick = function () {

            productList[index].ProductName = document.getElementById("ProductName").value;
            productList[index].Image = imgEncoded;
            productList[index].Price = document.getElementById("Price").value;
            productList[index].Description = document.getElementById("Description").value;

            localStorage.setItem("productList", JSON.stringify(productList));
            showData();

            document.getElementById("ProductName").value = ""
            document.getElementById("Image").value = ""
            document.getElementById("Price").value = ""
            document.getElementById("Description").value = ""

            document.getElementById("submit").style.display = "block";
            document.getElementById("update").style.display = "none";
     
    }

}
// To Search the Product By Id
function searchfun() {
    let filter = document.getElementById("myInput").value;
    let productList=getLocalData();
    productData=productList.filter((element)=>{      
            if(String(element.ProductId).includes(filter) || element.ProductName.includes(filter) || String(element.Price).includes((filter)) ){
                return element;
            }
    })
    showData(productData);
}

// To Sort the Data By Specific Value
function sortData(sortValue) {
    var productList = getLocalData();
    function dynamicSort(property) {
        return function (a, b) {
            var result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
            return result;
        }
    }
    let aftersort = productList.sort(dynamicSort(sortValue));
    showData(aftersort);
}
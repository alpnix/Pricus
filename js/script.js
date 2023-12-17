var boxes = document.querySelector(".boxes");
console.log(document) // remove
// array remove function
Array.prototype.remove = function() {
    var what, a = arguments, L = a.length, ax;
    while (L && this.length) {
        what = a[--L];
        while ((ax = this.indexOf(what)) !== -1) {
            this.splice(ax, 1);
        }
    }
    return this;
};

// if you want to restart the list
// chrome.storage.sync.set({"productsData": []});
console.log("from script"); 

chrome.storage.sync.get(["productsData"], function(result) {
    if (!result.productsData) {
        console.log("no result");
        return;
    }

    result.productsData.forEach(productInfo => {
        
        console.log(productInfo);

        if (productInfo) {
            let newBox = getNewBox(productInfo);
            boxes.appendChild(newBox);
        }
    });
})

// helper functions

function getNewBox(data) {

    let newBox = document.createElement("div");
    newBox.classList.add("box");

    newBox.innerHTML = `
        <div class="date subtitle">${data.date}</div>
        <div class="word-info">
            <div class="word">Product Title</div>
            <div class="form subtitle">$${data.price}</div>
        </div>
        <div class="buttons">
            <a href="${data.url}" class="btn more-info">Product Page</a>
            <button data-word="${data.url}" class="btn delete">Delete</button>
        </div>`

    return newBox;
}


// events 
setTimeout(() => {
    var deleteBtns = document.querySelectorAll("button.delete");

    console.log(deleteBtns);
    for (const btn of deleteBtns) {
        btn.addEventListener("click", (e) => {
            e.preventDefault();

            e.target.parentElement.parentElement.style.display = "none";
            chrome.storage.sync.get("productsData", function(result) {
                let products = result.productsData;
                
                for (let i = 0; i < deleteBtns.length; i++) {
                    if (e.target = deleteBtns[i]) {
                        var index = i;
                    }
                }
                
                if (deleteBtns.length == 1) {
                    chrome.storage.sync.set({"productsData": []})
                    return;
                }

                products = products.splice(index,1);
                chrome.storage.sync.set({"productsData": products})
            })    
        });
    }
},1600)

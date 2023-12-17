// context menu options
var contextMenuItem = {
    "id": "Save Product",
    "title": "Save Product",
    "contexts": ["selection"]
};

// making the context menu appear on right click
chrome.contextMenus.create(contextMenuItem);
console.log("context menu created");

// initializing products list
var products = [];

// adding an event listener for right click
chrome.contextMenus.onClicked.addListener(function(clickedData) {
    if (clickedData.menuItemId == "Save Product" && clickedData.selectionText) {
        
        var inList = false;
        let price = getSearchableProduct(clickedData.selectionText)
        let date = new Date().toLocaleDateString();
        let pageUrl = clickedData.pageUrl; 

        for (const productObj of products) {
            if (pageUrl == productObj.url) {
                var inList = true;
            }
        }

        if (pageUrl && !inList) {
            products.push({
                price: price,
                date: date, 
                url: pageUrl
            });
        } 

        chrome.storage.sync.set({"productsData": products}, function() {
            let notifOptions = {
                type: "basic",
                iconUrl: "../icons/logo.png",
                title: "Price Decrease!",
                message: `There has been a price decrease in ${clickedData.selectionText} product`,
            }
            if (true) {
                console.log(notifOptions);
                chrome.notifications.clear("textNotif");
                chrome.notifications.create(pageUrl,notifOptions, () => {
                    console.log("Last error:", chrome.runtime.lastError);
                });
            }
            chrome.notifications.getAll((data) => {
                console.log(data);
            })
        })
    }
})


function getSearchableProduct(text) {
    let searchable = text.trim();
    searchable = searchable.replace(" ", "-");

    return searchable;
}
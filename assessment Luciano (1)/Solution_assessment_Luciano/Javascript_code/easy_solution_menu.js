//Easy Solution for the Menu
//I know that the Menu has elements which are links, and those links are inside a td (table data)
//So, to find the Menu, I must firstly find the links.
//The way to find the links (a) is the following:
// .childNode     = img
// .parentElement = b

let ListAs=[]

ListAs=document.querySelectorAll('a');

//function to reduce the List to only the items with 'img' as childNodes
function filterItemsWithImgChildNodes(inputList) {
    var itemsWithImg = [];
    for (var i = 0; i < inputList.length; i++) {
        var item = inputList[i];
        // Check if the item has child nodes and at least one of them is an <img> element
        if (item.childNodes[0].tagName === 'IMG'  && item.parentElement.tagName==='TD')
        {
            itemsWithImg.push(item);
        }
    }
    return itemsWithImg;
}


let NewListAs=filterItemsWithImgChildNodes(ListAs);

//I want to assign role 'navigation' & 'list' to the tbody that contains the Menu
let menu=NewListAs[0].parentElement.parentElement.parentElement;
menu.setAttribute('role','list navigation');
menu.setAttribute('aria-label',"My List Menu");


//I want to assign role 'list element' to each item of the 'Menu'
//So,each parent element of NewListAs has a List item role
for(let i=0;i<NewListAs.length;i++)
{
    NewListAs[i].setAttribute('role','listitem');
}
//Easy Solution for the Headings
//This is an easy solution because I already know 'where the Heading are' 
//For this script, I take advantage of the fact that all the elements are:
//table, tr, td, p , i, b.
//So, I know that the text will be in a paragraph that is inside a table data (td).
//First, I am going to check all the 'td > p' elements


//With this function I eliminate all the <p>&nbsp</p>
function filterList(list) {
    // Convert the list to an array
    let listArray = Array.from(list);

    // Use the filter() method to create a new array with list items that do not have innerHTML as '&nbsp;'
    let filteredList = listArray.filter(function(item) {
        return item.innerHTML.trim() !== '&nbsp;';
    });

    return filteredList;
}

let listItems = document.querySelectorAll('td > p');
let filteredList = filterList(listItems);


//With this function I eliminate all the HTML elements with more than one Node
function filterItemsWithOneChild(list) {
    // Convert the list to an array
    let listItems = Array.from(list);

    // Use the filter() method to get items that have exactly one child
    let itemsWithOneChild = listItems.filter(function(item) {
        return item.childNodes.length === 1;
    });

    // Return a new array with items having only one child
    return itemsWithOneChild;
}

let filteredListWithOneChild=filterItemsWithOneChild(filteredList);

//List with Headings
let ListWithHeading=[];

for(let i=0;i<filteredListWithOneChild.length;i++)
{
    if(filteredListWithOneChild[i].style[0]==='padding-top' || filteredListWithOneChild[i].parentElement.style[0]==='padding-top')
    {
        if(filteredListWithOneChild[i].childNodes[0].tagName==='IMG')
        {
            ListWithHeading.push(filteredListWithOneChild[i].childNodes[0]);
        } else {
            //I want here to store the <b>Citylights Terms and Conditions</b>
            //I need a function to go through all the Nodes from div > font > b 
            ListWithHeading.push(filteredListWithOneChild[i].parentElement.childNodes[0].childNodes[0].childNodes[0])
        }
    }     
}


for(let i=1;i<ListWithHeading;i++)
{
    //I need to assign ARIA-role:'heading' 
    ListWithHeading[i].setAttribute('aria-role','heading');

    //I need to assign ARIA-label:'ListWithHeading[i].innerText'
    if(ListWithHeading[i].aria-label === null)
    {
        let label=ListWithHeading[i].innerText;
        ListWithHeading[i].setAttribute('aria-label',label);
    }
}

console.log(ListWithHeading);






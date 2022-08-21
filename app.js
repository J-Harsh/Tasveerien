const accessKey="ltnyYv8baQoY59OHm860S0th5y-qJjrgarmJxGMJW3I";
const random_photo=`https://api.unsplash.com/photos/random?client_id=${accessKey}&count=24`;
const preBtn=document.querySelector(".pre-btn");
const nxtBtn=document.querySelector(".nxt-btn");
const gallery=document.querySelector('.gallery');
const searchBar=document.querySelector('.search-box');
const headerSec=document.querySelector(".header-content");
const arrowDown= document.querySelector(".arrow-container");
const bar=document.getElementById("search");

let search_photo=``;
let i=0;
var t;
let allImages; //this will store images coming fromt the api
let currentImage=0;

bar.onkeydown=function(e)
{
    let key=e.charCOde || e.keyCode || 0;
    if(key==13)
        e.preventDefault();
}

const getImages = () =>
{
    fetch(random_photo)
    .then(res => res.json())        
    .then(data =>
        {
                allImages=data;
                makeImages(allImages);
            });
}

const searchImages = () => {
    fetch(search_photo)
    .then(res => res.json())        
    .then(data =>
        {
                allImages=data.results;
                makeImages(allImages);
            });
}

const makeImages = (data) => 
{
    while(gallery.firstChild)
    {
        gallery.removeChild(gallery.firstChild);
    }
    if(data.length==0)
    {
        
        if(i!=1){
            gallery.remove();
            document.body.style.overflow="hidden";
            let notFound=document.createElement("h4");
            notFound.innerText="No images found!!\nPlease try again with a different keyword";
            arrowDown.classList.add("hide");
            headerSec.appendChild(notFound);
        }
        i=1;
    }
    data.forEach((item,index) => 
    {
        if(i==1)
        {
            document.querySelector("h4").remove();
            document.body.style.overflow="auto";
            document.body.appendChild(gallery);
            i=0;
        }
        arrowDown.classList.remove("hide");
        let img=document.createElement('img');
        img.src=item.urls.regular;
        img.classList.add("gallery-img");
        gallery.appendChild(img);

        //popup
        img.addEventListener("click", () =>
        {
            currentImage=index;
            showPopup(item);
        });
    });
}

const showPopup= (item) =>
{
    let popup=document.querySelector(".image-popup");
    const viewBtn=document.querySelector(".view-btn");
    const closeBtn= document.querySelector(".close-btn");
    const image=document.querySelector(".large-img");
    arrowDown.classList.add("hide");

    popup.classList.remove("hide");
    viewBtn.href=item.links.html;
    image.src=item.urls.regular;

    closeBtn.addEventListener("click", () =>
    {
        popup.classList.add("hide");
    });

    document.addEventListener("click", (e)=>
    {
        if(!(popup.classList.contains("hide")))
        {
            let chk=popup.contains(e.target);
            let ichk=e.target.classList.contains("gallery-img");
            if(chk==false && ichk==false)
            {
                popup.classList.add("hide");
                arrowDown.classList.remove("hide");
            }
        }
    });
}

function searchCall()
{
    if(!searchBar.value)
    {
        document.querySelector("h4").remove();
        document.body.style.overflow="auto";
        document.body.appendChild(gallery);
        getImages();
        i=0;
        return;
    }
    let searchQuery=searchBar.value;
    searchQuery=searchQuery.trim();
    search_photo=`https://api.unsplash.com/search/photos?client_id=${accessKey}&query=${searchQuery}&per_page=24`;
    searchImages();
}

searchBar.addEventListener("keyup",()=>
{
    if (t)
  {
    clearTimeout( t );
    t = setTimeout( searchCall, 500 );
  }
  else
  {
    t = setTimeout( searchCall, 500 );
  }
});

preBtn.addEventListener("click", () =>
{
    if(currentImage>0)
    {
        currentImage--;
        showPopup(allImages[currentImage]);
    }
});

nxtBtn.addEventListener("click", () =>
{
    if(currentImage < allImages.length-1)
    {
        currentImage++;
        showPopup(allImages[currentImage]);
    }
});


getImages();

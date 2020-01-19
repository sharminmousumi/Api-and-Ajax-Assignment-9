
let key = 'F7pUW';  // once you have a key, it is ok to store it in a variable
const baseUrl = 'https://www.forverkliga.se/JavaScript/api/crud.php?key=' + key;
const apiAttempt = 5;
//let message  = document.getElementById("message");

function getFormData(elements, form){
  const kvpairs = [];
  for ( let i = 0; i < elements.length; i++ ) {
      for(let j = 0; i < form.elements.length; j++){
          let e = form.elements[j];
          if (e.name == elements[i]){
            kvpairs.push(encodeURIComponent(e.name) + "=" +              encodeURIComponent(e.value));
            break;
          }
         }
  }
  const queryString = kvpairs.join("&");
  return queryString;

}


function addBook(e){
  const message =  e.closest('form').getElementsByClassName("message");
  const elements = ["author","title"];
  const formdataQueryString = getFormData(elements, e.closest('form'))
  const viewRequest = baseUrl + '&op=insert&' + formdataQueryString;
  fetch_retry(viewRequest, apiAttempt)
   .then(function(data){
    if(data.status == 'success') { 
      message[0].style.color = "green";
      message[0].innerText = "New book added with id " + data.id;
    }else{
      message[0].innerText = data.message;
      message[0].style.color = "red";
    }
  })
    .catch(function(error) { 
  });  

}

function deleteBook(e){
  const message =  e.closest('form').getElementsByClassName("message");
  const elements = ["id"];
  const formdataQueryString = getFormData(elements, e.closest('form'))
  const viewRequest = baseUrl + '&op=delete&' + formdataQueryString;
  fetch_retry(viewRequest, apiAttempt)
   .then(function(data){
    if(data.status == 'success') { 
      message[0].style.color = "green";
      message[0].innerText = "Book has been deleted sucessfully!";
    }else{
      message[0].innerText = data.message;
      message[0].style.color = "red";
    }
  })
    .catch(function(error) { 
    console.log(error);
  }); 
}

function updateBook(e){
  const message =  e.closest('form').getElementsByClassName("message");
  const elements = ["id","title","author"];
  const formdataQueryString = getFormData(elements, e.closest('form'))
  const viewRequest = baseUrl + '&op=update&' + formdataQueryString;
  fetch_retry(viewRequest, apiAttempt)
   .then(function(data){
    if(data.status == 'success') { 
      message[0].style.color = "green";
      message[0].innerText = "Book has been updated sucessfully!";
    }else{
      message[0].innerText = data.message;
      message[0].style.color = "red";
    }
  })
    .catch(function(error) { 
    console.log(error);
  }); 
}

function viewBooks(e){
  const message =  e.closest('form').getElementsByClassName("message");
  const viewBookTable = document.getElementsByClassName("view-book");
  viewBookTable[0].children[1].innerHTML = "";
  const viewRequest = baseUrl + '&op=select';
  fetch_retry(viewRequest, apiAttempt)
   .then(function(data){
    if(data.status == 'success') { 
      let outputs = "";
      data.data.forEach(function(book){
          outputs += `<tr><td>${book.id}</td><td>${book.title}</td><td>${book.author}</td><td>${book.updated}</td></tr>`
      });
      if(!outputs){
        outputs = "No book availble!"
      }
      viewBookTable[0].children[1].innerHTML = outputs;
      viewBookTable[0].style.display = "table";
      message[0].innerText = "";
    }else{
      message[0].innerText = data.message;
      message[0].style.color = "red";
    }
  })
    .catch(function(error) { 
    console.log(error);
  }); 
}

function fetch_retry(url, n) {
  return fetch(url).catch(function(error) {
      if (n === 1) return error;
      return fetch_retry(url, n - 1);
  }).then(function(resp){
        return resp.json();
  }).then(function(data){
      if(n === 1) return data;
      if(data.status == 'success') {  
         return data;
      }else {
        return fetch_retry(url, n - 1);
      }
  });
}

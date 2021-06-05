// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
var firebaseConfig = {
    apiKey: "AIzaSyDMbejPbMli6gf3i5OUGq09C-HMY9NnMFI",
    authDomain: "apaan-dbc16.firebaseapp.com",
    databaseURL:"https://apaan-dbc16-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "apaan-dbc16",
    storageBucket: "apaan-dbc16.appspot.com",
    messagingSenderId: "412262375065",
    appId: "1:412262375065:web:af929785b8e1c873e5e208",
    measurementId: "G-CQ907QF5E6"
  };
  // Initialize Firebase
  if(!firebase.apps.length){
    firebase.initializeApp(firebaseConfig);
    firebase.analytics();
  }
  
  var database = firebase.database();
  var storage = firebase.storage();
  
  //read
  // database.ref("/").on("value", (data)=>{
  //     const dt = data.val();
  //     console.log(dt);
  // })
  
  //write
  function kirim(){
    var date = new Date().getTime();
    var data = {iden: date,
    nama: document.getElementById("nama").value,
    harga: document.getElementById("harga").value,
    deskripsi: document.getElementById("deskripsi").value}
    database.ref(`/makanan/${date}`).set(data).then(console.log('kirimed'))
  }
  
  //read
  database.ref("/makanan").on("value", (dtman)=>{
    let tampil = dtman.val();
    var card = document.getElementById("card-menu");
    let dataht = "";
    // var kunci = document.getElementById("identitas").value = dtman.val().iden;
    for(key in tampil){
      let a = tampil[key].nama;
      let b = tampil[key].harga;
      let c = tampil[key].deskripsi;
      let d = tampil[key].iden;
      dataht += `<div class="col l4 s12 m6">
                    <div class="card">
                        <div class="card-image bluish">
                            <img src="">
                            <span class="card-title pgn right-align">Rp. ${b}</span>
                        </div>
                        <div class="card-content">
                            <span class="card-title">${a}</span>
                            <p>${c}</p>
                        </div>
                        <div class="card-action">
                            <a href="edit_page.html" onclick="edit(${key})">EDIT</a>
                            <a class="pinggir"  onclick="hapus(${key})">DELETE</a>
                        </div>
                    </div>
                </div>`;
      console.log(card);
    }
    card.innerHTML = dataht
  })
  
  function hapus(key){
    database.ref("/makanan/"+key).remove();
  }
  // database.ref("/makanan").remove();
  
  function edit(key){
    database.ref("/makanan/"+key).on("value", (datae)=>{
      let tampl = datae.val();
      document.getElementById("identitas").value = datae.val().iden;
      document.getElementById("nama").value = datae.val().nama;
      document.getElementById("harga").value = datae.val().harga;
      document.getElementById("deskripsi").value = datae.val().deskripsi;
      
      database.ref(`/makanan/${key}`).update({
        iden: document.getElementById("identitas").value,
        nama: document.getElementById("nama").value,
        harga: document.getElementById("harga").value,
        deskripsi: document.getElementById("deskripsi").value
    
        
      });
  
      console.log(key);
  
    });
  }
  
  function tombolEdit(){
    database.ref(`/makanan/${key}`).update({
      iden: document.getElementById("identitas").value,
      nama: document.getElementById("nama").value,
      harga: document.getElementById("harga").value,
      deskripsi: document.getElementById("deskripsi").value
  
      
    });
  }
  
  //login
  function login(){
    let email = document.getElementById("email").value;
    let password = document.getElementById("password").value;
    firebase.auth().setPersistence(firebase.auth.Auth.Persistence.SESSION).then(() => {
      return firebase.auth().signInWithEmailAndPassword(email, password)
      .then(success => {
        console.log("Hey");
      })
      .catch(error => {
        console.log("Gagal");
      })
    }).catch(error => {
      console.log(error.message);
    })
  
  
    // firebase.auth().signInWithEmailAndPassword(email, password)
    // .then((userCredential) => {
    //   // Signed in
    //   var user = userCredential.user;
    //   // ...
    // })
    // .catch((error) => {
    //   var errorCode = error.code;
    //   var errorMessage = error.message;
    // });
  }
  
  // logout
  function logout(){
    firebase.auth().signOut().then(success =>{
      console.log("logout");
    })
    
  }
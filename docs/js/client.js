// CLIENT SIDE
// const button = document.querySelector(".btn");
// button.addEventListener('click', clientLogin());

let temp = '';
let daftarTemp = []; //temporary chart

const clientAddPesanan = (item)=>{
    let urlParam = new URLSearchParams(window.location.search);
    let id = urlParam.get("id");
    let itemIn = checkIdIn(item)
    if(daftarTemp.length == 0){
    daftarTemp = [
        {id: item, qty: 1}
    ]}
    else if(itemIn[0]){ //??????
        let theItem = daftarTemp[itemIn[1]]
        daftarTemp[itemIn[1]] = {id: item, qty: theItem.qty+1 }
    }
    else{
        daftarTemp.push({id: item, qty: 1})
    }
    
    database.ref(`/client/${id}`).update({
        pesanan: daftarTemp
    }
    );            
}
const checkIdIn = (item) =>{ //check id sudah di dalam pesanan
    let status = false;
    let num = 0;
    for(let i=0; i<daftarTemp.length; i++){
        if(daftarTemp[i].id == item){
            status = true
            num = i
        }
    }
    return [status, num]
}

const clientLogin = ()=>{
    var date = new Date();
    let namaClient = document.getElementById("nama-client").value;
    let noMeja = document.getElementById("meja-client").value;
    let iden = `${date.getTime()}-${noMeja}`;
    let tanggal = `${date.getFullYear()}${date.getMonth()}${date.getDate()}`;
    temp = `${tanggal}-${iden}`;

    database.ref(`/client/${tanggal}-${iden}`).set(
        {
            id: iden,
            meja: noMeja,
            nama: namaClient,
            pesanan: [], // banyanya id menu, harga
            total: 0, // harga
            status: 1
        }

    ).then(()=>{
        //wait, 1 game. ngko voice wae
        M.toast({html: 'Berhasil Masuk', classes:'blue'})
        window.open(`/admin/docs/client_akses.html?id=${temp}`,"_self");
    });

}


const clientAkses = ()=>{
    let urlParam = new URLSearchParams(window.location.search);


    if(!urlParam.has("id")){
        window.open("/admin/docs/client_login.html","_self");
    }
    let id = urlParam.get("id");

    fetchDataClient();  //ambil daftar menu
    fetchClientChart(id); //list pesanan user

}

//read
//assign this to a function, so this function only can be triggered at spesific page
const fetchDataClient = ()=>{
    database.ref("/admin/menu").on("value", (dtman)=>{
        let tampil = dtman.val();
        var card = document.getElementById("card-menu-client");
        let dataht = "";
        // var kunci = document.getElementById("identitas").value = dtman.val().iden;
        for(key in tampil){
            let a = tampil[key].nama;
            let b = rupiah(tampil[key].harga);
            let c = tampil[key].deskripsi;
            let d = tampil[key].iden;
            let e = tampil[key].urlImg;
            let f = tampil[key].docName;
            dataht += `<div class="col l4 s12 m6">
                        <div class="card"> 
                            <div class="card-image bluish">
                                <img id="img-${d}" src="${e}">
                                <span id="harga-${d}" class="card-title pgn right-align">Rp. ${b}</span>
                            </div>
                            <div class="card-content">
                                <span id="nama-${d}" class="card-title">${a}</span>
                                <p>${c}</p>
                            </div>
                            <div class="card-action">
                                <a class="waves-effect waves-light" onclick="clientAddPesanan('${d}')">Pesan</a>
                            </div>
                        </div>
                    </div>`;
            console.log(card);
        }
        card.innerHTML = dataht
  })        
}



const fetchClientChart = (id)=>{
    let canvas = document.querySelector("#modal1 .modal-content");
    var date = new Date();
    let tanggal = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
    database.ref(`/client/${id}`).on("value", (snapshoot)=>{
        let dataPesanan = snapshoot.val();
        console.log(dataPesanan);
        if(!dataPesanan.pesanan){
            canvas.innerHTML = `
            <h4>Anda belum memesan</h4>
            `
        }
        else{
            let susunan =  "";
            susunan += `
            <h4>Daftar Pesanan</h4>
            <div class="container">`
            for (const key in dataPesanan.pesanan) {
                let iden = dataPesanan.pesanan[key].id;
                let idImg = `img-${iden}`
                console.log(idImg);
                let idNamaMenu = `nama-${iden}`
                let idHargaMenu = `harga-${iden}`;

                let urlImg = document.getElementById(idImg).src;
                let namaMenu = document.getElementById(idNamaMenu).innerText;
                let hargaMenu = document.getElementById(idHargaMenu).innerText;
                // let deskripsiMenu = document.querySelector("#",idNamaMenu," p").innerText;

                // let total = hargaMenu;
                // console.log(total);
                susunan += `
                <div class="row">
                    <div class="col m5" style="background: url(${urlImg}); background-size: cover; height: 150px;">
                        <!-- <img src="/admin/docs/images/cut19_worldend-600x401.jpg" alt=""> -->
                    </div>
                    <div class="col m4">
                        <p>${namaMenu}</p>
                        <!-- <p></p> -->
                        <p>${hargaMenu}</p>
                    </div>
                    <div class="col m3">
                        <input id="qty-${iden}" type="number" min="1">
                        <p>harga total</p>
                    </div>
                </div>`
                
                
            }

            susunan += `</div>`
            canvas.innerHTML = susunan;
        }
    })
}

const getItem = (id)=>{
    
    return {
        urlImg: document.getElementById(`img-${id}`).src,
    }
}
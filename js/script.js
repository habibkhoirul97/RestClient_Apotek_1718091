const baseUrl = "http://localhost/Rest_Server_Apotek/";
const allEndPoin = `${baseUrl}obat`;

const contents = document.querySelector("#content-list");
const tableRows = document.querySelector("#tableBody");
const title = document.querySelector(".card-title");

function getAllObat() {
    title.innerHTML = "Daftar Obat";

    fetch(allEndPoin)
        .then(response => response.json())
        .then(resJson => {
            let datas = "";
            resJson.data.forEach(data => {
                datas += `
                    <tr>
                        <td>${data.id}</td>
                        <td>${data.nama_obat}
                        <td>Obat ${data.jenis}</td>
                        <td>Rp.${data.harga_jual}</td>
                        <td>Rp.${data.harga_modal}</td>
                        <td>${data.stok} pcs</td>
                        <td>
                            <a onclick="editObat(${data.id})" class="waves-effect waves-light btn-small">
                                <i class="material-icons">create</i>
                            </a>
                            <a onclick="deleteObat(${data.id})" class="waves-effect waves-light btn-small red">
                                <i class="material-icons">delete</i>
                            </a>
                        </td>
                    </tr>`
            });
            tableRows.innerHTML = `${datas}`;
        }).catch(err => {
            console.error(err);
        })
}

function getObatByType(tipeObat) {
    title.innerHTML = `Daftar Obat ${tipeObat}`;
    fetch(allEndPoin)
        .then(response => response.json())
        .then(resJson => {
            let datas = "";
            resJson.data.forEach(data => {
                if(data.jenis == tipeObat) {
                datas += `
                    <tr>
                        <td>${data.id}</td>
                        <td>${data.nama_obat}
                        <td>Obat ${data.jenis}</td>
                        <td>Rp.${data.harga_jual}</td>
                        <td>Rp.${data.harga_modal}</td>
                        <td>${data.stok} pcs</td>
                        <td>
                            <a onclick="editObat(${data.id})" class="waves-effect waves-light btn-small">
                                <i class="material-icons">create</i>
                            </a>
                            <a onclick="deleteObat(${data.id})" class="waves-effect waves-light btn-small red">
                                <i class="material-icons">delete</i>
                            </a>
                        </td>
                    </tr>`
                }
            });
            tableRows.innerHTML = `${datas}`;
        }).catch(err => {
            console.error(err);
        })
}

function saveData() {
    let methodRequest = 'POST';
    let id = document.querySelector('#idInput').value;
    let nama = document.querySelector('#namaInput').value;
    let stok = document.querySelector('#stokInput').value;
    let harga_modal = document.querySelector('#harga_modalInput').value;
    let harga_jual = document.querySelector('#harga_jualInput').value;
    let jenis = 'Luar';
    
    if (id.length > 0) methodRequest = 'PUT';
    if (document.querySelector('#rbMinum').checked) jenis = document.querySelector('#rbMinum').value;

    fetch(allEndPoin, { 
            method: methodRequest,
            body: new URLSearchParams({
                    "id": id,
                    "nama_obat": nama,
                    "harga_jual": harga_jual,
                    "harga_modal": harga_modal,
                    "stok": stok,
                    "jenis": jenis
                }),
            headers: {
               'Content-Type': 'application/x-www-form-urlencoded'
            } 
        })
        .then(response => response.json())
        .then(resJson => {
            if(resJson.status) {
                M.toast({html: resJson.msg});
                cancelForm();
                refreshTable();

            } else {
                M.toast({html: resJson.msg, classes: 'red'});
            }

        }).catch(err => {
            console.error(err);
        })
}

function editObat(id) {
    fetch(allEndPoin+'?id='+id)
        .then(response => response.json())
        .then(resJson => {
            if(resJson.status) {
                resJson.data.forEach(data => {
                    document.querySelector('#idInput').value = data.id;
                    document.querySelector('#namaInput').value = data.nama_obat;
                    document.querySelector('#stokInput').value = data.stok;
                    document.querySelector('#harga_modalInput').value = data.harga_modal;
                    document.querySelector('#harga_jualInput').value = data.harga_jual;
                    if(data.jenis == 'Minum') {
                        document.querySelector('#rbMinum').checked = true;
                        document.querySelector('#rbLuar').checked = false;
                    }
                    else {
                        document.querySelector('#rbLuar').checked = true;
                        document.querySelector('#rbMinum').checked = false;
                    }
                });
                showForm();
                title.innerHTML = "Edit Data Obat";

            } else {
                M.toast({html: resJson.msg, classes: 'red'});
            }
        }).catch(err => {
            console.error(err);
        })
}

function deleteObat(id) {
    fetch(allEndPoin, { 
        method: 'DELETE',
        body: new URLSearchParams({
                "id": id,
            }),
        headers: {
           'Content-Type': 'application/x-www-form-urlencoded'
        } 
    })
    .then(response => response.json())
    .then(resJson => {
        if(resJson.status) {
            M.toast({html: resJson.msg});
            refreshTable();

        } else {
            M.toast({html: resJson.msg, classes: 'red'});
        }

    }).catch(err => {
        console.error(err);
    })
}

function hideForm() {
    title.innerHTML = "Daftar Obat";
    document.querySelector('#formObatWrapper').style.display = "none";
    document.querySelector('#btnAdd').style.display = "block";
    document.querySelector('#tabelObat').style.display = "";
    document.querySelector('#idInput').value = '';
}

function showForm() {
    title.innerHTML = "Tambah Data Obat";
    document.querySelector('#formObatWrapper').style.display = "block";
    document.querySelector('#btnAdd').style.display = "none";
    document.querySelector('#tabelObat').style.display = "none";
}

function cancelForm() {
    title.innerHTML = "Daftar Obat";
    document.querySelector('#formObat').reset();
    document.querySelector('#idInput').value = '';
    hideForm();
}

function refreshTable() {
    var page = window.location.hash.substr(1);
    if (page === "" || page === "!") page = "daftarObat";
    loadPage(page);
}

function loadPage(page) {
    switch (page) {
        case "daftarObat":
            getAllObat();
            break;
        case "daftarObatLuar":
            getObatByType('Luar');
            break;
        case "daftarObatMinum":
            getObatByType('Minum');
            break;
    }
}

document.addEventListener('DOMContentLoaded', function () {
    cancelForm();
    var elems = document.querySelectorAll('.sidenav');
    var instances = M.Sidenav.init(elems);

    document.querySelectorAll(".sidenav a, .topnav a").forEach(elm => {
        elm.addEventListener("click", evt => {
            let sideNav = document.querySelector(".sidenav");
            M.Sidenav.getInstance(sideNav).close();
            page = evt.target.getAttribute("href").substr(1);
            loadPage(page);
        })
    })
    var page = window.location.hash.substr(1);
    if (page === "" || page === "!") page = "daftarObat";
    loadPage(page);
});
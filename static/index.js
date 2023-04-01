document.getElementById("downloadables").onchange = ()=>{
    console.log(document.getElementById("downloadables").value);
}

function download_file(){
    document.getElementById("download_btn").className = "yes_anim";
    document.getElementById("download_btn").disabled = true;

    let xml_svr = new XMLHttpRequest();
    xml_svr.open("POST", "/downloadFile");
    xml_svr.responseType = "blob";
    xml_svr.onload = ()=>{
        let a_ele = document.createElement("a");
        a_ele.href = URL.createObjectURL(xml_svr.response);
        a_ele.download = document.getElementById("downloadables").value;
        a_ele.click();
        document.getElementById("download_btn").className = "no_anim";
        document.getElementById("download_btn").disabled = false;
    }
    xml_svr.send(JSON.stringify({"name": document.getElementById("downloadables").value}));
}
document.getElementById("download_btn").onclick = download_file;

function upload_file(){
    let input_ele = document.createElement("input");
    input_ele.type = "file";
    input_ele.click();
    input_ele.onchange = ()=>{
        document.getElementById("upload_btn").className = "yes_anim";
        document.getElementById("upload_btn").disabled = true;

        let file_ = input_ele.files[0]
        let file_meta_data_ = {"name": file_.name, "type": file_.type, "size": file_.size}

        let xml_svr = new XMLHttpRequest();
        xml_svr.open("POST", "/createFile");
        xml_svr.onload = ()=>{
            let i = 0;
            let chunk_size = 10000000;
            // Math.round(file_.size/50)+1
            function startWriter(){
                let xml_svr2 = new XMLHttpRequest();
                xml_svr2.open("POST", "/writeFile");
                xml_svr2.onload = ()=>{
                    if (xml_svr2.responseText != "OK"){
                        alert("Failed");
                        return;
                    }
                    else if (xml_svr2.responseText == "OK" && i >= file_.size){
                        load_downloadables();
                        document.querySelector("#upload_btn #percent").innerHTML = ``;
                        document.getElementById("upload_btn").className = "no_anim";
                        document.getElementById("upload_btn").disabled = false;
                        return;
                    }
                    i += chunk_size;
                    document.querySelector("#upload_btn #percent").innerHTML = `ED ${Math.round(i/file_.size*100)}%`;
                    startWriter();
                }
                xml_svr2.send(file_.slice(i, i+chunk_size));
            }
            startWriter();
        }
        xml_svr.send(JSON.stringify(file_meta_data_));

        console.log(file_);
    }
}
document.getElementById("upload_btn").onclick = upload_file;


function remake_downloadList(options_list){
    document.getElementById("downloadables").remove();
    
    let ele_ = document.createElement("select");
    let default_option = document.createElement("option");
    default_option.value = "NONE";
    default_option.innerText = "File List";
    default_option.selected = true;
    default_option.disabled = true;
    ele_.appendChild(default_option);

    ele_.id = "downloadables";
    for (let i = 0; i < options_list.length; i++) {
        let option_ = document.createElement("option");
        option_.value = options_list[i];
        option_.text = options_list[i];
        ele_.appendChild(option_);
    }
    document.querySelector(".can_download .list").appendChild(ele_);

}

function load_downloadables(){
    let xml_svr = new XMLHttpRequest();
    xml_svr.open("POST", "/listDownloadable");
    xml_svr.onload = ()=>{
        remake_downloadList(JSON.parse(xml_svr.responseText)["files"]);
    }
    xml_svr.send("DATA");
}
load_downloadables();
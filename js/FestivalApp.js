window.log = console.log;

class FestivalApp {
    constructor(){

        this.$content = $("#content");
        this.$paging = $("#paging");
        this.$modal = $('#modal');
        this.xml;
        this.datas;
        this.init();
    }

    async init(){
        this.xml = await this.readFestivals();
        this.datas = this.generateDatas();
        this.render();
        this.addEvent();
    }

    readFestivals(){
        return $.ajax('/xml/festivalList.xml');
    }

    generateDatas(){

        return Array.from(this.xml.querySelectorAll("item")).map( item => {    
            let sn = item.querySelector("sn").innerHTML;
            let no = item.querySelector("no").innerHTML;
            let nm = item.querySelector("nm").innerHTML;
            let area = item.querySelector("area").innerHTML;
            let location = item.querySelector("location").innerHTML;
            let dt = item.querySelector("dt").innerHTML;
            let cn = item.querySelector("cn").innerHTML;
            let imgs = Array.from(item.querySelectorAll("images > image")).map(x => x.innerHTML);
            let imagePath = `/xml/festivalImages/${sn.padStart(3, '0')}_${no}`;
            
            return { sn, no, nm, area, location, dt, cn , imgs, imagePath };
        });
    }

    render(){
        let qs = location.search.substring(1, location.search.length);
        let qsObj = {};
        qs.split("&").forEach(x=>{
            let key = x.split("=")[0];
            let value = x.split("=")[1];
            qsObj[key] = value;
        });
        
        let page = qsObj.page * 1;
        page = isNaN(page) || !page || page < 1 ? 1 : page;
        
        let type = qsObj.searchType;
        type = ["album","list"].includes(type) ? type : "album";
        
        const PAGE_CNT = type == "album" ? 6 : 10;
        const PAGE_SCNT = 5;
        let totalPage = Math.ceil(this.datas.length / PAGE_CNT);
        let currentChapter = Math.ceil(page / PAGE_SCNT);

        let start = (currentChapter - 1) * PAGE_SCNT + 1;
        if(start < 1) start = 1;
        let end = currentChapter * PAGE_SCNT;
        if(end > totalPage) end = totalPage;
        
        let prev = start - 1 > 1;
        let next = end + 1 < totalPage;
        
        let si = (page - 1) * PAGE_CNT;
        let si_e = si + PAGE_CNT;
        let arr = this.datas.slice( si , si_e );
        let html = "";
        for(let i = start; i <= end; i++) html += `<a class="page_item page_${ i === page ? "active" : "normal" }" href="?searchType=${type}&page=${i}">${i}</a>`;
        html = `<a class="page_item page_${ prev ? "active" : "normal" }" href="?searchType=${type}&page=${ prev ? (currentChapter - 2) * PAGE_CNT + 1 : 1  }"><i class="fa fa-angle-left"></i></a>
                ${html}
                <a class="page_item page_${ next ? "active" : "normal" }" href="?searchType=${type}&page=${ next ? currentChapter * PAGE_CNT : totalPage  }"><i class="fa fa-angle-right"></i></a>`;
        this.$paging.html(html);
        
        if(type === "album") this.drawAlbum(arr);
        else this.drawList(arr);
        log(arr);
    }

    async drawAlbum(arr){
        
        let last_item = this.datas[this.datas.length-1];
        let src = last_item.imagePath + "/" + last_item.imgs[0];
        let img = await this.loadImage(src);
        src = img.src;

        let html = `<div class="row">
                        <div class="col-4">
                            <img src="${src}" alt="img" title="img" id="last_item_img">
                        </div> 
                        <div class="col-8">
                            <div class="row">
                                <h3 id="last_item_title" class="bold">${last_item.nm}</h3>
                                <p class="fosi-1 color-333030" id="last_item_info">
                                    ${last_item.cn}
                                </p>
                                <button class="btn btn-primary" id="last_item_modal">자세히 보기</button>
                            </div>
                        </div>
                    </div>`;
        //

        let inner = arr.map( festival =>{
            return `
                <div class="col-4 album_item border" data-sn="${ festival.sn }">
                    <img src="${ festival.imagePath  + "/" + festival.imgs[0] }" alt="img" title="img" class="img-parent-width">
                    <h4 class="mt-2">${ festival.nm }</h4>
                    <p class="color-333030">${ festival.dt }</p>
                    <div class="album_img_cnt">${ festival.imgs.length }</div>
            </div>
            `;
        });

        html += `<div class="row mt-4 mb-4">
            ${inner.join('')}
        </div>`;

        this.$content.html(html);
        this.$content.find("img").on("error",(e)=>{
            $(e.target).attr("src", 'imgs/img_no.png');
            $(e.target).parent().find(".album_img_cnt").remove();
        });
        

    }

    loadImage(src){
        return new Promise(( res , rej )=>{

            let img = new Image();
            img.src = src;
            img.addEventListener("load",(e)=>{
                res(img);
            });

            img.addEventListener("error",(e)=>{
                img.src = "/imgs/img_no.png";
            });

        });
    }

    drawList(arr){

    }

    addEvent(){
        this.$content.on("click", ".col-4", this.itemClickEventHandler);

        

    }

    itemClickEventHandler = e => {

        let sn = e.currentTarget.dataset.sn;
        let festival = this.datas.find(x=> x.sn === sn);

        let option = {
            show : { effect : "fade", duration : 200 },
            hide : { effect : "fade", duration : 200 }
        };
        this.$modal.attr("title", festival.nm);
        this.$modal.dialog(option);

    }
}

window.addEventListener("load",(e)=>{
    window.festivalApp = new FestivalApp();
});

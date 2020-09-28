window.log = console.log;

class FestivalApp {
    constructor(){

        this.$content = $("#content");
        this.$paging = $("#paging");
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
        let arr = qs.split("&").map(x=>{
            let key = x.split("=")[0];
            let value = x.split("=")[1];
            
        });
        log(arr);
        
        
        
    }

    addEvent(){

    }
}

window.addEventListener("load",(e)=>{
    window.festivalApp = new FestivalApp();
});

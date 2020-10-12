window.log = console.log;

class ExcApp {

    constructor(){
        this.data;
        this.$list = $(".exc_list");
        this.$btn = $("#exc_btn");
        this.allShowed = false;

        this.init();
    }

    loadData(){
        return $.ajax("/restAPI/currentExchangeRate.php");
    }

    saveLocal(){
        let obj = {
            scrollTop : $(window).scrollTop(),
            showAll : this.allShowed
        };
        let str = JSON.stringify(obj,null,0);
        window.localStorage.data = str;
    }

    loadLocal(){
        if(window.localStorage.data){
            let data = JSON.parse(window.localStorage.data);
            this.allShowed = data.showAll;
            setTimeout(() => {
                window.scrollTo(0, data.scrollTop );
            }, 1);
        }
    }

    async init(){
        this.data = await this.loadData();
        this.loadLocal();
        this.render();
        this.addEvent();
    }

    render(){
        log(this.data);

        let arr = this.data.items.slice(0,  this.allShowed ? this.data.items.length : 10 );
        this.$list.html(arr.map( item => this.makeTemplate( item ).outerHTML).join(''));
        
    }

    makeTemplate(item){
        let div = document.createElement("div");
        div.classList.add("col-4");
        div.classList.add("exc_item");
        div.classList.add("border");
        if(item.result === 0) div.classList.add("high");
        
        div.innerHTML = `
        <strong>국가/통화명 : ${item.cur_nm}</strong>
        <p>결과 : ${item.result}</p>
        <p>통화 코드 : ${item.cur_unit}</p>
        <p>송금 받으 실때 : ${item.tts}</p>
        <p>송금 보낼실때 : ${item.ttb}</p>
        <p>매매 기준율 : ${item.deal_bas_r}</p>
        <p>장부가격 : ${item.bkpr}</p>
        <p>년환가료율 : ${item.yy_efee_r}</p>
        <p>10일환가료율 : ${item.ten_dd_efee_r}</p>
        <p>매매 기준율 : ${item.kftc_bkpr}</p>
        <p>장부가격 : ${item.kftc_deal_bas_r}</p>
        `;
        return div;
    }

    addEvent(){
        this.$btn.on("click", this.renderMoreItem);
        window.addEventListener("scroll", this.windowScrollEventHandler);
    }

    windowScrollEventHandler = e => {

        let tip = $('body').height();
        let scrollTop = $(window).scrollTop();
        let scrollBottom = scrollTop + $(window).height();
        if(tip === scrollBottom) this.renderMoreItem();
        this.saveLocal();
    }

    renderMoreItem = e => {

        if(this.allShowed) return;
        let arr = this.data.items.slice(10, this.data.length );
        this.$list.append(arr.map( item => this.makeTemplate( item ).outerHTML).join(''));
        this.allShowed = true;
        
    }

}


window.addEventListener("load",()=>{
    window.excApp = new ExcApp();
});

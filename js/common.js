window.log = console.log;

window.addEventListener("load",()=>{

    let $modal = $("#way_modal");

    document.querySelector('#find_way').addEventListener("click",(e)=>{

        e.preventDefault();
        e.stopPropagation();

        let timeout = false;

        setTimeout(() => {
            if(!timeout){
                alert("찾아오시는 길을 표시할 수 없습니다.");
                timeout = true;
            }
        }, 1000);

        $.ajax({
            url:"/location.php",
            success : (e)=>{
                if(timeout === false){
                    timeout = true;
                    $modal.html(e);
                    $modal.dialog();   
                }
            }
        });
        

    });

});
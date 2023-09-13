(function () {
    debugger;
    'use strict'
    var href = window.location.href

    function intervalExecuteUntil(callback, internal, maxCount) {
        let count = 0
        let t = setInterval(() => {
            count += 1
            try {
                callback()
                clearInterval(t)
            } catch (e) {
                if (count >= maxCount) {
                    clearInterval(t)
                }
            }
        }, internal)
    }

    if (href.indexOf("xincanshu") >= 0) {
        //xincanshu
        var wrapper = document.getElementById("chart-wrapper")
        wrapper.style.filter = 'blur(0px)'

        var logintishi = document.querySelector('div[class^="denglu"]')
        logintishi.style.display = 'none'

        var zheceng = document.querySelector('div[class^="zheceng"]')
        zheceng.style.display = 'none'
        return
    } else if (href.indexOf("zhihu") >= 0) {
        //zhihu
        intervalExecuteUntil(() => {
            //登录modal
            $('.Modal-closeButton').click()
            $('style').get(0).append(
                //右侧赞同与分享
                ".Post-SideActions{right:0 !important}"
                //右下角登录框
                + ".css-1ynzxqw{display:none !important}"
                //文章宽度
                + ".Post-RichTextContainer{width: 80% !important}"
                //上方悬停
                + ".Sticky.is-fixed{position:absolute !important}"
                //下方悬停
                + ".RichContent-actions{display:none !important}"
                //首图
                + ".css-78p1r9{display:none !important}"
                //大纲
                + ".css-l44lgl{left:0px !important}"
                + ".isCatalogV2{left:0 !important}"
                + ".css-mop3o9.Catalog-FirstLevelTitle::before,.css-amfnkp.Catalog-FirstLevelTitle::before{left:17px !important}"
                + ".css-mop3o9.Catalog-FirstLevelTitle::after,.css-amfnkp.Catalog-FirstLevelTitle::after{left:20px !important}"
                + ".css-wgpue5{justify-content: start !important; background-color:rgb(255 255 255 / 0%) !important; box-shadow:none !important}"
                + ".css-hvuawc:hover{background-color: rgba(230, 230, 230, 0.5) !important;backdrop-filter: blur(5px) !important;}"
            )
            $(".css-l44lgl").appendTo($("#root"));
        }, 500, 10);
        return
    } else if (href.indexOf("devops.aliyun.com/projex/project/") >= 0) {
        //云效 projectx
        //关联codeUp展示样式
        let showCodeRepo = function(){
            console.log('showCodeRepo')
            let findFlag = false;
            if(document.querySelector('.codeRepo') !== null){
                return;
            }
            document.querySelectorAll('[class^=relateCodeLib--nameInfo').forEach((item) => {
                let codeRepo = item.href.match(/https:\/\/.*.aliyun.com\/.*?\/base\/(.*)\/merge_request.*/)[1]
                if (codeRepo !== null && codeRepo !== '' && codeRepo !== undefined) {
                    findFlag = true;
                }
                let codeRepoEle = item.nextElementSibling.firstChild
                codeRepoEle.textContent = codeRepo
                codeRepoEle.classList.add('codeRepo')
                codeRepoEle.style.overflow = 'hidden'
            })
            //如果findFlag为false,则抛出异常
            if (!findFlag) {
                throw new Error('not found element, wait for next time')
            }
        }
        
        window.addEventListener("hashchange", function (event) {
            intervalExecuteUntil(() => {
                showCodeRepo();
            }, 200, 10)
        });

        intervalExecuteUntil(() => {
            showCodeRepo();
        }, 2000, 30)
    } else if(href.indexOf("colab.research.google.com") >=0){
        //点击connect,防止colab断开
        setInterval(() => {
            console.log("Connect pushed"); 
            document.querySelector("#top-toolbar > colab-connect-button").shadowRoot.querySelector("#connect").click
        }, 1000 * 60);
    } else if(href.indexOf("bing.com/search") >=0){
        //search input框 去掉type
        document.querySelector("#sb_form_q").removeAttribute("type")
    }

})()

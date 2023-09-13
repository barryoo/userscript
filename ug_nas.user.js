// ==UserScript==
// @name         ugreen nas
// @namespace    http://tampermonkey.net/
// @version      0.1.1
// @description  对绿联网页版增强. 也可用于IP直连模式,需要自己配置@match
// @author       BarryChen
// @match        https://cloud.ugnas.com/*
// @grant        none
// @homepageURL  https://github.com/cp19890714/userscript
// ==/UserScript==

(function () {
    'use strict';

    // 是否按下了 command 键
    let commandDown = false;

    // 按下 command 键触发
    document.addEventListener('keydown', e => {
        if (e.key === 'Meta') {
            commandDown = true;
            console.log('command down');
        }
    });

    // 松开 command 键触发
    document.addEventListener('keyup', e => {
        if (e.key === 'Meta') {
            commandDown = false;
            console.log('command up');
        }
    });

    const previewImage = (e) => {
        e.target.classList.add('hadPreview');
        const img = e.target;
        let preview = null;
        let pos = null;
        let thisDoc =null;
        if (commandDown) {
            //基于整个浏览器窗口,固定位置展示大图
            thisDoc = getOwnerDocument(document);
            pos = calcFixedPreviewPos(e);
        } else {
            //基于文件管理器iframe,跟随鼠标,展示大图
            pos = calcFlexiblePreviewPos(e);
            thisDoc = document;
        }
        preview = thisDoc.createElement('img');
        preview.src = img.getAttribute('data-src').replace('SMALL', 'LARGE');
        preview.className = 'preview';
        preview.style.position = 'absolute';
        preview.style.left = pos.x + 'px';
        preview.style.top = pos.y + 'px';
        preview.style.height = pos.preHeight + 'px';
        preview.style.width = pos.preWidth + 'px';
        preview.style.zIndex = 9000;
        preview.style.boxShadow = '0px 0px 20px 0px black';
        thisDoc.body.appendChild(preview);
    };

    const removePreview = () => {
        //尝试移除iframe中的预览图
        let preview = document.querySelector('.preview');
        if (preview) {
            document.querySelector('body').removeChild(preview);
        }
        //尝试移除浏览器窗口中的预览图
        const ownerDocument = getOwnerDocument(document);
        preview = ownerDocument.querySelector('.preview');
        if (preview) {
            ownerDocument.querySelector('body').removeChild(preview);
        }
    };

    /**
     * 计算iframe中跟随鼠标位置的预览大图的坐标和大小
     * @param {Event} e 
     * @returns 
     */
    function calcFlexiblePreviewPos(e) {
        const img = e.target;
        // 预览图默认显示在鼠标右下方
        let x = e.pageX;
        let y = e.pageY;
        // 窗口大小
        const winWidth = window.innerWidth;
        const winHeight = window.innerHeight;

        // 计算预览图大小
        let preWidth = 0;
        let preHeight = 0;
        const maxHeight = Math.min(400, winHeight);
        const maxWidth = Math.min(400, winWidth);
        const imageHeight = img.offsetHeight;
        const imageWidth = img.offsetWidth;
        if (imageHeight >= imageWidth) {
            preHeight = maxHeight;
            preWidth = preHeight * imageWidth / imageHeight;
        } else {
            preWidth = maxWidth;
            preHeight = preWidth * imageHeight / imageWidth;
        }

        x = x + 100;
        y = y + 100;
        // 如果默认位置超出右侧边界,则调整为图片左下方
        if (x + preWidth > winWidth) {
            x = e.pageX - preWidth - imageWidth - 10;
        }
        if (x < 0) {
            x = 0;
        }

        // 如果默认位置超出下方边界,则调整为图片上方
        if (y + preHeight > winHeight) {
            y = e.pageY - preHeight - 100;
        }
        if (y < 0) {
            y = 0;
        }

        return { x, y, preWidth, preHeight };
    }


    /**
     * 计算基于整个浏览器窗口的位置固定的 预览大图的位置和大小
     * @param {Event} e 
     */
    function calcFixedPreviewPos(e) {
        const img = e.target;
        let x = 10;
        let y = 10;
        
        // 窗口大小
        const parentWindow = document.defaultView.parent
        const winWidth = parentWindow.innerWidth;
        const winHeight = parentWindow.innerHeight;
        // 计算预览图大小
        let preWidth = 0;
        let preHeight = 0;
        const maxHeight = winHeight-20;
        const maxWidth =  winWidth * 0.48;
        const imageHeight = img.offsetHeight;
        const imageWidth = img.offsetWidth;
        if (imageHeight > imageWidth) {
            preHeight = maxHeight;
            preWidth = preHeight * imageWidth / imageHeight;
            if(preWidth >= maxWidth){
                preWidth = maxWidth;
                preHeight = preWidth * imageHeight / imageWidth;    
            }
        } else {
            preWidth = maxWidth;
            preHeight = preWidth * imageHeight / imageWidth;
        }
        
        //获取iframe的位置
        const iframe = getOwnerDocument(document).querySelector('iframe');
        const iframeRect = iframe.getBoundingClientRect();
        const iframeX = iframeRect.x;
        const iframeY = iframeRect.y;
        //鼠标在整个浏览器窗口中的位置
        const mouseInWindowX = e.pageX + iframeX;
        const mouseInWindowY = e.pageY + iframeY;

        //如果图片4个点的坐标覆盖了鼠标位置,则调整预览图x坐标位置.
        if (mouseInWindowX < x+preWidth && mouseInWindowX > x) {
            x = winWidth - preWidth;
        }
        return { x, y, preWidth, preHeight }
    }

    /**
     * 获取iframe的父document
     * @param {*} iframeDocument 
     * @returns 
     */
    const getOwnerDocument = (iframeDocument) => {
        return iframeDocument.defaultView.parent.document;
    }

    setInterval(function () {
        document.querySelectorAll('img.thumbs').forEach(img => {
            if (!img.classList.contains('hadPreview')) {
                img.addEventListener('mouseover', previewImage);
                img.addEventListener('mouseout', removePreview);
            }
        });
    }, 1000);
})();
function isEmail(email) {
    var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    return regex.test(email);
}

function validateForm() { 
    let name = $.trim($('#name').val()),
        phone = $.trim($('#phone').val()),
        email = $.trim($('#email').val()),
        content = $.trim($('#content').val());
    
    // console.log(name);

    let flag = false;
    if (name == '' || name.length < 5) { 
        console.log('Vui lòng nhập tên mày!');
        $('#p__error-name').text('Vui lòng nhập tên mày!');
        $('#name').addClass('error');
    } else {
        $('#p__error-name').text('');
        $('#name').removeClass('error');
        flag = true;
    }

    if (phone == '') { 
        $('#p__error-phone').text('Vui lòng nhập số điện thoại của mày!');
        $('#phone').addClass('error');
    } else if (phone.length !== 10) {
        console.log('Vui lòng nhập đúng số!');
        $('#p__error-phone').text('Vui lòng nhập đúng số!');
        $('#phone').addClass('error');
        // flag = true;
    } else {
        $('#p__error-phone').text('');
        $('#phone').removeClass('error');
        console.log('ok phone');
    }

    if (email == '') {
        console.log('Vui lòng nhập email của mày!');
    } else if (!isEmail(email)) { 
        console.log('Vui lòng nhập đúng email!');
    } else {
        console.log('ok mail mail');
    }

    if (content == '') { 
        console.log('Vui lòng nhập nội dung!');
    } else {
        console.log('ok content');
    }
        
}

let btnSend = $('#form_register .form__button');

btnSend.on('click', function () { 
    validateForm();
});


let $carousel = $('.slider__item-wrap');
$carousel.flickity({
    // options
    cellAlign: 'left',
    contain: true,
    wrapAround: true,
    prevNextButtons: false,
    on: {
        ready: function() {
            // console.log('Flickity is ready');
            let dotted = $('.flickity-page-dots');
                paging = $('.slider__bottom-paging .dotted');
                dotted.appendTo(paging);
        },
        change: function (index) {
            let number = $('.slider__bottom-paging .number');
            let indexPage = index + 1;
            number.text(indexPage.toString().padStart(2,0))
            // number.text('0' + indexPage)
        }
    }
});

// previous
$('.slider__bottom-control .--prev').on( 'click', function() {
    $carousel.flickity('previous');
});
$('.slider__bottom-control .--next').on( 'click', function() {
    $carousel.flickity('next');
});

var initPhotoSwipeFromDOM = function(gallerySelector) {
    var parseThumbnailElements = function(el) {
        var thumbElements = el.childNodes,
            numNodes = thumbElements.length,
            items = [],
            figureEl,
            linkEl,
            size,
            item;
        for(var i = 0; i < numNodes; i++) {
            figureEl = thumbElements[i]; // <figure> element
            if(figureEl.nodeType !== 1) {
                continue;
            }
            linkEl = figureEl.children[0]; // <a> element
            size = linkEl.getAttribute('data-size').split('x');
            item = {
                src: linkEl.getAttribute('href'),
                w: parseInt(size[0], 10),
                h: parseInt(size[1], 10)
            };
            if(figureEl.children.length > 1) {
                item.title = figureEl.children[1].innerHTML; 
            }
            if(linkEl.children.length > 0) {
                // <img> thumbnail element, retrieving thumbnail url
                item.msrc = linkEl.children[0].getAttribute('src');
            } 
            item.el = figureEl; // save link to element for getThumbBoundsFn
            items.push(item);
        }
        return items;
    };
    var closest = function closest(el, fn) {
        return el && ( fn(el) ? el : closest(el.parentNode, fn) );
    };
    var onThumbnailsClick = function(e) {
        e = e || window.event;
        e.preventDefault ? e.preventDefault() : e.returnValue = false;
        var eTarget = e.target || e.srcElement;
        var clickedListItem = closest(eTarget, function(el) {
            return (el.tagName && el.tagName.toUpperCase() === 'FIGURE');
        });
        if(!clickedListItem) {
            return;
        }
        var clickedGallery = clickedListItem.parentNode,
            childNodes = clickedListItem.parentNode.childNodes,
            numChildNodes = childNodes.length,
            nodeIndex = 0,
            index;
        for (var i = 0; i < numChildNodes; i++) {
            if(childNodes[i].nodeType !== 1) { 
                continue; 
            }
            if(childNodes[i] === clickedListItem) {
                index = nodeIndex;
                break;
            }
            nodeIndex++;
        }
        if(index >= 0) {
            openPhotoSwipe( index, clickedGallery );
        }
        return false;
    };
    var photoswipeParseHash = function() {
        var hash = window.location.hash.substring(1),
        params = {};
        if(hash.length < 5) {
            return params;
        }
        var vars = hash.split('&');
        for (var i = 0; i < vars.length; i++) {
            if(!vars[i]) {
                continue;
            }
            var pair = vars[i].split('=');  
            if(pair.length < 2) {
                continue;
            }           
            params[pair[0]] = pair[1];
        }
        if(params.gid) {
            params.gid = parseInt(params.gid, 10);
        }
        return params;
    };
    var openPhotoSwipe = function(index, galleryElement, disableAnimation, fromURL) {
        var pswpElement = document.querySelectorAll('.pswp')[0],
            gallery,
            options,
            items;
        items = parseThumbnailElements(galleryElement);
        options = {
            galleryUID: galleryElement.getAttribute('data-pswp-uid'),
            getThumbBoundsFn: function(index) {
                var thumbnail = items[index].el.getElementsByTagName('img')[0], // find thumbnail
                    pageYScroll = window.pageYOffset || document.documentElement.scrollTop,
                    rect = thumbnail.getBoundingClientRect(); 

                return {x:rect.left, y:rect.top + pageYScroll, w:rect.width};
            },
            showAnimationDuration : 0,
            hideAnimationDuration : 0
        };
        if(fromURL) {
            if(options.galleryPIDs) {
                for(var j = 0; j < items.length; j++) {
                    if(items[j].pid == index) {
                        options.index = j;
                        break;
                    }
                }
            } else {
                options.index = parseInt(index, 10) - 1;
            }
        } else {
            options.index = parseInt(index, 10);
        }
        if( isNaN(options.index) ) {
            return;
        }
        if(disableAnimation) {
            options.showAnimationDuration = 0;
        }
        gallery = new PhotoSwipe( pswpElement, PhotoSwipeUI_Default, items, options);
        gallery.init();
    };
    var galleryElements = document.querySelectorAll( gallerySelector );
    for(var i = 0, l = galleryElements.length; i < l; i++) {
        galleryElements[i].setAttribute('data-pswp-uid', i+1);
        galleryElements[i].onclick = onThumbnailsClick;
    }
    var hashData = photoswipeParseHash();
    if(hashData.pid && hashData.gid) {
        openPhotoSwipe( hashData.pid ,  galleryElements[ hashData.gid - 1 ], true, true );
    }
};

$(window).load(function () {
    initPhotoSwipeFromDOM('.carousel-img');
});
// $carousel.on( 'change.flickity', function( event, index ) {
//     console.log('Slide changed to ' + index);
// });

    

let menu = $('.list ul li a');

menu.hover(function () {
    // hover
    $(this).parent().siblings().find('a').addClass('-gray');
}, function () {
    // out hover
    menu.removeClass('-gray');
});

console.log(menu.closest('.list'));
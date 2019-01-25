/*
    원칙1. JS는 변수 선언부, HTML 태그 생성부, 이벤트 선언부, 함수 선언부 등의 4가지 영역으로 나누어 작성한다.
    원칙2. '모든 화면에서' 또는 '대부분의 화면에서' 공통으로 사용되는 부분은 같은 4가지 영역으로 새로이 JS 파일을 따로 작성하여 HTML 문서상의 가장 먼저 로드되도록 한다.
*/

'use strict';
$(document).ready(function() {
/************ 시작 ****************/
    
/************
	변수 선언부
************/
var TEXT_INDICATOR_NAME = '{indicatorName}';
var TEMP_INDICATOR      = '<li><a href="#">' + TEXT_INDICATOR_NAME + '</a></li>';    

var SLIDE_SIZE      = $('div.banner-slide ul.slide li dl.product-info').length;
var SLIDE_BG_ARR    = [
    {'color':'white', 'bg':'img/Pocophone.jpg'}, 
    {'color':'black', 'bg':'img/MiElectricToothbrushgrey.jpg'}, 
    {'color':'black', 'bg':'img/MiElectricToothbrushgrey.jpg'}, 
    {'color':'white', 'bg':'img/redminote5banner.jpg'}, 
    {'color':'white', 'bg':'img/1920_770scooter.jpg'} 
];

var LAST_INDEX       = SLIDE_SIZE - 1;
var startIndex       = 0;
var prevIndex        = 0;
var nextIndex        = 0;
var currentIndex     = 0;
var timerId          = 0;
var INTERVAL_TIME_SC = 3 * 1000;    

var LOCATION_LIST_HEIGHT = $('footer div.footer-end span.change-location ul.location-list').css('height'); 

    
/*****************
    HTML 태그 생성부
*****************/    
setSlideIndex(startIndex);    
    
// 인디케이터 버튼을 슬라이드 개수에 맞춰 삽입한다.
$('div.indicator ul').empty();
$('div.banner-slide ul.slide li dl.product-info').each(function(indicatorIndex) {
    var indicatorNumber = indicatorIndex + 1;
    var indicatorText   = '슬라이드' + indicatorNumber;
    var appendTag       = TEMP_INDICATOR.replace(TEXT_INDICATOR_NAME, indicatorText);
    $('div.indicator ul').append(appendTag);    
});    

$('div.indicator ul li').eq(startIndex).addClass('on');    
$('header.gnb').addClass(SLIDE_BG_ARR[startIndex].color);
$('div.banner-slide').css({'background-image':'url(' + SLIDE_BG_ARR[startIndex].bg + ')'});
    
startInterval();

$('footer div.footer-end span.change-location ul.location-list').css({ 'height':'0px' });
    
/*************
    이벤트 선언부
*************/    
    
// 링크 클릭시 스크롤 이동 방지
$(document).on('click', 'a[href="#"]', function(e) {
    e.preventDefault();
});    

// 상단 메뉴 mouseenter, focusin 이벤트
$('header.gnb nav.below ul.prd-menu > li > a').on('mouseenter focusin', function() {
    $('div.prd-wrap').addClass('on');
    $('header.gnb nav.below ul.prd-menu > li').removeClass('on');
    $(this).parent().addClass('on');
});

// 상단 메뉴 mouseeleave, focusout 이벤트
/* TODO 아직 포커스아웃 해결안됨 */
$('header.gnb nav.below div.prd-wrap').on('mouseleave', function() {
    $('header.gnb nav.below div.prd-wrap').removeClass('on');
    $('header.gnb nav.below ul.prd-menu > li').removeClass('on');
});

// 사기다...
$('header.gnb nav.below ul.prd-menu li:last-child div.prd-list ul.prd-items li:last-child a:last-child').on('focusout', function() {
    $('header.gnb nav.below div.prd-wrap').removeClass('on');
    $('header.gnb nav.below ul.prd-menu > li').removeClass('on');
});
    
    
$('div.banner-slide div.control a.prev').on('click', function() {
    setSlideIndex(prevIndex);
    $('div.indicator ul li a').eq(currentIndex).trigger('click');
    startInterval();
});    

$('div.banner-slide div.control a.next').on('click', function() {
    setSlideIndex(nextIndex);
    $('div.indicator ul li a').eq(currentIndex).trigger('click');
    startInterval();
});    
    
// 인디케이터 클릭 이벤트    
$('div.indicator ul li a').on('click', function() {
    $('div.indicator ul li').removeClass('on');
    
    $(this).parent().addClass('on');
    var index = $('div.indicator ul li').index($(this).parent());
    
    setSlideIndex(index);
    $('div.banner-slide ul.slide li.on').attr('class', 'sr-only off');  
    
    setTimeout(function() {
        $('div.banner-slide ul.slide li').removeClass('off');       
        $('div.banner-slide ul.slide li').removeClass('on');
        $('div.banner-slide ul.slide li').eq(currentIndex).addClass('on');  
        $('div.banner-slide').css({ 'background-image':'url(' + SLIDE_BG_ARR[currentIndex].bg + ')' });    
        $('header.gnb').attr('class', 'gnb ' + SLIDE_BG_ARR[currentIndex].color);
    }, 500);
    
    startInterval();
    
});

// mouseenter, focusin 이벤트 발생시 그림자 효과
$('main.contents section.product ul li a').on('mouseenter focusin', function() {
    $(this).parent().addClass('shadow');
}).on('mouseleave focusout', function() {
    $(this).parent().removeClass('shadow');
});

// 유튜브 재생 이미지에 mouseenter, focusin 이벤트 발생시 효과
$('main.contents section.video ul li a').on('mouseenter focusin', function() {
    $(this).find('span').addClass('bg-color-rgba');
}).on('mouseleave focusout', function() {
    $(this).find('span').removeClass('bg-color-rgba');
});

$('footer div.footer-end span.change-location > a').on('click', function() {
    $(this).css({'visibility':'hidden'});
    $(this).parent().addClass('on');
    $(this).parent().find('ul.location-list').css({'height':LOCATION_LIST_HEIGHT});
});

$('footer div.footer-end span.change-location ul.location-list li:last-child > a').on('click', function(e) {
    $(this).parent().parent().parent().removeClass('on');
    $(this).parent().parent().css({'height':'0'});
    $(this).parent().parent().parent().find('> a').css({'visibility':'visible'});
    $('footer div.footer-end span.change-location > a').focus();
    e.preventDefault();
});    

/************
	함수 선언부
************/
    
// 슬라이드 관련 index를 계산    
function setSlideIndex(index) {
    prevIndex = index - 1;
    if(prevIndex < 0) {
        prevIndex = LAST_INDEX;   
    }
    
    nextIndex = index + 1;
    if(LAST_INDEX < nextIndex) {
        nextIndex = startIndex;   
    }
    
    currentIndex = index;
}
    
function startInterval() {
    clearInterval(timerId);
    timerId = setInterval(function() {
        $('div.banner-slide div.control a.next').trigger('click');
    }, INTERVAL_TIME_SC);
}    

    
/***************** 종료 ***************/
});
/*
 * The purpose of Main.js is to instantiate all necessary classes in order to create a
 * a slide show with a fade transition.
 * 
 * @Variable: 
 *  head - Variable used to store the HTML element head;
 *  cssFadeSlide - Variable used to insert a link HTML element into the head of the HTML document FadeSlide.html.
 *      Used to reference CSS document FadeSlide.css;
 *  jsMarker - Variable used to insert a script HTML element into the head of the HTML document FadeSlide.html. 
 *      Used to reference javascript document Marker.js; 
 *  jsBtnBox - Variable used to insert a script HTML element into the head of the HTML document FadeSlide.html.
 *      Used to reference javascript document BtnBox.js; 
 *  jsSlide - Variable used to insert a script HTML element into the head of the HTML document FadeSlide.html.
 *      Used to reference javascript document Slide.js; 
 *  jsCarousel - Variable used to insert a script HTML element into the head of the HTML document FadeSlide.html.
 *      Used to reference javascript document Carousel.js;
 *  activeCssClass - Variable used as a reference to the CSS Rule .marker.active;
 *  inactiveCssClass - Variable used as a reference to the CSS Rule .marker;
 *  selectCssClass -   Variable used as a reference to the CSS Rule .marker.select;
 * 
 * @Object
 *  slides - Object used to instantiate instances of the class Slide.
 *  controls - Object used to instantiate instances of the classes BtnBox, and Marker.
 *  
 * @Function: validate; verifies that the HTML element beinging referenced is valid.  
 *  @Paramters: id; the id of the HTML element.
 *  @Returns: The HTML element to the caller.   
 */

var head = $(document.head);
var cssFadeSlide = new Element('link', {type: "text/css", rel: "stylesheet", href: "css/FadeSlide.css"});
var jsMarker = new Element('script', {type: "text/javascript", src: "js/Marker.js"});
var jsBtnBox = new Element('script', {type: "text/javascript", src: "js/BtnBox.js"});
var jsSlide = new Element('script', {type: "text/javascript", src: "js/Slide.js"});
var jsCarousel = new Element('script', {type: "text/javascript", src: "js/Carousel.js"});
var activeCssClass = '.marker.active', inactiveCssClass = '.marker', selectCssClass = '.marker.select';

var slides = {
    id: 'slides',
    slide1: { slide: { id: 'slide1', opacity: 1 }, element: null },
    slide2: { slide: { id: 'slide2', opacity: 0 }, element: null },
    slide3: { slide: { id: 'slide3', opacity: 0 }, element: null },
    slide4: { slide: { id: 'slide4', opacity: 0 }, element: null }
};

var controls = {
    id: 'controls',
    btnBox1: { 
        id: 'btnBoxMain', 
        element: null, 
        action: { position: 'top', visible: '450', hidden: '485', center: 'left' },
        markers: {
            marker1: { description: { id: 'marker1', type: 'direct' }, action: { active: activeCssClass, inactive: inactiveCssClass, select: selectCssClass, task: null }, element: null },
            marker2: { description: { id: 'marker2', type: 'direct' }, action: { active: activeCssClass, inactive: inactiveCssClass, select: selectCssClass, task: null }, element: null },
            marker3: { description: { id: 'marker3', type: 'direct' }, action: { active: activeCssClass, inactive: inactiveCssClass, select: selectCssClass, task: null }, element: null },
            marker4: { description: { id: 'marker4', type: 'direct' }, action: { active: activeCssClass, inactive: inactiveCssClass, select: selectCssClass, task: null }, element: null }
        }
    },
    btnBox2: { 
        id: 'btnBoxBack', 
        element: null, 
        action: { position: 'left', visible: '30', hidden: '-5', center: 'top' },
        markers: {
            marker: { description: { id: 'markerBack', type: 'indirect' }, action: { active: '.markerBack.active', inactive: '.markerBack', task: null }, element: null }
        }
    },
    btnBox3: { 
        id: 'btnBoxForth', 
        element: null, 
        action: { position: 'right', visible: '30', hidden: '-5', center: 'top' },
        markers: {
            marker: { description: { id: 'markerForth', type: 'indirect' }, action: { active: '.markerForth.active', inactive: '.markerForth', task: null }, element: null }
        }
    }
};

var validate = function(id) {
    if (document.id(id) !== null ){ 
    	return document.id(id); 
    } else { 
        throw new Error ("The element does not exist!"); 
    }
};

window.addEvent('domready', function(){
    var eventChain = new Chain();
    eventChain.chain( 
        function(){ head.adopt(jsMarker, jsBtnBox, jsSlide, jsCarousel, cssFadeSlide); }, 
        function(){ var activateCarousel = new Carousel(slides, controls); }   
    );
    
    var exeChain = function(){
        if(eventChain.$chain.length === 0){ clearInterval(timer); } else { eventChain.callChain(); }
    };
    
    var timer = exeChain.periodical(50);
});
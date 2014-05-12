/*
 * @param {
 *  Object: slides {
 *      String: id,
 *      Object: slide { 
 *          Object: slide {String: id, Integer: opacity}, 
 *          Instance: element
 *      }
 *  }
 *  Object: controls {
 *      String: id,
 *      Object: ButtonBox { 
 *          String: id,
 *          Instance: element, 
 *          Object: action {String: position, Integer: visible, Integer: hidden, String: center}, 
 *          Object: markers {
 *              Object: marker: {
 *                  Object: description {String: id, Sting: type}
 *                  Object: action {String: active, String: inactive, Function: task}, 
 *                  Instance: element
 *              }
 *          }
 *      }
 * }
 */

Class.Mutators.Static = function(items){ this.extend(items); };

var Carousel = new Class({
    Implements: [Chain, Options],
    
    options: {
        eventType: ['mouseenter', 'mouseleave'],
        carousel: validate('carousel'),
        automatic: true,
        markers: { 
            forth: 'markerForth', 
            back: 'markerBack',
            three: 'marker3',
            four: 'marker4',
            one: 'marker1', 
            two: 'marker2'
        },
        track: 0
    },
    
    Static: {
        ticker: null,
        objective: null,
        period: 20000,
        
        getTicker: function(){ return this.ticker; },
        
        setTicker: function(){ this.ticker = this.objective.periodical(this.period); },
        
        setObjective: function(objective){ 
            this.objective = instanceOf(objective, Function) ? objective : null;
            this.setTicker();
        },
        
        clearTicker: function(){
            clearInterval(this.ticker); delete this.ticker; this.setTicker();
        }
    },
    
    initialize: function(slides, controls){
        this.slides = instanceOf(slides, Object) ? this.instantiate(slides): null;
        this.controls = instanceOf(controls, Object) ? this.instantiate(controls): null;
        this.autoDrive();
    },
    
    instantiate: function(object){
        if(object.id === 'slides'){
            var slides = Object.filter(object, function(value, key){ return key !== 'id'; });
            
            Object.each(slides, function(value, key){
                value.element = new Slide(value.slide);
            }.bind(this));
            
            return slides;
        } else if(object.id === 'controls'){
            var controls = Object.filter(object, function(value, key){ return key !== 'id'; });
            
            Object.each(controls, function(value, key){
                value.element = new BtnBox(value.id, value.action, this.assignTask(value.markers));
            }.bind(this));
            
            return controls;
        }
    },
    
    assignTask: function(markers){
        Object.each(markers, function(value, key){
            if(value.description.type === 'direct'){
                value.action.task = this.precession.pass(value.description.id, this);
            } else if (value.description.type === 'indirect'){
                value.action.task = this.successively.pass(value.description.id, this);
            }
        }.bind(this));
       
        return markers;
    },
    
    successively: function(id, nonClick){
        switch(id){
            case this.options.markers.back:
                if (this.slides.slide1.element.getOpacity() === 1){
                    this.controls.btnBox1.markers.marker4.element.clickEvents(nonClick);
                } else if (this.slides.slide2.element.getOpacity() === 1){
                    this.controls.btnBox1.markers.marker1.element.clickEvents(nonClick);
                } else if (this.slides.slide3.element.getOpacity() === 1){
                    this.controls.btnBox1.markers.marker2.element.clickEvents(nonClick);
                } else if (this.slides.slide4.element.getOpacity() === 1){
                    this.controls.btnBox1.markers.marker3.element.clickEvents(nonClick);
                }
                break;
            case this.options.markers.forth:
                if (this.slides.slide1.element.getOpacity() === 1){
                    this.controls.btnBox1.markers.marker2.element.clickEvents(nonClick);
                } else if (this.slides.slide2.element.getOpacity() === 1){
                    this.controls.btnBox1.markers.marker3.element.clickEvents(nonClick);
                } else if (this.slides.slide3.element.getOpacity() === 1){
                    this.controls.btnBox1.markers.marker4.element.clickEvents(nonClick);
                } else if (this.slides.slide4.element.getOpacity() === 1){
                    this.controls.btnBox1.markers.marker1.element.clickEvents(nonClick);
                }
                break;
            default:
        }
    },
    
    precession: function(id){
        if (!this.inTransit()){
            switch(id){
                case this.options.markers.one:
                    this.transition(this.slides.slide1.element, this.slides.slide2.element, this.slides.slide3.element, this.slides.slide4.element);
                    break;
                case this.options.markers.two:
                    this.transition(this.slides.slide2.element, this.slides.slide1.element, this.slides.slide3.element, this.slides.slide4.element);
                    break;
                case this.options.markers.three:
                    this.transition(this.slides.slide3.element, this.slides.slide1.element, this.slides.slide2.element, this.slides.slide4.element);
                    break;
                case this.options.markers.four:
                    this.transition(this.slides.slide4.element, this.slides.slide1.element, this.slides.slide2.element, this.slides.slide3.element);
                    break;
                default:
            }
        }
    },
    
    transition: function(aim, prospect1, prospect2, prospect3){
        if(aim.getOpacity() === 0 && prospect1.getOpacity() === 1){
            this.agenda(aim, prospect1);
        } else if(aim.getOpacity() === 0 && prospect2.getOpacity() === 1){
            this.agenda(aim, prospect2);
        } else if(aim.getOpacity() === 0 && prospect3.getOpacity() === 1){
            this.agenda(aim, prospect3);
        }
    },
    
    fireBtnBoxEvent: function(eventType){
        Object.each(this.controls, function(value, key){
            value.element.execEvent(eventType);
        });
    },
    
    removeBtnBoxEvent: function(eventType){
        Object.each(this.controls, function(value, key){
            value.element.releaseEvent(eventType);
        });
    },
    
    reattachBtnBoxEvent: function(){
        Object.each(this.controls, function(value, key){
            value.element.attachEvent();
        });
    },
    
    agenda: function(aim, prospect){
        this.chain( 
            function(){ if(!this.options.automatic){ this.fireBtnBoxEvent('mouseleave'); } }, 
            function(){ 
                this.removeBtnBoxEvent('mouseenter'); 
                this.removeBtnBoxEvent('mouseleave'); 
            },
            function(){ aim.fadeIn(); },
            function(){ prospect.fadeOut(); },
            function(){
                var doReattachEvent = function(){ 
                    if(!this.inTransit()){ 
                        this.reattachBtnBoxEvent();
                        if(!this.options.automatic){ this.fireBtnBoxEvent('mouseenter'); }
                        clearInterval(timer);
                    }
                };
               
                var timer = doReattachEvent.periodical(100, this);
            }       
        );

        var doChain = function(){
            if (this.$chain.length === 0){ clearInterval(timer); } else { this.callChain(); }
        };
        
        var timer = doChain.periodical(100, this);
    },
    
    autoDrive: function(){
        this.options.carousel.addEvents({
            mouseenter: function(){ this.options.automatic = false; }.bind(this),
            mouseleave: function(){ this.options.automatic = true; }.bind(this)
        });
        
        var reset = false;
              
        var exeAutoDrive = function(){
            this.successively(this.options.markers.forth, true);
        }.bind(this);
        
        Carousel.setObjective(exeAutoDrive);
        
    },
    
    inTransit: function(){
        Object.some(this.slides, function(value, key){
            return value.element.checkRun() === true;
        });
    }
});
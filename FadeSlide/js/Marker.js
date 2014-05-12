/*
 * @param {String: id, object: action { String: active, String: inactive, Function: task }}
 */

Class.Mutators.Static = function(items){ this.extend(items); };

var Marker = new Class ({
	Implements: [Chain, Options],
                        
    options: {
	duration: '2',
    	transition: 'quart:out'
    },
    
    Static: {
        currentMarker: null,
        
        setCurrentMarker: function(instance){ this.currentMarker = instance; },
        
        getCurrentMarker: function(){ return this.currentMarker; },
        
        currentMarkerNull: function(){ return this.currentMarker === null ? true : false; },
                
        clearCurrentMarker: function(){ delete this.currentMarker; this.currentMarker = null; }
    },
                        
    initialize: function(description, action){
    	this.description = instanceOf(description, Object) ? description : null;
    	this.element = instanceOf(this.description.id, String) ? validate(this.description.id) : null;
        this.action = instanceOf(action, Object) ? action : null;
        this.setEffect(); this.attachEvent(); this.runEvents();
    },
                        
    setEffect: function(){
        this.effect = new Fx.Morph(this.element, {
        	duration: this.options.duration,
        	transition: this.options.transition
    	});
    },
 
    attachEvent: function(){  
    	this.element.addEvents({
            mouseenter: function(){
                this.effect.start(this.action.active); 
            }.bind(this),
            mouseleave: function(){
                this.effect.start(this.action.inactive); 
            }.bind(this),
            click: function(){
                switch(this.description.type){
                    case 'direct':
                        this.clickEvents();
                        break;
                    case 'indirect':
                        this.action.task();
                        break;
                    default:
                }
            }.bind(this)                     
        });
    },

    runEvents: function(){
        this.chain( 
            function(){ this.element.fireEvent('mouseenter'); }, 
            function(){ this.element.fireEvent('mouseleave'); } 
        );

        var doChain = function(){
            if (this.$chain.length === 0){ clearInterval(timer); } else { this.callChain(); }
        };
        
        var timer = doChain.periodical(100, this);
    },
    
    clickEvents: function(nonClick){
        var clickChain = new Chain();
        
        clickChain.chain(
            function(){
                if(Marker.currentMarkerNull()){
                    Marker.setCurrentMarker(this);
                 } else {
                    Marker.getCurrentMarker().attachEvent();
                    Marker.getCurrentMarker().element.fireEvent('mouseleave');
                    Marker.clearCurrentMarker();
                    Marker.setCurrentMarker(this);
                }
                this.element.removeEvents('mouseenter');
                this.element.removeEvents('mouseleave');
                this.element.removeEvents('click');
                this.effect.start(this.action.select);
            }.bind(this),
            function(){ 
                this.action.task();
                if(!nonClick){ Carousel.clearTicker(); }
            }.bind(this));
        
        var doChain = function(){
            if( clickChain.$chain.length === 0){ clearInterval(timer); } else { clickChain.callChain(); } 
        };
        
        var timer = doChain.periodical(50, this);
    }
});
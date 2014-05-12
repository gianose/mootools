/*
 * @param {Object: {String: id, Integer: opacity}}
 */

var Slide = new Class({
    Implement: Options,
    
    options: {
        duration: 1500,
        transition: 'quart:out',
        fadeIn: [0, 1],
        fadeOut: [1, 0]
    },
    
    initialize: function(object){
        this.object = instanceOf(object, Object) ? object : null;
        this.element = instanceOf(this.object.id, String) ? validate(this.object.id) : null;
        instanceOf(this.object.opacity, Number) ? this.setOpacity() : null;
        this.setEffect();
    },
    
    setOpacity: function(){
        if ((this.object.opacity >= 0) && (this.object.opacity <= 1)){
            this.element.setStyle('opacity', this.object.opacity);
        }
    },
    
    getOpacity: function(){ return this.element.getStyle('opacity'); },
    
    setEffect: function(){
        this.effect = new Fx.Morph(this.element, {
           duraction: this.options.duration,
           transition: this.options.transition
        });
    },
    
    fadeIn: function(){ this.effect.start({'opacity': this.options.fadeIn }); },
    
    fadeOut: function() {
        this.effect.start({ 'opacity': this.options.fadeOut });
        
    },
    
    checkRun: function() { this.effect.isRunning(); }
});
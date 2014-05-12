/* @Class: BtnBox - The button box class is a representation of container for buttons and all the corresponding methods.
 * @method: 
 *  setEffect - Instantiates the instance variable effect;
 *  attachEvent - Attaches events to the instances of the BtnBox class;
 *  execEvent - When called executes the event that corresponds with the event type parameter.
 *      @param: String: eventType;
 *  releaseEvent - When called releases the event that corresponds with the event type parameter.
 *      @param: String: eventType;
 *  centerBtnBox - Determines the left off set of the button box in order for it to appear centered.
 *      @param: String: post;
 *  instantiateMarker: - Uses the instance variable markers in order to create new instances of the Marker class. 
 * @param { 
 *      String: id, 
 *      Object: action {String: position, Integer: visible, Integer: hidden, String: center }, 
 *      Object: markers { 
 *          Object: marker {
 *              String: id, 
 *              Instance: element, 
 *              Object: action { String: active, String: inactive }
 *          }
 *      }
 * }
 */

var BtnBox = new Class({
    Implement: Options,
    
    options: {
        eventType: ['mouseenter', 'mouseleave'],
        vessel: validate('vessel'),
        transition: 'quart:out', 
        duration: '300',
        fadeIn: '0.7',
        fadeOut: '0'
    },
    
    initialize: function(id, action, markers){
        this.id = instanceOf(id, String) ? id: null;
        this.element = validate(this.id);
        this.action = instanceOf(action, Object) ? action : null;
        this.markers = instanceOf(markers, Object) ? markers : null; 
        this.setEffect(); 
        this.instantiateMarker();
        this.centerBtnBox(this.action.center);
        this.attachEvent(); 
    },
    
    setEffect: function(){
        this.effect = new Fx.Morph (this.element, {
            duration: this.options.duration,
            tansition: this.options.transition
        });
    },
    
    attachEvent: function(){
      this.options.vessel.addEvents({
         mouseenter: function(){
              if(this.action.position === 'top'){
                 this.effect.start({ 'top': this.action.visible, 'opacity': this.options.fadeIn });
             } else if(this.action.position === 'left'){
                 this.effect.start({ 'left': this.action.visible, 'opacity':this.options.fadeIn });
             } else if(this.action.position === 'right'){
                 this.effect.start({ 'right': this.action.visible, 'opacity':this.options.fadeIn});
             }
         }.bind(this),
         mouseleave: function(){ 
             if(this.action.position === 'top'){
                 this.effect.start({ 'top': this.action.hidden, 'opacity': this.options.fadeOut });
             } else if(this.action.position === 'left'){
                 this.effect.start({ 'left': this.action.hidden, 'opacity':this.options.fadeOut });
             } else if(this.action.position === 'right'){
                 this.effect.start({ 'right': this.action.hidden, 'opacity':this.options.fadeOut });
             }
         }.bind(this)
      });
      
      window.addEvent('resize', function(){ this.centerBtnBox(this.action.center); }.bind(this));
    },
     
    execEvent: function(eventType){
        if(this.options.eventType.contains(eventType)){
            this.options.vessel.fireEvent(eventType);
        }
    },
    
    releaseEvent: function(eventType){
        if(this.options.eventType.contains(eventType)){
            this.options.vessel.removeEvents(eventType);
        }
    },
    
    centerBtnBox: function(post){
        var setOffSet = function(post, offSet){ this.element.setStyle(post, offSet); }.bind(this);
    
        if (post === 'left') {
            setOffSet(post, ((this.options.vessel.getStyle('width').toInt())/2) - ((this.element.getStyle('width').toInt())/2));
        } else if (post === 'top') {
            setOffSet(post, ((this.options.vessel.getStyle('height').toInt())/2) - ((this.element.getStyle('height').toInt())/2));
        }
    },
    
    instantiateMarker: function(){
        Object.each(this.markers, function(value, key){ 
            value.element = new Marker(value.description, value.action);
            if(value.description.id === 'marker1'){ value.element.clickEvents(true); }
        }.bind(this));
    }
}); 
/* class-IF-parentClass.js
 * When used with breakpoints.js this script can apply different classes at different breakpoints.
 * (Pass in the different event name if not using breakpoints.js eg 'resize')
 * Use xxx-IF-yyy to test parent classes in <html> tag only.
 * Use xxx-IN-yyy to test and parent classes.
 * So "hide-IF-phone" will add "hide" class on phone breakpoint or "not-hide" on others.
 * Or use with modernizr for "foobar-IF-cssvwunits" etc.
 * Eg: <li class="bullet-icon-IF-gte-tablet chevron-IF-phone"> will become...
 *     <li class="bullet-icon-IF-gte-tablet chevron-IF-phone bullet-icon not-chevron"> on tablet or higher and
 *     <li class="bullet-icon-IF-gte-tablet chevron-IF-phone chevron not-bullet-icon"> on phone breakpoint.
 * Tip: To trigger a refresh programmatically, call $(window).triggerHandler('breakpoint')
 */

/* jshint laxcomma:true, asi:true, debug:true, curly:false, camelcase:true, browser:true */

;(function(window,onEvent){
  
  var root = document.documentElement


  ;(function(handlerFor){

    var refreshClasses

    // Matcher to look for a className in the <html> element only:
    function rootTest(className){
      return ( ' ' + root.className + ' ' ).indexOf( ' ' + className + ' ' ) >= 0
    }

    // Matcher to look for a className in any parent, including the <html> element:
    function parentTest(className){
      return !!$(this).closest('.'+className).length
    }


    // Create refresher for "-IF-" classes: (Eg: To reapply "hide-IF-phone")
    // And expose the refresh method so it can also be triggered programmatically in special situations:
    refreshClasses = handlerFor('-IF-',rootTest)
    refreshClasses()
    $(window).on(onEvent,refreshClasses)
    

    // BONUS FEATURE!
    // Keep the two techniques separate by supporting "-IF-" and "-IN-": (Eg: To reapply "hide-IN-active-tab")
    // This looks for the condition class on any parent, not just root.
    refreshClasses = handlerFor('-IN-',parentTest)
    refreshClasses()
    $(window).on(onEvent,refreshClasses)


  })(function(IF,test){
 
    var regexp = new RegExp('(\\S+' + IF + '\\S+)','g')  // Eg: /(\S+-IF-\S+)/g to match "-IF-" in "hide-IF-phone"

    return function(){
      
      // Find all the elements that have class="xxx-IF-yyy":
      $('[class*="' + IF + '"]').each(function(){

        // Parse if-condition(s) from the class attribute:
        var conditions = this.className.match(regexp) || []
        var condition

        while( ( condition = conditions.pop() ) ){
  
          // Extract the "xxx-IF-yyy" classnames either side of the "-IF-" (Eg: from "hide-IF-phone")
          condition           = condition.split(IF)
          var elemClass       = condition[0]                    // LHS: Get name of desired element xxx-IF class.
          var conditionIsTrue = test.call( this, condition[1] ) // RHS: Test for presence of IF-yyy class (in root or parent or wherever)

          $(this)
            .toggleClass(          elemClass,  conditionIsTrue ) // Toggle the xxx class.
            .toggleClass( 'not-' + elemClass, !conditionIsTrue ) // BONUS FEATURE: Toggle a not-xxx class.
  
        }
  
      })
    
    }  
  
  })

})(this,'breakpoint')
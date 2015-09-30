/**
 * Break apart textfields
 * @version 1.01
 * @author: Charles D Clements  - http://www.charlesclements.net
 */ 
 
/*
Bug fixes:
1.01 - Fixed breakApart() call error when an empty Textfield was selected for breaking apart. 
*/
 
var doc = fl.getDocumentDOM();
var trace = fl.outputPanel.trace;
var library;
var items;
var item;
var timeline;
var tempSelection;
var clip;

// Is there a document open?
if (!doc)
{
	alert("Please open or create a flashfile.");
}
else
{
	RunThruLibrary();
}


function RunThruLibrary()
{

    // Stop Flash from giving the propt that the script is taking too long.
    fl.showIdleMessage(false);

	library = doc.library;
	items = library.items;
	
    // Clear output.
    fl.outputPanel.clear();
    
    // Run thru Library items.
    for( var k = items.length - 1; k > -1; k-- )
    {
    
        // Set clip value.
        clip = library.items[k];
        
        // Go thru the names and remove the % character.
        if( clip.name.indexOf('%') > -1 )
        {
          
            var str = clip.name;
            var res = str.replace("%", "_");
            clip.name = res;
            
        }
    
        if( clip.itemType === "movie clip" || clip.itemType === "graphic" || clip.itemType === "button" )
        {
            
            // Send MovieClip to searchThruMovieClip function.
            searchThruMovieClip();
            
        }
        
    }
    
    // Go thru items on root timeline.
    searchThruRootTimeline();
    
}


function searchThruRootTimeline()
{

    // Get Scene 0 which is the root timeline.
    doc.editScene(0);
    
    
    // Set timeline var.
    timeline = fl.getDocumentDOM().getTimeline();

    // Scrub thru the frames.
    for(var i = 0; i < timeline.frameCount; i++)
    {
    
        checkFrame( i );
    
    }
    
}


function searchThruMovieClip()
{

    library.selectItem( clip.name );
    library.editItem();
    
    // Set timeline var.
    timeline = fl.getDocumentDOM().getTimeline();
    
    // Scrub thru the frames.
    for(var i = 0; i < timeline.frameCount; i++)
    {
    
        checkFrame( i );
    
    }
    
}


function checkFrame(frame)
{

    // Set frame as first frame.
    timeline.currentFrame = frame; 
    
    // Go thru all the layers and unlock them.
    unlockLayers();
    
    doc.selectAll();
    
    // Hold a temp array of selected items.
    tempSelection = document.selection;
    var l = tempSelection.length;
    
    doc.selectNone();
    
    for( var i = 0; i < l; i++ )
    {
    
        item = tempSelection[ i ];
    
        if( item.elementType === "text" )
        {
        
            doc.selection = [ item ];
            
            
            if( doc.getTextString().length > 1 )
            {
            
                // If there is more than one character in the textfield, breakApart needs to be called twice.
                doc.breakApart();
                doc.breakApart();
                doc.group();
                //trace( "======== TEXT BROKEN APART =========" );
            
            }
            else if( doc.getTextString().length == 1 )
            {
            
                // If its a single character in a textfield, you only need to breakApart once.
                doc.breakApart();
                doc.group();
                //trace( "======== TEXT BROKEN APART =========" );
                
            }
            
            doc.selection = tempSelection;
            
        }
    
    }

}


function unlockLayers()
{

    for( var i = 0; i < timeline.layers.length; i++ )
    {
    
        timeline.layers[ i ].locked = false;
    
    }
    
}



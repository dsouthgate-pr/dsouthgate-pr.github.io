var isNav4, isNav6, isIE4;

/*
 * Browser version snooper; determines your browser
 * (Navigator 4, Navigator 6, or Internet Explorer 4/5)
 */
function setBrowser()
{
    if (navigator.appVersion.charAt(0) == "4")
    {
        if (navigator.appName.indexOf("Explorer") >= 0)
        {
            isIE4 = true;
        }
        else
        {
            isNav4 = true;
        }
    }
    else if (navigator.appVersion.charAt(0) > "4")
    {
        isNav6 = true;
    }
}

/*
 *
 * Given a selector string, return a style object
 * by searching through stylesheets. Return null if
 * none found
 *
 */
function getStyleBySelector( selector )
{
    if (!isNav6)
    {
        return null;
    }
    var sheetList = document.styleSheets;
    var ruleList;
    var i, j;

    /* look through stylesheets in reverse order that
       they appear in the document */
    for (i=sheetList.length-1; i >= 0; i--)
    {
        ruleList = sheetList[i].cssRules;
        for (j=0; j<ruleList.length; j++)
        {
            if (ruleList[j].type == CSSRule.STYLE_RULE &&
                ruleList[j].selectorText == selector)
            {
                return ruleList[j].style;
            }   
        }
    }
    return null;
}

/*
 *
 * Given an id and a property (as strings), return
 * the given property of that id.  Navigator 6 will
 * first look for the property in a tag; if not found,
 * it will look through the stylesheet.
 *
 * Note: do not precede the id with a # -- it will be
 * appended when searching the stylesheets
 *
 */
function getIdProperty( id, property )
{
    if (isNav6)
    {
        var styleObject = document.getElementById( id );
        if (styleObject != null)
        {
            styleObject = styleObject.style;
            if (styleObject[property])
            {
                return styleObject[ property ];
            }
        }
        styleObject = getStyleBySelector( "#" + id );
        return (styleObject != null) ?
            styleObject[property] :
            null;
    }
    else if (isNav4)
    {
        return document[id][property];
    }
    else
    {
        return document.all[id].style[property];
    }
}

/*
 *
 * Given an id and a property (as strings), set
 * the given property of that id to the value provided.
 *
 * The property is set directly on the tag, not in the
 * stylesheet.
 *
 */
function setIdProperty( id, property, value )
{
    if (isNav6)
    {
        var styleObject = document.getElementById( id );
        if (styleObject != null)
        {
            styleObject = styleObject.style;
            styleObject[ property ] = value;
        }
        
    }
    else if (isNav4)
    {
        document[id][property] = value;
    }
    else if (isIE4)
    {
         document.all[id].style[property] = value;
    }
}

/*
 *
 * Move a given id.  If additive is true,
 * then move it by xValue dots horizontally and
 * yValue units vertically.  If additive is
 * false, then move it to (xValue, yValue)
 *
 * Note: do not precede the id with a # -- it will be
 * appended when searching the stylesheets
 *
 * Note also: length units are preserved in Navigator 6
 * and Internet Explorer. That is, if left is 2cm and
 * top is 3cm, and you move to (4, 5), the left will
 * become 4cm and the top 5cm.
 *
 */
function generic_move( id, xValue, yValue, additive )
{
    var left = getIdProperty(id, "left");
    var top = getIdProperty(id, "top");
    var leftMatch, topMatch;

    if (isNav4)
    {
        leftMatch = new Array( 0, left, "");
        topMatch = new Array( 0, top, "");
    }
    else if (isNav6 || isIE4 )
    {
        var splitexp = /([-0-9.]+)(\w+)/;
        leftMatch = splitexp.exec( left );
        topMatch = splitexp.exec( top );
        if (leftMatch == null || topMatch == null)
        {
            leftMatch = new Array(0, 0, "px");
            topMatch = new Array(0, 0, "px");
        }
    }
    left = ((additive) ? parseFloat( leftMatch[1] ) : 0) + xValue;
    top = ((additive) ? parseFloat( topMatch[1] ) : 0) + yValue;
    setIdProperty( id, "left", left + leftMatch[2] );
    setIdProperty( id, "top", top + topMatch[2] );
}

/*
 *
 * Move a given id to position (xValue, yValue)
 *
 */
function moveTo( id, x, y )
{
    generic_move( id, x, y, false );
}

/*
 *
 * Move a given id to (currentX + xValue, currentY + yValue)
 *
 */
function moveBy( id, x, y)
{
    generic_move( id, x, y, true );
}

/*
 *
 * Function used when converting rgb format colors
 * from Navigator 6 to a hex format
 *
 */ 
function hex( n )
{
    var hexdigits = "0123456789abcdef";
    return ( hexdigits.charAt(n >> 4) + hexdigits.charAt(n & 0x0f) );
}

/*
 *
 * Retrieve background color for a given id.
 * The value returned will be in hex format (#rrggbb)
 *
 */ 
function getBackgroundColor( id )
{
    var color;

    if (isNav4)
    {
        color = document[id].bgColor;
    }
    else if (isNav6)
    {
        var parseExp = /rgb.(\d+),(\d+),(\d+)./;
        var rgbvals;
        color = getIdProperty( id, "backgroundColor" );
        if (color)
        {
            rgbvals = parseExp.exec( color );
            if (rgbvals)
            {
                color = "#" + hex( rgbvals[1] ) + hex( rgbvals[2] ) +
                    hex( rgbvals[3] );
            }
        }
        return color;
    }
    else if (isIE4)
    {
        return document.all[id].backgroundColor;
    }
    return "";
}

/*
 *
 * Return a division's document
 * 
 */
function getDocument( divName )
{
    var doc;

    if (isNav4)
    {
        doc = window.document[divName].document;
    }
    else if (isNav6)
    {
        doc = document;
    }
    else if (isIE4)
    {
        doc = document;
    }
    return doc;
}
//CODE BY VRISKA OF THE COLLECTIVE (ramblingArachnid#8781)

//PLEASE INPUT YOUR SYSTEM ID BELOW, SURROUNDED BY DOUBLE QUOTES
const systemID = ""

//INCLUDE TOKEN BELOW (found by running pk;token) IF YOUR SYSTEM FRONT INFORMATION IS PRIVATE 
//MAKE SURE IT IS SURROUNDED BY DOUBLE QUOTES
const token = ""

// Use Display Names
// set true if you would like to use display names instead of names where available. Set to false to only use names.
const useDisplayNames = true 

// Use First Fronter's Color as Widget Background Color
// set to false if you would like to use black/white as opposed to the first fronter's color for the widget.
const useFirstFronterColorAsBackgroundColor = true

// FONT SIZES: only edit if necessary
const headerFontSize = 28
const dividerFontSize = 12 
const listFontSize = 22

//default 'white' and 'black' colors
const white = new Color("ffffff")
const black = new Color("000000")

//widget heading - 'Fronters' by default
const heading = 'Fronters' 

// fonts - leave "" for default system font.
// view font options at iosfonts.com
// copy-paste font name in between quotes
// for example, headerFontName = "Bradley Hand" or
// headerFontName = "Cochin-Italic"
const headerFontName = ""
const listFontName = ""

// DO NOT EDIT BELOW THIS UNLESS YOU KNOW WHAT YOU ARE DOING

var error = ""
var bgColor = white
var textColor = black

var headerFont = Font.systemFont(headerFontSize)
var dividerFont = Font.systemFont(dividerFontSize)
var listFont = Font.systemFont(listFontSize) 

if (headerFontName != "") {
  headerFont = new Font(headerFontName,headerFontSize)
}
if (listFontName != "") {
  listFont = new Font(listFontName, listFontSize)
}

list = []

const url = `https://api.pluralkit.me/v1/s/${systemID}/fronters`

const req = new Request(url);  
req.headers = {"Authorization":token};  

if (systemID == "") {
  error = "System not found."
}

if (error == "") {
  const resString = await req.loadString()

  if (!resString || resString[0].charAt(0) != '{') {  
    error = resString
    if (resString == "Unauthorized to view fronter.") {
      error += " Please add token to script or set front privacy to public."  
    }
    else if (resString == "System not found.") {
      error += " Please add system ID to script or double-check that you have added your ID correctly."  
    }  
  }
}

if (error == "") {
const res = await req.loadJSON()

//set widget color to current fronter's color if wanted
//widget text to either white or black to maintain contrast
//if no color set for member, use system light/dark mode setting
if (res.members.length > 0 && useFirstFronterColorAsBackgroundColor && res.members[0].color) 
{  
  memberColor = new Color(res.members[0].color);  
  if ((memberColor.red*0.299 + memberColor.green*0.587 + memberColor.blue*0.114) < 150) {
    textColor = white;
  }
}
else {
  memberColor = Color.dynamic(white, black);
  textColor = Color.dynamic(black,white);
}   

bgColor = memberColor;

// loop through members, get displayname if available, else use name 
if (res.members.length == 0) {
  list.push("No fronter");
} 
for (var i = 0; i<res.members.length;i++) {
  if (useDisplayNames && res.members[i].display_name) {
      list.push((res.members[i].display_name));
  }
  else {
      list.push((res.members[i].name));
  }
}

}

// create widget 
let widget = createWidget(list, bgColor, textColor)
Script.setWidget(widget)
Script.complete()

// code to create widget text
function createWidget(list, color, textcolor) {
  let w = new ListWidget()
  w.backgroundColor = color
  
  if (error != "") {
    errorTxt = w.addText(error);
    errorTxt.font = dividerFont
    return w
  }
  
  //display heading
  let titleTxt = w.addText(heading)
  titleTxt.textColor = textcolor
  titleTxt.font = headerFont
  
  // separator line underneath header
  line = w.addText("━━━━━━━━━━")
  line.font = dividerFont
  line.textColor = textcolor
  
  //display fronters list
  for (var i=0; i<list.length; i++) {
    let subTxt = w.addText(list[i])
    subTxt.textColor = textcolor
    subTxt.textOpacity = 0.8
    subTxt.font = listFont
  }
  w.addSpacer()
  
  return w
}

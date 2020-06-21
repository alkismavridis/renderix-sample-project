import RenderixComponent from "./RenderixComponent";

type TextNodeData = string | number | boolean;
type Attributes = object | null;
type TagName = string | { new(): RenderixComponent };


/** The data that you have to provide to renderix in order to create an html element (or text node) */
export type ElementData = [ TagName ] |      //tagName only
     [ TagName, ElementData[] ] |      //tagName + children
     [ TagName, TextNodeData ] |       //tagName + text contents
     [ TagName, null ] |               //tagName + empty contents
     [ TagName, Attributes, ElementData[] ] |   //tagName + parameters + children
     [ TagName, Attributes, TextNodeData ] |    //tagName + parameters + textNodeData
     [ TagName, Attributes, null ] |            //tagName + parameters + textNodeData

     TextNodeData |
     null |     // null does not render anything
     boolean;  //true will render a text node with text "true". False will not render anything


export type ContentData = ElementData[] | TextNodeData | null;

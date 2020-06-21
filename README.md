I created a sample rendering library.
I wrapped a sample project around it as a proof of concept.


It works using typescript, es6 modules and scss.


## The setup
I used webpack.
DONT PANIC, I had to do very little configuration.
You can find it all in /webpack directory.

to have fun:
```bash
npm install
npm run build
```
and then open in your browser: file:///PATH/TO/PROJECT/src/main/resources/main.html


### Compilation proccess:
1. JS
Webpack will compile all ts files (starting from /src/main/ts/ui/index.ts).
If a ts file does not get imported somewhere, it will not be included.
If you wish, you can change the entry point in webpack/webpack.config.js
One browser-friendly javascript file will be generated as out/bundle.js

2. CSS
All imported scss and css files will be combined in a single out/bundle.css file
If a css / scss file is not imported by any ts file, it will not be included.


## The architecture
I wanted to respect clean architecture principles.
I see a Frontend app as a layered application.

The business logic should not depend on the UI, nor should it depend
on any stupid framework that you would like to change tomorrow.

I wanted to separate the application layer (business logic) from the presentation layer (user interface).

Therefore, I created 2 layers:
- core: UI agnostic and framework agnostic. Core does the state management and sends signals to the UI when updates are needed.
Core does not know about the UI specifics. It does not care if it lies in a browser, or if you turned the whole thing into a nodejs CLI.
You wouldn't have to change a single line of code here.
Core uses interfaces to communicate with the UI, but does not care about the implementations.

- UI: does the implements the UI-interfaces. Accepts update signals from the core and sends user events into the code.
UI does not implement the business logic of the applcation, nor does it handles any state management other than DOM stuff.
Here, renderix comes into play.



## The Library
Renderix does not use any syntax-extension like react, angular, vue or svelte. It relies solely on ts.
Renderix uses structured data to create the components and give you util functions to updated them.
Renderix uses reusable components like other frameworks. So, your UI would consist of many renderix components that may refer to each other.

### The structured data:

The idea is very simple.
I wanted to represent the XML-like syntax of markup using the json-like syntax that js natively supports.

In its full form, every element has a tagname (string), a set of attributes (object) and a list of children (array).

So:
```html
<div title="hello">
    <span>Hello</span>
    <input>
</div>
```

would be:
```javascript
["div", {title:"Hello"}, [
    ["span", "hello"],
    ["input"]
]]
```


Give that to Renderix, and he will do all boring the document.createElement(), setAttribute, appendChild etc etc for you.

In its full form, element data is an array containing [TAG_NAME, ATTRIBUTES, CONTENT].

CONTENT might be:
- an array of element data,
- a string (for simple texts)
- a number (same as string),
- a boolean (true simply renders "true", false means don't render)
- null (means do not render).


ATTRIBUTES are always an object (or null). The keys may:
- start with a dot, such as: `{".onclick": myFunction}`
This indicates direct assignment on the element: `el.onclick = myFunction` will be executed during creation.
Useful to pass non-string properties.

- start with a slash, such as `{"/ref": myRef}` This indicates a "renderix special effect".
There is a number of special effects that serve as useful utils.
Your application can define its own too!

- start with anything else, such as: `{"title": "Hello"}`.
 This will perform `el.setAttribute()`, exept if value is false or null or undefined.
 Make sure that your value is a string or has a toString() method.

 TAG_NAME can be:
 - A legit tagname string such as "div", "span" etc.
 - A "!" to generate an html comment with no content.
 Renderix uses html comments as placeholders to make components appear/dissapear.
 So this will be are VERY useful when you want to update your component and make things happen.
 More of that later.

 - A renderix component class, such as FooComponent:
 ```javascript
 import FooComponent from "./FooComponent";

 // and then...

 ["div", null, [
     ["span", "This is a custom renderix component:"],
     [FooComponent, {myCoolParam:77}, null],
 ]]
 ```

 Renderix will create an instance of FooComponent and will render the content that it defines.


Element data can also be an array with **2 elements**:
**[TAG_NAME, CONTENT]** is exactly the same as **[TAG_NAME, null, CONTENT]**.

Element data can also be an array with **1 element**, which will only mean [TAG_NAME].
**[TAG_NAME]** is exactly the same as **[TAG_NAME, null, null]**.


Element data can also be a simple **string, a number, a boolean or null**.
The rules for those cases are exactly the same we saw in CONTENT.

 For example:
 ```javascript
 ["div", [
    [FooComponent],             //a custom component will be rendered
    ["span", "I am s span"],    // a span will be rendered
    "I am a string",            // a text node will be created
    "8",                        // also a text node,
    null,                       // nothing will be rendered
    ["!", {"/ref":myCoolRef}, null] //this will render an html comment that can be manipulated through myCoolRef
 ]]
 ```


## Renderix component
Create a ts file and define a class that implements the RenderixComponent interface.
Implement the render(props:any, children:ContentData) : ElementData
Return the content that you would like to be rendered, as in the examples above.

## Manipuating the dom using the util functions of ElementReference
TODO


## Special effects
TODO

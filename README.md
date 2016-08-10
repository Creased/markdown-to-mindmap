Markdown to Mindmap
===================

This project aims to assist in the converting process of a Markdown file to a
mindmap respecting the [FreeMind XML Schema](freemind.cvs.sourceforge.net/viewvc/freemind/freemind/freemind.xsd).

You'll finally be able to generate a mind map from a table of content of a Markdown file.

## Installation

Please take a look at [demo](demo) that demonstrates how to install this tool.

## Usage

```js
$("#button").on({
    click: function () {
        $().convertTOCtoMM({
            input:  $("#input"),  // Table of content input field selector
            output: $("#output")  // Output field selector to handle XML structure
        });
    }
});
```

## Example

### Input

```markdown
- [Demo MindMap - Website](https://www.bmoine.fr/)
	- Home Page
	- Header
		- Logo
		- Navigation links
	- Side Bar
		- Search
		- Contact info
		- Newsletter box
		- RSS options
	- Footer
		- Navigation links
		- Images
		- Privacy policy
	- Sub pages
		- Projects
		- Board info
		- Branches
		- Customers
```

### Output

```xml
<map version="1.0.1">
	<node TEXT="Demo MindMap - Website" LINK="https://www.bmoine.fr/">
		<node TEXT="Home Page"></node>
		<node TEXT="Header">
			<node TEXT="Logo"></node>
			<node TEXT="Navigation links"></node>
		</node>
		<node TEXT="Side Bar">
			<node TEXT="Search"></node>
			<node TEXT="Contact info"></node>
			<node TEXT="Newsletter box"></node>
			<node TEXT="RSS options"></node>
		</node>
		<node TEXT="Footer">
			<node TEXT="Navigation links"></node>
			<node TEXT="Images"></node>
			<node TEXT="Privacy policy"></node>
		</node>
		<node TEXT="Sub pages">
			<node TEXT="Projects"></node>
			<node TEXT="Board info"></node>
			<node TEXT="Branches"></node>
			<node TEXT="Customers"></node>
		</node>
	</node>
</map>
```

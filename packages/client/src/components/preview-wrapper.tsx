import styled from "@emotion/styled";
import { Box } from "@mui/material";


export const PreviewWrapper = styled(Box)`
background-color: tomato;
margin: 0 auto;
background-color:white;

/*	--------- FONT FAMILY --------
following are some optional font families. Usually a family
is safer to choose than a specific font,
which may not be on the users computer		*/
font-family:Georgia, Palatino, serif;
/    font-family:"Book Antiqua", Palatino, serif;
/    font-family:Arial, Helvetica, sans-serif;
/    font-family:Tahoma, Verdana, Geneva, sans-serif;
/    font-family:Courier, monospace;
/    font-family:"Times New Roman", Times, serif;

/*	-------------- COLOR OPTIONS ------------
following are additional color options for base font
you could uncomment another one to easily change the base color
or add one to a specific element style below         */
color: #333333; /* dark gray not black */
/    color: #000000; /* black */
/    color: #666666; /* medium gray  black */
/    color: #E3E3E3; /* very light gray */
/    color: white;

line-height: 1;
/    max-width: 960px;
max-width: 800px;
padding: 30px;
font-size: 18px;

p   {
/    font-size: 22px;
    line-height: 150%;
/    max-width: 540px;
    max-width: 960px;
    font-weight: 400;
     color: #333333
}


h1, h2, h3, h4 {
/    color: #111111;
    font-weight: 400;
}

h2, h3, h4, h5, p {
    margin-bottom: 25px;
    padding: 0;
}

h1 {
    margin-bottom: 10px;
    font-size:300%;
    padding: 0px;
    font-variant:small-caps;
}

h2 {
    font-size:150%
/    margin: 24px 0 6px;
}

h3 {
    font-size:120%
}
h4 {
    font-size:100%
    font-variant:small-caps;

}
h5 {
    font-size:80%
    font-weight: 100;
}

h6 {
    font-size:80%
    font-weight: 100;
    color:red;
    font-variant:small-caps;
}
a {
    color: grey;
    margin: 0;
    padding: 0;
    vertical-align: baseline;
}
a:hover {
    text-decoration: blink;
    color: green;
}
a:visited {
    color: black;
}
ul, ol {
    padding: 0;
    margin: 0px 0px 0px 50px;
}
ul {
    list-style-type: square;
    list-style-position: inside;

}

li {
     line-height:150%
}
li ul, li ul {
    margin-left: 24px;
}

pre {
    padding: 0px 24px;
    max-width: 800px;
    white-space: pre-wrap;
}
code {
    font-family: Consolas, Monaco, Andale Mono, monospace;
    line-height: 1.5;
    font-size: 13px;
}
aside {
    display: block;
    float: right;
    width: 390px;
}
blockquote {
    border-left:.5em solid #eee;
    padding: 0 1em;
    margin-left:0;
    max-width: 476px;
}
blockquote  cite {
 /   font-size:14px;
    line-height:20px;
    color:#bfbfbf;
}
blockquote cite:before {
    content: '\\2014 \\00A0';
}

blockquote p {
    color: #666;
    max-width: 460px;
}
hr {
/    width: 540px;
    text-align: left;
    margin: 0 auto 0 0;
    color: #999;
}
`;

export default PreviewWrapper;
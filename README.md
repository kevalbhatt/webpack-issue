# webpack-issue


I want to create a jquery plugin with **UMD** support using es6 and "**webpack**" so I started with the design but after the build, I saw I have one test.js file with my code and all the dependency in it.

So I configured webpack to create vendor chunk.

>It is **working**  if I run the project with both the js. i.e **test.js & vendor.js.**
> 
> 
> 
> but If I try to use the **test.js** without **vendor.js** then the
> **test.js** file is not called.


Run following command to reproduce the issue.

```js
npm install
npm run dev
```
http://0.0.0.0:9099
open cansole you can see two outputs.

>plugin called
>File Called


**Now got to http://0.0.0.0:9099/index-external-vendor.html and check, cansole is clear because file is not called** .

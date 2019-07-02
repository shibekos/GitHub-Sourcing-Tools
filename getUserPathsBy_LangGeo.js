var reg = (o, n) => o ? o[n] : '';
var cn = (o, s) => o ? o.getElementsByClassName(s) : console.log(o);
var tn = (o, s) => o ? o.getElementsByTagName(s) : console.log(o);
var gi = (o, s) => o ? o.getElementById(s) : console.log(o);
var rando = (n) => Math.round(Math.random() * n);
var delay = (ms) => new Promise(res => setTimeout(res, ms));

function downloadr(arr2D, filename) {
  var data = /\.json$|.js$/.test(filename) ? JSON.stringify(arr2D) : arr2D.map(el=> el.reduce((a,b) => a+'\t'+b )).reduce((a,b) => a+'\r'+b);
  var type = /\.json$|.js$/.test(filename) ? 'data:application/json;charset=utf-8,' : 'data:text/plain;charset=utf-8,';
  var file = new Blob([data], {    type: type  });
  if (window.navigator.msSaveOrOpenBlob) {
    window.navigator.msSaveOrOpenBlob(file, filename);
  } else {
    var a = document.createElement('a'),
    url = URL.createObjectURL(file);
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    }, 10);
  }
}

async function gitSearch(obj,p) {
  var res = await fetch(`https://github.com/search?l=${obj.lang}&o=${obj.order}&p=${p}&q=location%3A${obj.geo}&s=${obj.sort}&type=Users`);
  var text = await res.text();
  var doc = new DOMParser().parseFromString(text, 'text/html');
  return doc;
}
// gitSearch()

async function loopGitSearch(lang,geoName){
  var containArr = [];
  var search = {lang: lang, order: "asc", geo: geoName, sort: "repositories"};
  var doc = await gitSearch(search,1);
  var results = reg(/[\d,]+(?=\s+users)/.exec(cn(doc,'flex-md-row flex-justify-between')[0].innerText),0).replace(/\D+/g,'');
  var totalPages = results ? parseInt(results) / 10 : 0;
  var pages2Loop = totalPages > 100 ? 100 : totalPages;
  var items = Array.from(cn(doc,'user-list-info')).map(el => reg(/(?<=github.com\/).+/.exec(tn(el,'a')[0].href),0));
  items.forEach(el=> {if(containArr.every(itm => itm != el)) containArr.push(el)});

  async function loopAlternates(searchObj){
    for(var i=1; i<=pages2Loop; i++){
      var doc2 = await gitSearch(searchObj,i);
      var item2 = Array.from(cn(doc2,'user-list-info')).map(el => reg(/(?<=github.com\/).+/.exec(tn(el,'a')[0].href),0));
      item2.forEach(el=> {if(containArr.every(itm => itm != el)) containArr.push(el)});
      await delay(rando(150)+1500);
    }
  }

  await loopAlternates(search);

  if(totalPages > 100){
    await loopAlternates({lang: lang, order: "desc", geo: geoName, sort: "repositories"});
  }

  if(totalPages > 200){
    await loopAlternates({lang: lang, order: "desc", geo: geoName, sort: "joined"});
    await loopAlternates({lang: lang, order: "asc", geo: geoName, sort: "joined"});
  }

  if(totalPages > 300){
    await loopAlternates({lang: lang, order: "desc", geo: geoName, sort: "followers"});
    await loopAlternates({lang: lang, order: "asc", geo: geoName, sort: "followers"});
    await loopAlternates({lang: lang, order: "desc", geo: geoName, sort: ""});
    await loopAlternates({lang: lang, order: "asc", geo: geoName, sort: ""});
  }

  console.log(containArr);
  downloadr(containArr,lang+'_'+geoName.replace(/\+/g,'-')+'.json');
}
async function loopLangsByLocal(targetGeo){
  var targetlangs = ["ActionScript","C","Clojure","CoffeeScript","Go","Haskell","Lua","MATLAB","Objective-C","Perl","R","Scala","Shell","Swift","TeX","\"Vim+script\"","\"1C+Enterprise\"","ABAP","ABNF","Ada","\"Adobe+Font+Metrics\"","Agda","\"AGS+Script\"","Alloy","\"Alpine+Abuild\"","\"Altium+Designer\"","AMPL","AngelScript","\"Ant+Build+System\"","ANTLR","ApacheConf","Apex","\"API+Blueprint\"","APL","\"Apollo+Guidance+Computer\"","AppleScript","Arc","AsciiDoc","ASN.1","ASP","AspectJ","Assembly","Asymptote","ATS","Augeas","AutoHotkey","AutoIt","Awk","Ballerina","Batchfile","Befunge","Bison","BitBake","Blade","BlitzBasic","BlitzMax","Bluespec","Boo","Brainfuck","Brightscript","C-ObjDump","\"C2hs+Haskell\"","\"Cabal+Config\"","\"Cap'n+Proto\"","CartoCSS","Ceylon","Chapel","Charity","ChucK","Cirru","Clarion","Clean","Click","CLIPS","\"Closure+Templates\"","\"Cloud+Firestore+Security+Rules\"","CMake","COBOL","ColdFusion","\"ColdFusion+CFC\"","COLLADA","\"Common+Lisp\"","\"Common+Workflow+Language\"","\"Component+Pascal\"","CoNLL-U","Cool","Coq","Cpp-ObjDump","Creole","Crystal","CSON","Csound","\"Csound+Document\"","\"Csound+Score\"","CSV","Cuda","CWeb","Cycript","Cython","D","D-ObjDump","\"Darcs+Patch\"","Dart","DataWeave","desktop","Dhall","Diff","\"DIGITAL+Command+Language\"","DM","\"DNS+Zone\"","Dockerfile","Dogescript","DTrace","Dylan","E","Eagle","Easybuild","EBNF","eC","\"Ecere+Projects\"","ECL","ECLiPSe","EditorConfig","\"Edje+Data+Collection\"","edn","Eiffel","EJS","Elixir","Elm","\"Emacs+Lisp\"","EmberScript","EML","EQ","Erlang","F%23","F*","Factor","Fancy","Fantom","\"FIGlet+Font\"","\"Filebench+WML\"","Filterscript","fish","FLUX","Formatted","Forth","Fortran","FreeMarker","Frege","G-code","\"Game+Maker+Language\"","GAMS","GAP","\"GCC+Machine+Description\"","GDB","GDScript","Genie","Genshi","\"Gentoo+Ebuild\"","\"Gentoo+Eclass\"","\"Gerber+Image\"","\"Gettext+Catalog\"","Gherkin","\"Git+Attributes\"","\"Git+Config\"","GLSL","Glyph","\"Glyph+Bitmap+Distribution+Format\"","GN","Gnuplot","Golo","Gosu","Grace","Gradle","\"Grammatical+Framework\"","\"Graph+Modeling+Language\"","GraphQL","\"Graphviz+(DOT)\"","Groovy","\"Groovy+Server+Pages\"","Hack","Haml","Handlebars","HAProxy","Harbour","Haxe","HCL","HiveQL","HLSL","HolyC","HTML%2BDjango","HTML%2BECR","HTML%2BEEX","HTML%2BERB","HTML%2BPHP","HTML%2BRazor","HTTP","HXML","Hy","HyPhy","IDL","Idris","\"Ignore+List\"","\"IGOR+Pro\"","\"Inform+7\"","INI","\"Inno+Setup\"","Io","Ioke","\"IRC+log\"","Isabelle","\"Isabelle+ROOT\"","J","Jasmin","\"Java+Properties\"","\"Java+Server+Pages\"","JavaScript%2BERB","JFlex","Jison","\"Jison+Lex\"","Jolie","JSON","\"JSON+with+Comments\"","JSON5","JSONiq","JSONLD","Jsonnet","JSX","Julia","\"KiCad+Layout\"","\"KiCad+Legacy+Layout\"","\"KiCad+Schematic\"","Kit","Kotlin","KRL","LabVIEW","Lasso","Latte","Lean","Less","Lex","LFE","LilyPond","Limbo","\"Linker+Script\"","\"Linux+Kernel+Module\"","Liquid","\"Literate+Agda\"","\"Literate+CoffeeScript\"","\"Literate+Haskell\"","LiveScript","LLVM","Logos","Logtalk","LOLCODE","LookML","LoomScript","LSL","\"LTspice+Symbol\"","M","M4","M4Sugar","Makefile","Mako","Markdown","Marko","Mask","Mathematica","\"Maven+POM\"","Max","MAXScript","mcfunction","MediaWiki","Mercury","Meson","Metal","MiniD","Mirah","Modelica","Modula-2","Modula-3","\"Module+Management+System\"","Monkey","Moocode","MoonScript","\"Motorola+68K+Assembly\"","MQL4","MQL5","MTML","MUF","mupad","Myghty","nanorc","NCL","Nearley","Nemerle","nesC","NetLinx","NetLinx%2BERB","NetLogo","NewLisp","Nextflow","Nginx","Nim","Ninja","Nit","Nix","NL","NSIS","Nu","NumPy","ObjDump","Objective-C%2B%2B","Objective-J","ObjectScript","OCaml","Omgrofl","ooc","Opa","Opal","OpenCL","\"OpenEdge+ABL\"","\"OpenRC+runscript\"","OpenSCAD","\"OpenType+Feature+File\"","Org","Ox","Oxygene","Oz","P4","Pan","Papyrus","Parrot","\"Parrot+Assembly\"","\"Parrot+Internal+Representation\"","Pascal","Pawn","Pep8","\"Perl+6\"","Pic","Pickle","PicoLisp","PigLatin","Pike","PLpgSQL","PLSQL","Pod","\"Pod+6\"","PogoScript","Pony","PostCSS","PostScript","\"POV-Ray+SDL\"","PowerBuilder","PowerShell","Processing","Prolog","\"Propeller+Spin\"","\"Protocol+Buffer\"","\"Public+Key\"","Pug","Puppet","\"Pure+Data\"","PureBasic","PureScript","\"Python+console\"","\"Python+traceback\"","q","QMake","QML","Quake","Racket","Ragel","RAML","Rascal","\"Raw+token+data\"","RDoc","REALbasic","Reason","Rebol","Red","Redcode","\"Regular+Expression\"","Ren'Py","RenderScript","reStructuredText","REXX","RHTML","\"Rich+Text+Format\"","Ring","RMarkdown","RobotFramework","Roff","\"Roff+Manpage\"","Rouge","RPC","\"RPM+Spec\"","RUNOFF","Rust","Sage","SaltStack","SAS","Sass","Scaml","Scheme","Scilab","SCSS","sed","Self","ShaderLab","ShellSession","Shen","Slash","Slice","Slim","Smali","Smalltalk","Smarty","SMT","Solidity","SourcePawn","SPARQL","\"Spline+Font+Database\"","SQF","SQL","SQLPL","Squirrel","\"SRecode+Template\"","\"SSH+Config\"","Stan","\"Standard+ML\"","Stata","STON","Stylus","\"SubRip+Text\"","SugarSS","SuperCollider","Svelte","SVG","SystemVerilog","Tcl","Tcsh","Tea","Terra","Text","Textile","Thrift","\"TI+Program\"","TLA","TOML","TSQL","TSX","Turing","Turtle","Twig","TXL","\"Type+Language\"","TypeScript","\"Unified+Parallel+C\"","\"Unity3D+Asset\"","\"Unix+Assembly\"","Uno","UnrealScript","UrWeb","Vala","VCL","Verilog","VHDL","\"Visual+Basic\"","Volt","Vue","\"Wavefront+Material\"","\"Wavefront+Object\"","wdl","\"Web+Ontology+Language\"","WebAssembly","WebIDL","WebVTT","\"Windows+Registry+Entries\"","wisp","Wollok","\"World+of+Warcraft+Addon+Data\"","\"X+BitMap\"","\"X+Font+Directory+Index\"","\"X+PixMap\"","X10","xBase","XC","XCompose","XML","Xojo","XPages","XProc","XQuery","XS","XSLT","Xtend","Yacc","YAML","YANG","YARA","YASnippet","ZAP","Zeek","ZenScript","Zephir","Zig","ZIL","Zimpl"];
 for(var i=0; i<targetlangs.length; i++){
  await loopGitSearch(targetlangs[i],targetGeo);
  await delay(rando(550)+5500);
 }
}
loopLangsByLocal('Atlanta');

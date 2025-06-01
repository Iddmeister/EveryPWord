
current_letter = "f"
current_wordlist = current_letter+"_en_full.js"

//Add wordslist to page
var script = document.createElement("script");
script.src = "words/"+current_wordlist;
document.getElementsByTagName("head")[0].appendChild(script);
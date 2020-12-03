const ElementNode = require("./ElementNode");
const TextNode = require("./TextNode");


const Parser = function(text){
    this.text = text;
    this.pos = -1;
    this.tokenPos = -1;
    this.tokens = [];
    this.current_char;
    this.nextToken();
}

Parser.prototype.nextChar = function(){
    this.pos += 1;
    this.current_char = this.text[this.pos];
}

Parser.prototype.nextToken = function(){
    this.tokenPos += 1;
    return this.tokens[this.tokenPos];
}


Parser.prototype.lexer = function(){

    this.nextChar()
    while(this.current_char !== undefined){
        switch(this.current_char){
            case "\r":
                this.nextChar()
                break;
            case "\n":
                this.nextChar()
                break;
            case " ":
                this.nextChar()
                break;
            case "<":
                let token = this.buildElementToken();
                this.tokens.push(token);
                break;
            default:
                let data = this.buildData();
                this.tokens.push(data);
        }
    }

    return this.tokens;

}


Parser.prototype.buildElementToken = function(){
    let token = this.current_char;
    this.nextChar();

    while(this.current_char !== undefined){
        if(this.current_char === ">") {
            token += this.current_char;
            this.nextChar();
            break;
        }
        token += this.current_char;
        this.nextChar();
    }
    return token;
}

Parser.prototype.buildData = function(){
    let data = this.current_char;
    let i = 0
    this.nextChar();

    while(this.current_char !== "<"){
        if(this.current_char === undefined) break;

        data += this.current_char
        this.nextChar();
    }
    return  data;
}


Parser.prototype.parse = function(){
    // let token;
    // while((token = this.nextToken()) !== undefined){
        
        // if(token.startsWith("<!DOCTYPE")) continue;

        // if(token.startsWith("<")){
        //     let nt = token.split("<")[1].split(">")[0];
        //     nt = nt.startsWith("/") ? nt.split("/")[1] : nt;
        //     // console.log(nt)
        // }else{
        //     console.log(token)
        // }

       
        // console.log( token)

    // }

    return this.createElementNode();
  
}

Parser.prototype.createElementNode = function(){
    let token = this.tokens[this.tokenPos]

    if(token.startsWith("<!DOCTYPE")) token = this.nextToken();

    if(token.startsWith("<")){
        let elementName = token.split("<")[1].split(">")[0].split(" ")[0];
        let elementNode = new ElementNode(elementName, token);

        this.addAttributes(token,elementNode);
      
        if(elementName === "input" || elementName ==="br" || elementName ==="meta" 
            || elementName ==="img" || elementName ==="link" || elementName ==="hr"){
            // console.log(token, `${elementName}`)
            return elementNode;
        }else{
            
            while((token = this.nextToken()) !== `</${elementName}>`){
                // console.log(token, `${elementName}`)
                let childElement = this.createElementNode();
          
                elementNode.addChild(childElement.type, childElement);
            }
            return elementNode;
        }

    }else{
        return new TextNode(token);
    }
    
}


Parser.prototype.splitAttributes = function(token){
    return attributes = token.split(">")[0].split(" ").filter(attr => !attr.startsWith("<"));

}


Parser.prototype.addAttributes = function(token, element){
    let attributes = this.splitAttributes(token);
  
    if(attributes.length > 0){
       

        if(element.element.startsWith("<meta name")){
       
            let [name, nameValue] = attributes[0].split("=")
      
            let content = attributes[1].split("=")[0];
            let contentValue = attributes[1].split("content=")[1];
            console.log("value", contentValue)
            if(attributes.length > 2){
                for(let i = 2; i < attributes.length; i++){
                    let value = attributes[i]/*.split("\"")[1]*/;
                    contentValue += value;
                }
            }

            element.attributes[name] = nameValue.split("\"")[1];
            element.attributes[content] = contentValue.split("\"")[1];
            
        }else{
            attributes.forEach((attribute)=>{
                let [key, value] = attribute.trim().split("=");
                element.attributes[key] = value.split("\"")[1];
            })
        }
    }
}





module.exports = Parser;






// Doctype
// input
// br
// />
// meta
// img
// link
// hr


//split attributes
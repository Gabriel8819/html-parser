const { prototype } = require("module");

const ElementNode = function(type, element){
    this.type = type;
    this.element = element
    this.attributes = {}
    this.children = {};
}

ElementNode.prototype.addChild = function(type, elementNode){
    this.children[type] = this.children[type] || [];
    this.children[type].push(elementNode);
}

ElementNode.prototype.addAttribute = function(key,value){
    this.attributes[key] = value;
}

ElementNode.prototype.getChildren = function(type){
    let children = this.children;

    if(type != undefined){
        if(this.children.hasOwnProperty(type)){
            children = this.children[type];
        }else{
            children = [];
        }
    }
    return children;
}


ElementNode.prototype.getdocumentTypes = function(type){
    let elements = [];

    if(type !== undefined){
        elements.push(...this.getAllElements(this, type))

    }else{
        elements.push(...this.getAllElements(this));
    }

    return elements;
}



ElementNode.prototype.getAllElements = function(element, type){
    let elements = [];
    if(element.hasOwnProperty("children")){
        for(let child in element.children){
            
            element.children[child].forEach((childElement)=>{
                
                if(type !== undefined){
                    if(childElement.type === type){
                        elements.push(childElement);
                        let newElements = this.getAllElements(childElement, type);
                        elements.push(...newElements)
                    }else{
                        let newElements = this.getAllElements(childElement, type);
                        elements.push(...newElements)
                    }
                }else{
                    elements.push(childElement);
                    let newElements = this.getAllElements(childElement);
                    elements.push(...newElements)
                }
            })
        }
    }

    return elements;

}


ElementNode.prototype.getText = function(){



}











module.exports = ElementNode;







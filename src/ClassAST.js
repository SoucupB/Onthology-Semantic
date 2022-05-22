import * as tk from "./TokensFunctions"

var componentsEnum = {};
var onthologyArray = [];
const Components = [
  'set',
  'implies',
  'concept-instances',
  'declaration',
  'disjoint',
  'none',
  '(',
  ')',
  'full-reset',
  'or',
  'some',
  'instance',
  'root-node',
  'separators'
]

const ComponentsChildren = {
  'set': [
    'set', '('
  ],
  'concept-instances': [
    'set', '('
  ],
  'disjoint': [
    'set', '('
  ],
  'full-reset': [
  ],
  'implies': [
    'set', '('
  ],
  'or': [
    'set', '('
  ],
  'some': [
    'set', '('
  ],
  'instance': [
    'set', '('
  ]
}

export function _enumConstruct() {
  let index = 1;
  Components.forEach((element) => function(element) {
    componentsEnum[element] = index++;
  }(element))
}

export class OnthologyObject {
  constructor(type) {
    this.name = type;
    this.type = class_GetEnumValue(type);
    if(!this.type) {
      this.type = class_GetEnumValue('set');
    }
    this.children = [];
    this.complementary = null;
    this.displayName = this.name;
  }

  addChild(child) {
    if(child) {
      this.children.push(child)
    }
  }

  addComplementary(obj) {
    this.complementary = obj;
  }

  isCompatible(nextObj) {
    let preds = ComponentsChildren[this.name]
    if(!preds || !nextObj) {
      return false;
    }

    for(let i = 0; i < preds.length; i++) {
      if(nextObj.type == class_GetEnumValue(preds[i])) {
        return true;
      }
    }
    return false;
  }

  typeAsString() {
    for(const [key, value] of Object.entries(componentsEnum)) {
      if(value == this.type) {
        return key;
      }
    }
    return 'none'
  }

}

export function class_GetEnumValue(enumVal) {
  if(' \n\t'.indexOf(enumVal) != -1) {
    return componentsEnum['separators']
  }

  if(enumVal in componentsEnum) {
    return componentsEnum[enumVal]
  }
  return null
}

export function class_AddToOnthologyArray(element) {
  onthologyArray.push(element)
}

export function class_GetToken(code, index) {
  let token = tk.token_GetCurrentToken(code, index);
  if(token) {
    return token;
  }
  return null;
}

export function class_Init() {
  _enumConstruct();
}

export function class_ToString_t(node, stre) {
  stre[0] += `${node.displayName}`;
  for(let i = 0; i < node.children.length; i++) {
    class_ToString_t(node.children[i], stre)
  }
  if(node.complementary) {
    class_ToString_t(node.complementary, stre)
  }
}

export function class_EmbedName_t(node, styleMap) {
  if(!node) {
    return ;
  }

  if(node.name == ' ') {
    node.displayName = `&nbsp`
  }

  if(node.name == '\n') {
    node.displayName = '</br>'
  }

  if(node.typeAsString() in styleMap) {
    node.displayName = `<span style = 'color: ${styleMap[node.typeAsString()]}'>${node.name}</span>`
  }
  for(let i = 0; i < node.children.length; i++) {
    class_EmbedName_t(node.children[i], styleMap)
  }
  if(node.complementary) {
    class_EmbedName_t(node.complementary, styleMap)
  }
}

export function class_EmbedName(node, styleMap) {
  class_EmbedName_t(node, styleMap);
}

export function class_ToString(node) {
  let strResponse = ['']
  if(node.type != class_GetEnumValue('root-node')) {
    return '';
  }

  for(let i = 0; i < node.children.length; i++) {
    class_ToString_t(node.children[i], strResponse)
  }
  return strResponse[0];
}

export function class_NodeSize(node) {
  if(!node) {
    return 0;
  }
  let sz = node.name.length;
  for(let i = 0; i < node.children.length; i++) {
    sz += class_NodeSize(node.children[i]);
  }
  sz += class_NodeSize(node.complementary);
  return sz;
}
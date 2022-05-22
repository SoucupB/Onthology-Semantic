/*
(full-reset)

(implies A B)
(instance I A)
(concept-instances B)

(implies A (or B C))
(implies A (some r C))

(disjoint B A)
(concept-instances r)
*/


function parser_GetCurrentNode(allTokens: string[], index: number[]) {
  return parser_GetCurrentNode_t(allTokens, index);
}


function parser_GetCurrentNode_t(allTokens: string[], index: number[], shouldCloseParanth = false) {
  if(index[0] >= allTokens.length) {
    return null;
  }

  let currentNode = new OnthologyObject(allTokens[index[0]]);
  if(!currentNode) {
    return null;
  }

  index[0]++;

  while(index[0] < allTokens.length && class_GetEnumValue(allTokens[index[0]]) == class_GetEnumValue('separators')) {
    currentNode.addChild(new OnthologyObject(allTokens[index[0]]))
    index[0]++;
  }

  switch(currentNode.type) {

    case class_GetEnumValue(')'): {
      if(!shouldCloseParanth) {
        return null;
      }
      break;
    }

    case class_GetEnumValue('instance'): {
      let left = parser_GetCurrentNode_t(allTokens, index);
      let right = parser_GetCurrentNode_t(allTokens, index)
      if(!currentNode.isCompatible(left) || !currentNode.isCompatible(right)) {
        return null;
      }
      currentNode.addChild(left)
      currentNode.addChild(right)
      break;
    }

    case class_GetEnumValue('or'): {
      let left = parser_GetCurrentNode_t(allTokens, index);
      let right = parser_GetCurrentNode_t(allTokens, index);
      if(!currentNode.isCompatible(left) || !currentNode.isCompatible(right)) {
        return null;
      }
      currentNode.addChild(left)
      currentNode.addChild(right)
      break;
    }

    case class_GetEnumValue('some'): {
      let left = parser_GetCurrentNode_t(allTokens, index);
      let right = parser_GetCurrentNode_t(allTokens, index)
      if(!currentNode.isCompatible(left) || !currentNode.isCompatible(right)) {
        return null;
      }
      currentNode.addChild(left)
      currentNode.addChild(right)
      break;
    }

    case class_GetEnumValue('disjoint'): {
      let left = parser_GetCurrentNode_t(allTokens, index);
      let right = parser_GetCurrentNode_t(allTokens, index)
      if(!currentNode.isCompatible(left) || !currentNode.isCompatible(right)) {
        return null;
      }
      currentNode.addChild(left)
      currentNode.addChild(right)
      break;
    }

    case class_GetEnumValue('concept-instances'): {
      let nextChild = parser_GetCurrentNode_t(allTokens, index)
      if(!currentNode.isCompatible(nextChild)) {
        return null;
      }
      currentNode.addChild(nextChild)
      break;
    }

    case class_GetEnumValue('full-reset'): {
      break;
    }

    case class_GetEnumValue('('): {
      let currentElement = parser_GetCurrentNode_t(allTokens, index);
      if(!currentElement) {
        return null;
      }
      currentNode.addChild(currentElement)
      let closeParanthNode = parser_GetCurrentNode_t(allTokens, index, true);
      if(!closeParanthNode || closeParanthNode.type != class_GetEnumValue(')')) {
        return null;
      }
      currentNode.addComplementary(closeParanthNode);
      break;
    }
    case class_GetEnumValue('implies'): {
      let left = parser_GetCurrentNode_t(allTokens, index);
      let right = parser_GetCurrentNode_t(allTokens, index)
      if(!currentNode.isCompatible(left) || !currentNode.isCompatible(right)) {
        return null;
      }
      currentNode.addChild(left)
      currentNode.addChild(right)
      break;
    }

    default: {
      break;
    }
  }
  return currentNode;
}

function parser_CreateAST(code: string, parsedIndex: number[]) {
  if(!code) {
    return null;
  }

  let index = [0];
  let allTokens = [];
  let resp = class_GetToken(code, index);
  let astArray = [];
  while(resp) {
    allTokens.push(resp);
    resp = class_GetToken(code, index);
  }
  let cIndex = [0]
  let node = parser_GetCurrentNode(allTokens, cIndex)
  while(node) {
    astArray.push(node);
    parsedIndex[0] += class_NodeSize(node)
    node = parser_GetCurrentNode(allTokens, cIndex)
  }

  let parentNode = new OnthologyObject('root-node');
  for(let i = 0; i < astArray.length; i++) {
    parentNode.addChild(astArray[i])
  }

  return parentNode;
}

function parser_Init() {

}
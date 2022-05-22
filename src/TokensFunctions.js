import * as ut from "./Utils"

const SpecialKeys = [
  {
    name: 'implies',
    func: (chr) => {
      return ut._isSmallAlpha(chr);
    }
  },
  {
    name: 'instance',
    func: (chr) => {
      return ut._isSmallAlpha(chr);
    }
  },
  {
    name: '(',
    func: (chr) => {
      return chr == '(';
    }
  },
  {
    name: ')',
    func: (chr) => {
      return chr == ')';
    }
  },
  {
    name: 'full-reset',
    func: (chr) => {
      return ut._isSmallAlpha(chr) || chr == '-';
    }
  },
  {
    name: 'concept-instances',
    func: (chr) => {
      return ut._isSmallAlpha(chr) || chr == '-';
    }
  },
  {
    name: 'or',
    func: (chr) => {
      return ut._isSmallAlpha(chr);
    }
  },
  {
    name: 'disjoint',
    func: (chr) => {
      return ut._isSmallAlpha(chr);
    }
  },
  {
    name: 'some',
    func: (chr) => {
      return ut._isSmallAlpha(chr);
    }
  },
  {
    name: ' ',
    func: (chr) => {
      return chr == ' ';
    }
  },
  {
    name: '\n',
    func: (chr) => {
      return chr =='\n';
    }
  },
  {
    name: '\t',
    func: (chr) => {
      return chr =='\t';
    }
  }
]


export function _getTokenBy(code, index, token, testingCondition) {
  let str = '';
  let cIndex = index[0];
  let stringSize = 0;
  while(cIndex < code.length && (!token || stringSize < token.length) && testingCondition(code[cIndex])) {
    str += code[cIndex];
    cIndex++;
    stringSize++;
  }
  if(!token) {
    index[0] = cIndex;
    return true
  }
  if(str == token) {
    index[0] = cIndex;
    return true
  }
  return false;
}

export function token_GetCurrentToken(code, index) {
  for(let i = 0; i < SpecialKeys.length; i++) {
    if(_getTokenBy(code, index, SpecialKeys[i]['name'], SpecialKeys[i]['func'])) {
      return SpecialKeys[i]['name'];
    }
  }
  let cIndex = index[0];
  if(_isSet(code, index)) {
    return code.substr(cIndex, index[0] - cIndex);
  }
  return null;
}

export function _isSet(code, index) {
  return _getTokenBy(code, index, null, function(ch) {
    return ut._isAlpha(ch);
  })
}

const SpecialKeys = [
  {
    name: 'implies',
    func: (chr: string) => {
      return _isSmallAlpha(chr);
    }
  },
  {
    name: 'instance',
    func: (chr: string) => {
      return _isSmallAlpha(chr);
    }
  },
  {
    name: '(',
    func: (chr: string) => {
      return chr == '(';
    }
  },
  {
    name: ')',
    func: (chr: string) => {
      return chr == ')';
    }
  },
  {
    name: 'full-reset',
    func: (chr: string) => {
      return _isSmallAlpha(chr) || chr == '-';
    }
  },
  {
    name: 'concept-instances',
    func: (chr: string) => {
      return _isSmallAlpha(chr) || chr == '-';
    }
  },
  {
    name: 'or',
    func: (chr: string) => {
      return _isSmallAlpha(chr);
    }
  },
  {
    name: 'disjoint',
    func: (chr: string) => {
      return _isSmallAlpha(chr);
    }
  },
  {
    name: 'some',
    func: (chr: string) => {
      return _isSmallAlpha(chr);
    }
  },
  {
    name: ' ',
    func: (chr: string) => {
      return chr == ' ';
    }
  },
  {
    name: '\n',
    func: (chr: string) => {
      return chr =='\n';
    }
  },
  {
    name: '\t',
    func: (chr: string) => {
      return chr =='\t';
    }
  }
]


function _getTokenBy(code: string, index: number[], token: string | null, testingCondition: Function) {
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

function token_GetCurrentToken(code: string, index: number[]) {
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

function _isSet(code: string, index: number[]) {
  return _getTokenBy(code, index, null, function(ch: string) {
    return _isAlpha(ch);
  })
}
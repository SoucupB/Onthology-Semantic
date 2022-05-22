export function _isSmallAlpha(ch) {
  return ch >= 'a' && ch <= 'z';
}

export function _isBigAlpha(ch) {
  return ch >= 'A' && ch <= 'Z';
}

export function _isAlpha(ch){
  return _isSmallAlpha(ch) || _isBigAlpha(ch);
}

export function _isDigit(ch) {
  return ch >= '0' && ch <= '9';
}

export function _isLanguageRelatedCharacter(chr) {
  let relatedChars = ";-_/+-*()[]";
  if(_isAlpha(chr)) {
    return true;
  }
  if(_isDigit(chr)) {
    return true;
  }
  return relatedChars.indexOf(`${chr}`, relatedChars) !== -1;
}
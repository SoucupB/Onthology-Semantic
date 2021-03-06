import * as vscode from 'vscode';
import * as pl from "./Parser";
import * as cl from "./ClassAST";

const tokenTypes = new Map<string, number>();
const tokenModifiers = new Map<string, number>();

const legend = (function () {
	const tokenTypesLegend = [
		'comment', 'string', 'keyword', 'number', 'regexp', 'operator', 'namespace',
		'type', 'struct', 'class', 'interface', 'enum', 'typeParameter', 'function',
		'method', 'decorator', 'macro', 'variable', 'parameter', 'property', 'label'
	];
	tokenTypesLegend.forEach((tokenType, index) => tokenTypes.set(tokenType, index));

	const tokenModifiersLegend = [
		'declaration', 'documentation', 'readonly', 'static', 'abstract', 'deprecated',
		'modification', 'async'
	];
	tokenModifiersLegend.forEach((tokenModifier, index) => tokenModifiers.set(tokenModifier, index));

	return new vscode.SemanticTokensLegend(tokenTypesLegend, tokenModifiersLegend);
})();

export function activate(context: vscode.ExtensionContext) {
	context.subscriptions.push(vscode.languages.registerDocumentSemanticTokensProvider({ language: 'racer'}, new DocumentSemanticTokensProvider(), legend));
}

interface IParsedToken {
	line: number;
	startCharacter: number;
	length: number;
	tokenType: string;
	tokenModifiers: string[];
}

class DocumentSemanticTokensProvider implements vscode.DocumentSemanticTokensProvider {
	async provideDocumentSemanticTokens(document: vscode.TextDocument, token: vscode.CancellationToken): Promise<vscode.SemanticTokens> {
		const allTokens = this._parseText(document.getText());
		const builder = new vscode.SemanticTokensBuilder();
		allTokens.forEach((token) => {
			builder.push(token.line, token.startCharacter, token.length, this._encodeTokenType(token.tokenType), this._encodeTokenModifiers(token.tokenModifiers));
		});
		return builder.build();
	}

	private _encodeTokenType(tokenType: string): number {
		if (tokenTypes.has(tokenType)) {
			return tokenTypes.get(tokenType)!;
		} else if (tokenType === 'notInLegend') {
			return tokenTypes.size + 2;
		}
		return 0;
	}

	private _encodeTokenModifiers(strTokenModifiers: string[]): number {
		let result = 0;
		for (let i = 0; i < strTokenModifiers.length; i++) {
			const tokenModifier = strTokenModifiers[i];
			if (tokenModifiers.has(tokenModifier)) {
				result = result | (1 << tokenModifiers.get(tokenModifier)!);
			} else if (tokenModifier === 'notInLegend') {
				result = result | (1 << tokenModifiers.size + 2);
			}
		}
		return result;
	}

	private _findAllNewlines(text: string): number[] {
		let newLines: number[] = [];
		for(let i = 0; i < text.length; i++) {
			if(text[i] === '\n') {
				newLines.push(i);
			}
		}
		return newLines;
	}

	private _findLine(index: number, newLines: number[]): number {
		let currentIndex = 0;
		if(newLines.length && newLines[currentIndex] > index) {
			return -1;
		}
		while(currentIndex < newLines.length) {
			if(currentIndex && newLines[currentIndex] > index) {
				return newLines[currentIndex - 1];
			}
			currentIndex++;
		}
		return 0;
	}

	private _findLineIndex(index: number, newLines: number[]): number {
		let currentIndex = 0;
		if(newLines.length && newLines[currentIndex] > index) {
			return -1;
		}
		while(currentIndex < newLines.length) {
			if(currentIndex && newLines[currentIndex] > index) {
				return currentIndex - 1;
			}
			currentIndex++;
		}
		return 0;
	}

	private _parseText(text: string): IParsedToken[] {
		const r: IParsedToken[] = [];
		let nnIndex = [0]
		let ast = pl.parser_CreateAST(text, nnIndex);
		const colors = {
			"implies": "typeParameter",
			"concept-instances": "typeParameter",
			"set": "number",
			"disjoint": "typeParameter",
			"or": "class",
			"some": "class",
			"instance": "typeParameter",
			"full-reset": "typeParameter"
		}
		const arrColors = pl.parser_FindInfos(ast, colors);
		let newLines = this._findAllNewlines(text);	

		for(let i = 0; i < arrColors.length; i++) {
			let theNewLine = this._findLine(arrColors[i].offset, newLines);
	  	let lineIndex = this._findLineIndex(arrColors[i].offset, newLines);
			r.push(
				{
					line: lineIndex + 1,
					startCharacter: arrColors[i].offset - theNewLine - 1,
					length: arrColors[i].len,
					tokenType: arrColors[i].type,
					tokenModifiers: []
				}
			);
		}
		return r;
	}

	private _parseTextToken(text: string): { tokenType: string; tokenModifiers: string[]; } {
		const parts = text.split('.');
		return {
			tokenType: parts[0],
			tokenModifiers: parts.slice(1)
		};
	}
}

cl.class_Init();
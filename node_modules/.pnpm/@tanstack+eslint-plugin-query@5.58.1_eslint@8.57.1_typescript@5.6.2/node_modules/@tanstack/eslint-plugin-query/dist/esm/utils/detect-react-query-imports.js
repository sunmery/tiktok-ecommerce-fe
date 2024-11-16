import { TSESTree } from "@typescript-eslint/utils";
function detectTanstackQueryImports(create) {
  return (context, optionsWithDefault) => {
    const tanstackQueryImportSpecifiers = [];
    const helpers = {
      isSpecificTanstackQueryImport(node, source) {
        return !!tanstackQueryImportSpecifiers.find((specifier) => {
          if (specifier.type === TSESTree.AST_NODE_TYPES.ImportSpecifier && specifier.parent.type === TSESTree.AST_NODE_TYPES.ImportDeclaration && specifier.parent.source.value === source) {
            return node.name === specifier.local.name;
          }
          return false;
        });
      },
      isTanstackQueryImport(node) {
        return !!tanstackQueryImportSpecifiers.find((specifier) => {
          if (specifier.type === TSESTree.AST_NODE_TYPES.ImportSpecifier) {
            return node.name === specifier.local.name;
          }
          return false;
        });
      }
    };
    const detectionInstructions = {
      ImportDeclaration(node) {
        if (node.specifiers.length > 0 && node.importKind === "value" && node.source.value.startsWith("@tanstack/") && node.source.value.endsWith("-query")) {
          tanstackQueryImportSpecifiers.push(...node.specifiers);
        }
      }
    };
    const ruleInstructions = create(context, optionsWithDefault, helpers);
    const enhancedRuleInstructions = {};
    const allKeys = new Set(
      Object.keys(detectionInstructions).concat(Object.keys(ruleInstructions))
    );
    allKeys.forEach((instruction) => {
      enhancedRuleInstructions[instruction] = (node) => {
        var _a, _b;
        if (instruction in detectionInstructions) {
          (_a = detectionInstructions[instruction]) == null ? void 0 : _a.call(detectionInstructions, node);
        }
        if (ruleInstructions[instruction]) {
          return (_b = ruleInstructions[instruction]) == null ? void 0 : _b.call(ruleInstructions, node);
        }
        return void 0;
      };
    });
    return enhancedRuleInstructions;
  };
}
export {
  detectTanstackQueryImports
};
//# sourceMappingURL=detect-react-query-imports.js.map

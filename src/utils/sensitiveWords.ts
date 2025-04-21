// 敏感词过滤工具函数

// 字典树节点
interface TrieNode {
  children: Map<string, TrieNode>;
  isEndOfWord: boolean;
}

// 创建字典树节点
function createTrieNode(): TrieNode {
  return {
    children: new Map(),
    isEndOfWord: false,
  };
}

// 构建字典树
function buildTrie(words: string[]): TrieNode {
  const root = createTrieNode();

  for (const word of words) {
    let current = root;
    for (const char of word) {
      if (!current.children.has(char)) {
        current.children.set(char, createTrieNode());
      }
      current = current.children.get(char)!;
    }
    current.isEndOfWord = true;
  }

  return root;
}

// 敏感词列表
const sensitiveWords = [
  '暴力',
  '色情',
  '赌博',
  '毒品',
  '政治',
  '反动',
  '诈骗',
  '侮辱',
  '歧视',
  '谩骂',
  // 可以根据需要添加更多敏感词
];

// 构建敏感词字典树
const sensitiveWordsTrie = buildTrie(sensitiveWords);

/**
 * 过滤文本中的敏感词，用星号替换
 * @param text 需要过滤的文本
 * @returns 过滤后的文本
 */
export function filterSensitiveWords(text: string): string {
  if (!text) return text;

  let result = text;
  let position = 0;

  while (position < text.length) {
    let current = sensitiveWordsTrie;
    let matchLength = 0;
    let tempPosition = position;

    while (
      tempPosition < text.length &&
      current.children.has(text[tempPosition])
    ) {
      current = current.children.get(text[tempPosition])!;
      matchLength++;
      tempPosition++;

      if (current.isEndOfWord) {
        // 找到敏感词，用星号替换
        const stars = '*'.repeat(matchLength);
        result = result.substring(0, position) + 
                stars + 
                result.substring(position + matchLength);
        break;
      }
    }
    position++;
  }

  return result;
}
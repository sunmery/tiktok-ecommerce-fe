// Rules: https://stylelint.io/user-guide/rules

export default {
	'extends': [
		'stylelint-config-standard',
		'stylelint-config-standard-scss',
		'stylelint-config-recess-order',
	],
	'rules': {
		// 重复
		// 块不允许重复的自定义属性
		'declaration-block-no-duplicate-custom-properties': true,
		// 块不允许重复的属性
		'declaration-block-no-duplicate-properties': true,
		// 禁止字体系列中的重复名称
		'font-family-no-duplicate-names': true,
		// 禁止在关键帧块中使用重复的选择器
		// 'keyframe-block-no-duplicate-selectors': true,
		// 禁止重复的@import
		'no-duplicate-at-import-rules': true,
		// 禁止重复的选择器
		// 'no-duplicate-selectors': [
		// true,
		// {
		// 	disallowInList: true
		// }
		// ],

		// 空
		// 禁止空块
		'block-no-empty': true,
		// 禁止空注释
		// 'comment-no-empty': true,
		// 禁止空源, \t\t 与 \n 都被认为是错误
		'no-empty-source': true,

		// Invalid 无效
		// 不允许无效的十六进制颜色
		'color-no-invalid-hex': true,
		// 禁止函数中使用 calc 无效的无空格运算符
		'function-calc-no-unspaced-operator': true,
		// 禁止 !important 关键帧内无效声明
		'keyframe-declaration-no-important': true,
		// 禁止无效的媒体查询
		'media-query-no-invalid': true,
		// 禁止无效的命名网格区域
		'named-grid-areas-no-invalid': true,
		// 禁止无效的双斜杠注释
		'no-invalid-double-slash-comments': true,
		// 不允许无效的仓 @import 位规则
		'no-invalid-position-at-import-rule': true,
		// 禁止字符串中使用无效换行符
		// 禁止字符串中使用无效换行
		'string-no-newline': true,

		// Irregular 规则
		// 不允许使用不规则的空格
		'no-irregular-whitespace': true,

		// Missing 缺斤少两
		// 禁止自定义属性缺少 var 函数
		'custom-property-no-missing-var-function': true,
		// 禁止字体系列中缺少通用系列关键字a { font: 1em/1.3 Times; } 是错误
		'font-family-no-missing-generic-family-keyword': true,

		// Non-standard 非标准性
		// 不允许线性梯度函数使用非标准方向值
		// 类似 .foo { background: linear-gradient(top, #fff, #000); } 是错误
		'function-linear-gradient-no-nonstandard-direction': true,

		// Overrides 重写
		// 不允许覆盖相关手写属性的速记属性
		// 错误示例:
		// a {
		//   padding-left: 10px;
		//   padding: 20px;
		// }
		'declaration-block-no-shorthand-property-overrides': true,

		// Unmatchable 不匹配的操作
		// 禁止使用不匹配的 An+B 选择器
		'selector-anb-no-unmatchable': true,

		// Unknown 未知: true,
		// '不允许未知批注': true,
		'annotation-no-unknown': true,
		// 禁止未知的 at 规则
		'at-rule-no-unknown': true,
		// 不允许声明中属性的未知值
		'declaration-property-value-no-unknown': true,
		// 禁止未知函数
		'function-no-unknown': true,
		// 不允许未知的媒体功能名称
		'media-feature-name-no-unknown': true,
		// 不允许媒体功能的未知值
		'media-feature-name-value-no-unknown': true,
		// 禁止未知动画
		'no-unknown-animations': true,
		// 禁止未知的自定义属性
		'no-unknown-custom-properties': true,
		// 禁止未知属性
		'property-no-unknown': true,
		// 不允许未知的伪类选择器
		'selector-pseudo-class-no-unknown': true,
		// 禁止未知的伪元素选择器
		'selector-pseudo-element-no-unknown': true,
		// 禁止未知类型选择器
		'selector-type-no-unknown': true,
		// 不允许未知单位
		'unit-no-unknown': true,

		// Enforce conventions 强制执行约定
		// 禁止供应商前缀?
		'property-no-vendor-prefix': null,
		'no-descending-specificity': null,

		// Length 长度
		// 不允许使用长度为零的单位
		// 'length-zero-no-unit': true,

		// Case 大小写
		// CSS的函数的关键名字要求为特定的大小写, 可选值, lower: 小写, upper: 大写
		'function-name-case': 'lower',
		// 为类型选择器指定小写或大写
		'selector-type-case': 'lower',
		// 为关键字值指定小写或大写
		'value-keyword-case': 'lower',

		// Empty lines 空行
		// 要求或禁止在 @ 规则之前使用空行
		// 错误示例:
		// 1. a {} @media {}
		// 2. 中间没有空行:
		// a {}
		// @media {}
		'at-rule-empty-line-before': 'always',
		// 要求或禁止在注释前使用空行 可选值: never: 注释前不允许空行, always: 注释前必须有空行
		'comment-empty-line-before': [
			'always',
			{
				'except': ['first-nested'],
			},
		],
		// 要求或禁止在自定义属性之前使用空行
		'custom-property-empty-line-before': 'always',
		// 要求或禁止在声明前, 例如 --bar: pink 使用空行可选值: always: 回车区分, never: 不回车区分
		'declaration-empty-line-before': 'never',
		// 要求或禁止在规则前使用空行
		'rule-empty-line-before': 'never',

		// Max & min 最大值和最小值
		// 限制单行声明块中的字段数量
		// a { color: pink; top: 3px; } 是错误, 因为超过了1个属性
		'declaration-block-single-line-max-declarations': 1,
		// 限制声明中属性列表的值数
		// 'declaration-property-max-values':
		// 样式嵌套最大层数
		// https://stylelint.io/user-guide/rules/max-nesting-depth/
		'max-nesting-depth': [
			4,
			{
				'ignore': ['blockless-at-rules', 'pseudo-classes'],
			},
		],
		// 限制数字中允许的小数位数
		'number-max-precision': 2,
		// 限制选择器中属性选择器的数量
		'selector-max-attribute': 3,
		// 限制选择器中的类数
		'selector-max-class': 3,
		// 限制选择器中的运算器数量
		'selector-max-combinators': 1,
		// 限制选择器中的选择器数量
		// 'selector-max-compound-selectors': 1,
		// 限制选择器中 ID 选择器的数量
		'selector-max-id': 1,
		// 限制选择器中的伪类数
		'selector-max-pseudo-class': 1,
		// 限制选择器的特异性
		// 'selector-max-specificity': 2,
		// 限制选择器中的类型选择器数量
		'selector-max-type': 2,
		// 限制选择器中通用选择器的数量
		'selector-max-universal': 1,
		// 限制时间值的最小毫秒数
		'time-min-milliseconds': 1,

		// Notation 表示形式
		// 指定 alpha 值的百分比或数字表示法, 可选值: "number"|"percentage", 不选则允许数字与百分比的表示
		// 'alpha-value-notation': 'percentage',
		// 指定 color-functions 的现代或传统表示法, 可选值: "modern": 需要逗号, "legacy": 不需要逗号, 以空格区分
		'color-function-notation': 'modern',
		// 指定十六进制颜色的短表示法或长表示法,  可选值: "short"|"long"
		// 'color-hex-length': 'short',
		// 指定字体粗细的数字或命名表示法
		// 'font-weight-notation': '',
		// 指定度数色调的数字或角度表示法
		// 'hue-degree-notation': '',
		// 指定规则的 @import 字符串或 URL 表示法, "string": 以引号表示, "url": 以url(xx)表示
		'import-notation': 'url',
		// 指定关键帧选择器的关键字或百分比表示法
		'keyframe-selector-notation': 'percentage-unless-within-keyword-only-block',
		// 指定亮度的数字或百分比表示法
		// 指定媒体功能范围的上下文或前缀表示法, 可选择: "percentage"|"number"
		// 'lightness-notation': '',
		// 正确示例:
		// @media (width >= 1px) {}
		// @media (1px <= width <= 2px) {}
		'media-feature-range-notation': 'context',
		// 为 :not() 伪类选择器指定简单或复杂表示法, 可选值: "simple"|"complex"
		// 'selector-not-notation': '',
		// 为适用的伪元素选择器指定单冒号或双冒号表示
		'selector-pseudo-element-colon-notation': 'double',

		// Pattern 模式
		// 指定注释的模式
		// 'comment-pattern': '',
		// 为自定义媒体查询名称指定模式
		// 'custom-media-pattern': '',
		// 指定自定义属性的模式
		// 'custom-property-pattern': '',
		// 指定关键帧名称的模式
		// 'keyframes-name-pattern': '',
		// 为类选择器指定模式允许类名以大写字母或者小写字母开头，并且可以包含连字符 -
		'selector-class-pattern': '^([a-z][a-z0-9]*)(-[a-z][a-z]*)*$',
		// 指定 ID 选择器的模式
		'selector-id-pattern': '^([a-z][a-z0-9]*)(-[a-z][a-z]*)*$',
		// 为嵌套在规则中的规则选择器指定模式
		// 'selector-nested-pattern': '',

		// Quotes 引号
		// 要求或禁止字体系列名称使用引号,  期望每个不是关键字的字体系列名称周围都有引号
		'font-family-name-quotes': 'always-unless-keyword',
		// 要求或禁止 url 使用引号
		'function-url-quotes': 'never',
		// 要求或禁止属性值使用引号, always: 必须加引号, never: 不需要加引号
		'selector-attribute-quotes': 'always',

		// Redundant 冗余
		// 禁止在声明块中使用冗余的 longhand 属性
		// 'declaration-block-no-redundant-longhand-properties': [
		// 	'true',
		// {
		// 	["padding", "/border/"],
		// },
		// ],
		// 不允许在速记属性中使用冗余值
		// 'shorthand-property-no-redundant-values': '',

		// Whitespace inside 内部空白
		// 要求或禁止在注释标记的内部使用空格。
		'comment-whitespace-inside': 'always',
	},
}

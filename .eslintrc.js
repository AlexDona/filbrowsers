module.exports = {
  root: true,
  'env': {
    'browser': true,
    'es6': true,
    'node': true
  },
  extends: [
    'plugin:vue/essential',
    'eslint:recommended'
  ],
  parserOptions: {
    ecmaVersion: 2020,
  },
  rules: {
    "no-unused-vars": 0,      // 语法校验不通过时不阻止程序运行
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    // 缩进规则-空两格
    'indent': [2, 2, {
      'SwitchCase': 1
    }],
    'arrow-parens': 0,
    // 使用反勾号、单引号、不允许使用双引号
    'quotes': [0, 'single', {
      'avoidEscape': true,
      'allowTemplateLiterals': true
    }],
  }
};
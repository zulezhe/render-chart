// 只包含可自动修复的错误
const should_be_const = 'this should be const';  // 可自动修复：var -> const

function test_function() {
  const x = 1;  // 可自动修复：var -> const
  return x;
}

// 缺少分号（可自动修复）
const missing_semicolon = 'hello';

// 双引号（可自动修复）
const double_quotes = 'should be single quotes';

// 缩进问题（可自动修复）
const bad_indent = 'wrong indentation';
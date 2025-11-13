// 这是一个包含lint错误的测试文件
const unused_variable = 'this should be const';  // 错误：应该使用const而不是var
let another_unused;  // 错误：未使用的变量

function bad_function() {
  console.log('missing semicolon');  // 错误：缺少分号
  return undefined;
}

// 错误：使用双引号而不是单引号
const bad_string = 'should use single quotes';

// 错误：缩进不正确
const bad_indent = 'wrong indentation';
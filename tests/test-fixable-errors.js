/*
 * @Author: oliver
 * @Date: 2025-11-11 09:10:36
 * @LastEditors: oliver
 * @LastEditTime: 2025-11-11 09:10:49
 * @Description: 
 */
// 这个文件包含可以自动修复的lint错误
const should_be_const = 'this should be const';  // 可自动修复：var -> const
const should_be_const_too = 'also should be const';  // 可自动修复：let -> const

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